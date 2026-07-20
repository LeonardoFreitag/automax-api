# Prompt para o programador Delphi — Integração ERP AutoMax x App de Estoque

> Copie e envie este documento para o desenvolvedor Delphi responsável pelo
> ERP AutoMax. Ele descreve tudo que precisa ser implementado no ERP para
> integrar com o novo controle de estoque de matéria-prima do app mobile
> (AutoMaxPro).

## Contexto

Foi criado no app mobile (usado no almoxarifado) um controle de estoque de
matéria-prima com duas funcionalidades:

1. **Inventário** — o usuário conta fisicamente a matéria-prima no
   almoxarifado e lança as quantidades encontradas no app.
2. **Baixa de estoque** — o usuário retira matéria-prima do almoxarifado
   para atender pedidos de produção e lança as quantidades retiradas no app.

Esses lançamentos ficam armazenados em uma API própria do app (Node.js +
PostgreSQL, hospedada em `https://automax.htcode.net`), separada do banco
Firebird do ERP. **O ERP precisa: (1) alimentar essa API com a lista de
matéria-prima e (2) buscar periodicamente nessa API os inventários e baixas
lançados no app para atualizar o estoque real na tabela `ESTOQUE` do
Firebird.**

Não existe replicação automática entre os dois bancos — a integração
funciona via chamadas HTTP (REST/JSON) que o ERP Delphi precisa fazer.

## Autenticação

Todas as rotas abaixo exigem um token JWT. Faça login com um usuário
administrador já cadastrado no app (o mesmo mecanismo hoje usado para
sincronizar o catálogo de produtos de venda):

```
POST https://automax.htcode.net/users/sessions
Content-Type: application/json

{
  "email": "<email do usuário admin>",
  "password": "<senha>"
}
```

Resposta:
```json
{
  "user": { "id": "uuid", "customerId": "uuid", ... },
  "token": "jwt...",
  "refreshToken": "jwt..."
}
```

Guarde `token` e envie em toda requisição seguinte no header:
```
Authorization: Bearer <token>
```

O `token` expira em **1 dia**. Antes de expirar (ou ao receber `401`), renove
com:
```
POST https://automax.htcode.net/users/sessions/refreshToken
Content-Type: application/json

{ "refreshToken": "<refreshToken salvo>" }
```

Guarde também o `customerId` do usuário logado — ele é obrigatório em quase
todas as chamadas abaixo (identifica a empresa/cliente no sistema).

## Parte 1 — Enviar o catálogo de matéria-prima para a API

O app precisa de uma cópia da matéria-prima cadastrada em `ESTOQUE` para
permitir a busca e a leitura de QR code. Rotina sugerida: um job/rotina no
ERP que roda periodicamente (ex.: a cada sincronização de dados, ou uma vez
por dia) e envia cada item de matéria-prima para a API.

### ⚠️ Confirmar com o time AutoMax

A tabela `ESTOQUE` parece conter todo o catálogo (produtos de venda,
serviços, matéria-prima etc. — há colunas de ICMS, NCM, grupo, etc.).
**Precisamos do critério exato que identifica quais linhas de `ESTOQUE` são
matéria-prima de chão de fábrica** (ex.: um `COD_GRUPO`/`GRUPO` específico,
o campo `TIPO`, `SERVICO`, ou outro). Ajuste o `WHERE` abaixo assim que esse
critério for confirmado — o SELECT abaixo é um ponto de partida, não a
versão final.

```sql
SELECT
  CODIGO,
  REFERENCIA,
  DESCRICAO,
  MEDIDA
FROM ESTOQUE
WHERE ATIVO = 1
  -- AND <critério que identifica matéria-prima> -- TODO: confirmar
```

### Mapeamento de campos (ESTOQUE → API)

| Firebird (`ESTOQUE`) | Campo na API (`stockProduct`) | Observação |
| --- | --- | --- |
| `CODIGO` (INTEGER) | `code` (string) | Converter para string ao enviar. |
| `REFERENCIA` (VARCHAR 20) | `reference` | **É o campo usado para gerar o QR code impresso na etiqueta do item.** Se o item não tiver código de barras, repita o valor de `CODIGO` aqui (mesma regra que já é seguida hoje). |
| `DESCRICAO` (VARCHAR 60) | `description` | |
| `MEDIDA` (VARCHAR 30) | `unity` | |

### Requisição

Para cada item de matéria-prima (criação ou atualização — a API já faz
upsert por `code`, não precisa se preocupar em saber se é novo ou existente):

```
POST https://automax.htcode.net/stockProduct
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "<customerId do usuário logado>",
  "code": "<CODIGO convertido para string>",
  "reference": "<REFERENCIA, ou CODIGO se REFERENCIA vazio>",
  "description": "<DESCRICAO>",
  "unity": "<MEDIDA>"
}
```

Resposta: o objeto criado/atualizado, com um `id` (uuid) — não precisa
guardar esse `id` no Firebird, a API já resolve o item pelo `code` nas
próximas chamadas.

## Parte 2 — Baixar inventários lançados no app e atualizar o estoque

O usuário do almoxarifado conta a matéria-prima no app e "conclui" um
inventário. O ERP deve consultar periodicamente (sugestão: a cada 5–15
minutos, via job agendado) os inventários pendentes e aplicar as
quantidades contadas na tabela `ESTOQUE`.

### 1. Buscar inventários pendentes

```
GET https://automax.htcode.net/inventory?customerId=<customerId>&downloaded=false
Authorization: Bearer <token>
```

Retorna uma lista de inventários (cada um com `id`, `userId`, `userName`,
`status`, `downloaded`). `status` pode ser `"em_andamento"` (usuário ainda
contando) ou `"finalizado"` (usuário concluiu a contagem). **Recomendação:
só processe inventários com `status: "finalizado"`**, para não aplicar uma
contagem parcial no estoque. Combine com o time se preferem esperar o
`"finalizado"` ou processar continuamente — hoje a API permite as duas
formas.

### 2. Buscar os itens contados

```
GET https://automax.htcode.net/inventory/item?inventoryId=<id do inventário>
Authorization: Bearer <token>
```

Retorna uma lista de itens, cada um com: `code`, `reference`, `description`,
`unity`, `quantity`.

### 3. Atualizar o estoque no Firebird

Para cada item, o inventário **define** a quantidade atual (é a contagem
física, não um incremento):

```sql
UPDATE ESTOQUE
SET QTDATUAL = :quantity
WHERE CODIGO = :code
```

Se `CODIGO = :code` não existir em `ESTOQUE` (item cadastrado só depois da
última sincronização, por exemplo), registre o erro/log para tratamento
manual — não pare o processamento dos demais itens.

### 4. Marcar o inventário como processado

Depois de aplicar **todos** os itens de um inventário com sucesso:

```
PATCH https://automax.htcode.net/inventory/downloaded?id=<id do inventário>&downloaded=true
Authorization: Bearer <token>
```

Isso remove o inventário da lista de pendentes na próxima consulta. Se o
processo falhar no meio (alguns itens aplicados, outros não), **não** marque
como `downloaded=true` — assim ele continua aparecendo como pendente e pode
ser reprocessado (idempotente, já que o `UPDATE` sempre define o valor
final, não incrementa).

## Parte 3 — Baixar retiradas de estoque (baixa) e dar baixa no Firebird

Mesmo fluxo da Parte 2, trocando "inventário" por "baixa de estoque" e
trocando a lógica de atualização (aqui é **decremento**, não definição):

### 1. Buscar baixas pendentes

```
GET https://automax.htcode.net/stockWithdrawal?customerId=<customerId>&downloaded=false
Authorization: Bearer <token>
```

Mesma recomendação da Parte 2: processar preferencialmente os com
`status: "finalizado"`.

### 2. Buscar os itens retirados

```
GET https://automax.htcode.net/stockWithdrawal/item?stockWithdrawalId=<id da baixa>
Authorization: Bearer <token>
```

Retorna itens com `code`, `reference`, `description`, `unity`, `quantity`.

### 3. Dar baixa no Firebird

```sql
UPDATE ESTOQUE
SET QTDATUAL = QTDATUAL - :quantity
WHERE CODIGO = :code
```

### 4. Marcar como processado

```
PATCH https://automax.htcode.net/stockWithdrawal/downloaded?id=<id da baixa>&downloaded=true
Authorization: Bearer <token>
```

⚠️ Ao contrário do inventário (que só define o valor final), a baixa
**decrementa** — por isso é importante só marcar `downloaded=true` depois de
aplicar o decremento com sucesso, para não correr risco de aplicar duas
vezes o mesmo decremento em um reprocessamento.

## Script Firebird — tabela de controle (recomendado, opcional)

Não é obrigatório nenhum `ALTER TABLE` em `ESTOQUE` — todos os campos
necessários (`CODIGO`, `REFERENCIA`, `DESCRICAO`, `MEDIDA`, `QTDATUAL`) já
existem. Mas é recomendável criar uma tabela de log/controle no Firebird
para registrar quais inventários/baixas já foram aplicados por esta rotina
— serve tanto como auditoria (rastrear quando e quem processou) quanto como
proteção extra contra reprocessamento duplicado, independente do controle
`downloaded` que já existe do lado da API:

```sql
CREATE TABLE APP_ESTOQUE_SYNC_LOG (
  ID              INTEGER NOT NULL,
  TIPO            VARCHAR(20) NOT NULL,   -- 'INVENTORY' ou 'WITHDRAWAL'
  ID_REMOTO       VARCHAR(36) NOT NULL,   -- id (uuid) do inventário/baixa vindo da API
  QTD_ITENS       INTEGER,
  PROCESSADO_EM   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT PK_APP_ESTOQUE_SYNC_LOG PRIMARY KEY (ID)
);

CREATE UNIQUE INDEX UK_APP_ESTOQUE_SYNC_LOG ON APP_ESTOQUE_SYNC_LOG (TIPO, ID_REMOTO);

CREATE GENERATOR GEN_APP_ESTOQUE_SYNC_LOG_ID;

SET TERM ^ ;
CREATE TRIGGER APP_ESTOQUE_SYNC_LOG_BI FOR APP_ESTOQUE_SYNC_LOG
ACTIVE BEFORE INSERT POSITION 0
AS
BEGIN
  IF (NEW.ID IS NULL) THEN
    NEW.ID = GEN_ID(GEN_APP_ESTOQUE_SYNC_LOG_ID, 1);
END^
SET TERM ; ^
```

Uso sugerido: antes de processar um inventário/baixa, verifique se já existe
uma linha em `APP_ESTOQUE_SYNC_LOG` com aquele `TIPO` + `ID_REMOTO` (o
índice único garante que não dá pra inserir duplicado); se não existir,
processe os itens e insira o registro de controle.

## Referência rápida de endpoints

Base URL: `https://automax.htcode.net`. Todas exigem
`Authorization: Bearer <token>`.

| Método | Rota | Uso pelo ERP |
| --- | --- | --- |
| POST | `/users/sessions` | Login (obter token). |
| POST | `/users/sessions/refreshToken` | Renovar token expirado. |
| POST | `/stockProduct` | Enviar/atualizar um item de matéria-prima. |
| GET | `/inventory?customerId=&downloaded=false` | Listar inventários pendentes. |
| GET | `/inventory/item?inventoryId=` | Itens contados de um inventário. |
| PATCH | `/inventory/downloaded?id=&downloaded=true` | Marcar inventário como processado. |
| GET | `/stockWithdrawal?customerId=&downloaded=false` | Listar baixas pendentes. |
| GET | `/stockWithdrawal/item?stockWithdrawalId=` | Itens de uma baixa. |
| PATCH | `/stockWithdrawal/downloaded?id=&downloaded=true` | Marcar baixa como processada. |

## Pontos em aberto para confirmar antes de codificar

1. **Critério de "matéria-prima"** dentro de `ESTOQUE` (Parte 1) — qual
   coluna/valor separa matéria-prima de outros produtos cadastrados na
   mesma tabela.
2. **Esperar `status: "finalizado"` ou processar continuamente?** — decidir
   se o job só aplica inventários/baixas já concluídos pelo usuário no app,
   ou se aplica incrementalmente enquanto ele ainda está contando.
3. **Frequência do job** de sincronização (catálogo e download) — sugestão:
   catálogo 1x/dia, inventário/baixa a cada 5–15 min, mas fica a critério do
   time.
4. **Qual usuário admin** o ERP vai usar para login (`email`/`password`) —
   confirmar credenciais com Leonardo antes de subir para produção.
