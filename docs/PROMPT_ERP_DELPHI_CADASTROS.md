# Prompt para o programador Delphi — Integração ERP AutoMax x App de Vendas (cadastros)

> Companheiro de [`PROMPT_ERP_DELPHI.md`](PROMPT_ERP_DELPHI.md), que trata só do
> estoque de matéria-prima. **Este documento cobre a sincronização de cadastros
> do lado de vendas** — cliente, produto de venda, tabela de preço e vendedor —
> e as mudanças de contrato que entraram na API em **agosto/2026**.
>
> Se a integração do ERP já roda hoje, comece pela seção
> "⚠️ Mudanças que exigem ação" — o resto é referência.

## ⚠️ Mudanças que exigem ação

| O que mudou | Impacto no ERP |
| --- | --- |
| **As rotas `/user` passaram a exigir token JWT.** Antes eram abertas. | Se a rotina que sincroniza vendedores chamava `POST /user`, `PATCH /user`, `GET /user` ou `DELETE /user` **sem** o header `Authorization`, ela passa a receber `401`. Faça login antes (ver "Autenticação") e mande o token em todas elas. |
| **Login de vendedor desativado devolve `403`**, não `401`. | Se o ERP faz login com um usuário de serviço, e esse usuário for desativado, o erro vem como `403` com `"Acesso desativado. Procure a retaguarda."` — não adianta tentar renovar o token. |
| **Cadastro não se apaga mais: desativa-se.** | Vendedor, produto e matéria-prima ganharam rotas de status. Ver "Ativar/desativar cadastros". |
| **Listagens de produto passam a devolver só ativos.** | Rotinas de conferência que esperam o catálogo inteiro precisam mandar `includeInactive=true`. |
| **`POST /client` deduplica por CNPJ.** | Reenviar um cliente que já existe com o mesmo CNPJ **atualiza** o cadastro e devolve o `id` existente, em vez de criar duplicata. É seguro reenviar a carga inteira. |

Nada disso quebra dados já gravados: todo cadastro existente nasceu ativo, e os
campos novos de cliente têm default seguro.

## Autenticação

Base URL: `https://automax.htcode.net`. **Todas** as rotas deste documento
exigem token JWT.

```
POST /users/sessions
Content-Type: application/json

{ "email": "<email do usuário admin>", "password": "<senha>" }
```

Resposta: `{ "user": { "id", "customerId", ... }, "token": "jwt...", "refreshToken": "jwt..." }`

Envie em toda requisição seguinte:
```
Authorization: Bearer <token>
```

O `token` expira em **1 dia**; renove com `POST /users/sessions/refreshToken`
mandando `{ "refreshToken": "<refreshToken salvo>" }`. Guarde também o
`customerId`, obrigatório em quase todas as chamadas.

> **Atenção:** se o usuário de serviço do ERP for desativado, tanto o login
> (`403`) quanto a renovação (`401`) param de funcionar, e os refresh tokens
> dele são descartados. Nesse caso o token precisa vir de outro usuário — não
> adianta insistir na renovação.

## Parte 1 — Cadastro de clientes

### Campos novos

Cinco campos que o cadastro do ERP sempre teve e a integração nunca levava.
Todos são **opcionais**, com default seguro — se você não enviar nada, a carga
atual continua funcionando exatamente como hoje.

| Campo na API | Tipo | Default | Origem sugerida no ERP | Observação |
| --- | --- | --- | --- | --- |
| `creditLimit` | número | `0` | `CLIENTES.CREDITO` | `0` é lido pelos consumidores como "sem limite definido". |
| `discountRate` | número | `0` | `CLIENTES.TAXA_DESCONTO` | Teto de desconto do cliente. |
| `initialDiscountLimit` | inteiro | `0` | `CLIENTES.LIMITE_INICIAL_DESCONTO` | Faixa a partir da qual o desconto vale. |
| `blocked` | booleano | `false` | `CLIENTES.BLOQUEADO` | **Bloqueio manual da retaguarda.** |
| `blockReason` | texto | `""` | `CLIENTES.MOTIVO_BLOQUEIO` | Motivo do bloqueio manual. |

**`blocked` não é o mesmo que `financialPendency`.** Os dois existem de
propósito e o ERP deve alimentar os dois:

- `financialPendency` é **calculada** — vem do contas a receber e muda sozinha
  quando o cliente paga;
- `blocked` é **decisão manual** da retaguarda e só sai por decisão manual.

Colapsados em um campo só, o app não consegue dar a mensagem certa ao vendedor
("cliente com título em atraso" x "cliente bloqueado pela diretoria").

Ambos vão no mesmo `POST /client` e `PATCH /client` já usados hoje:

```
POST /client
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "<customerId>",
  "code": "<código do cliente no ERP>",
  "companyName": "...",
  "cnpj": "...",
  ...
  "creditLimit": 15000.00,
  "discountRate": 5.0,
  "initialDiscountLimit": 100,
  "blocked": false,
  "blockReason": ""
}
```

### Reenvio é seguro (dedup por CNPJ)

Se já existir um cliente com o mesmo `cnpj` naquele `customerId`, o `POST` passa
a **atualizar** esse cadastro e devolver o `id` existente. Antes o caminho era
apagar e recriar, o que destruía `id`, histórico e orçamentos por cascade.

Na prática: o ERP pode reenviar a carga inteira sem guardar o uuid de cada
cliente. Se o ERP perdeu o vínculo, reenviar restabelece.

### Desativar cliente

Já existia e não mudou:
```
PATCH /client/status
{ "id": "<uuid do cliente>", "isActivated": false }
```
Cliente desativado é recusado em `POST /sale` e `POST /budget` com `409`.

## Parte 2 — Cadastro de produtos de venda

### As duas grafias do array de preços

`POST /product` e `PATCH /product` divergiam no nome do array — `ProductPrice`
no POST, `productPrice` no PATCH — o que fazia o ERP falhar ao reaproveitar o
mesmo payload nas duas rotas. **Agora as duas rotas aceitam as duas grafias.**
Pelo menos uma precisa estar presente.

Não é preciso mexer no que já funciona; a mudança existe para que o ERP possa
usar um payload só.

### `groupId` obrigatório, com erro legível

`groupId` continua obrigatório, mas o erro deixou de ser um `500` genérico de
violação de chave estrangeira. Agora vem com instrução:

| Situação | Status | Mensagem |
| --- | --- | --- |
| `groupId` vazio | `400` | `Produto <code>: groupId não informado. Busque o id do grupo em GET /group?customerId=... e envie-o no cadastro do produto.` |
| `groupId` não existe | `404` | `Produto <code>: grupo <id> não existe. Cadastre o grupo (POST /group) antes de sincronizar o produto.` |
| Grupo é de outro customer | `400` | `Produto <code>: o grupo <id> pertence a outro customer.` |

Ou seja: sincronize os grupos (`POST /group`) **antes** dos produtos, e resolva
`groupId` a partir de `GET /group?customerId=...`.

### Situação do produto (`isActive`)

Mesma regra da matéria-prima. Produto que sai de linha é **desativado, não
apagado** — `SaleItems` e `BudgetItems` referenciam `productId` sem FK e guardam
os campos desnormalizados, então o histórico continua legível, mas apagar o
cadastro tiraria a rastreabilidade e a próxima carga recriaria o item.

`isActive` fica **fora** do corpo de `POST /product` e `PATCH /product` de
propósito: se estivesse lá, a carga diária reativaria sozinha um produto que a
retaguarda desativou. A rota dedicada é o único caminho:

```
PATCH /product/status
Authorization: Bearer <token>
Content-Type: application/json

{ "id": "<uuid do produto>", "customerId": "<customerId>", "isActive": false }
```

**Não filtre produto inativo no SELECT da carga.** Se você simplesmente parar de
enviar o item, ele fica ativo na API para sempre. Envie tudo e mande o
`PATCH /product/status` para os que mudaram de situação.

**Efeito no app depois de desativar:**

- o produto some de `GET /product` e `GET /product/group`;
- `POST /sale` e `POST /budget` recusam o lançamento com `409`, nomeando os
  produtos: `"Os produtos abaixo foram inativados pela retaguarda e não podem
  mais ser vendidos: <code> - <descrição>. Remova do pedido e envie
  novamente."` — isso pega o caso do vendedor que montou o carrinho ontem, com
  a lista de ontem, e só enviou hoje;
- `GET /product/tableCode` **não** filtra inativo, de propósito: é releitura do
  preço de um item já escolhido, não oferta de item novo.

Para conferência da retaguarda, as listagens aceitam `includeInactive=true`.

### Consultas de tabela de preço (novas)

```
GET /product/priceTables?customerId=<uuid>&regionId=<id>&includeInactive=
```
Devolve as tabelas de preço disponíveis para a região, com a contagem de
produtos em cada uma:
```json
[ { "code": "001", "tableName": "Tabela Padrão", "productCount": 328 } ]
```

```
GET /product/priceTable?customerId=<uuid>&tableCode=<code>&regionId=<id>
    &groupId=<uuid>&search=<texto>&page=1&perPage=100&includeInactive=
```
Lista os produtos de uma tabela, com filtro por grupo, busca textual e
paginação (`perPage` no máximo `500`). Resposta:
```json
{ "products": [ ... ], "total": 328 }
```

Ambas devolvem só produtos ativos por padrão.

## Parte 3 — Cadastro de vendedores

### As rotas de `/user` agora exigem token

`POST /user`, `PATCH /user`, `GET /user`, `GET /user/rule`, `GET /user/email`,
`DELETE /user`, `DELETE /user/rule`, `PATCH /user/updaterUserAdmin` e
`POST /user/deduplicate` passaram a exigir `Authorization: Bearer <token>`.
Antes eram abertas. **Esta é a mudança com maior chance de quebrar uma rotina
existente.**

Corpo de `POST /user` (inalterado no restante):
```json
{
  "id": "uuid ou null",
  "customerId": "uuid",
  "isAdmin": false,
  "name": "...",
  "email": "...",
  "cellphone": "",
  "password": "",
  "regionId": "",
  "routeId": "",
  "UserRules": []
}
```

### Desativar vendedor em vez de apagar

```
PATCH /user/status
Authorization: Bearer <token>
Content-Type: application/json

{ "id": "<uuid do vendedor>", "isActivated": false }
```

`isActivated` fica fora do corpo de `POST /user` e `PATCH /user` pelo mesmo
motivo dos outros cadastros: para que a carga do ERP não ressuscite um vendedor
desligado.

**Efeito da desativação, em ordem:**

1. o login (`POST /users/sessions`) passa a devolver `403`;
2. a renovação (`POST /users/sessions/refreshToken`) devolve `401` e os refresh
   tokens do vendedor são descartados — sem isso o app entraria em laço
   "401 → renova → 401" sem nunca cair na tela de login;
3. o token que ele já tinha no aparelho para de valer em **até 30 segundos**
   (a API valida o status a cada requisição, com cache curto), e não no
   vencimento do token, que é de 1 dia;
4. `POST /sale` e `POST /budget` em nome dele são recusados com `403`.

Cadastro e histórico ficam intactos. Reativar é a mesma chamada com
`"isActivated": true`.

**Por que não apagar:** `budget.sellerId` voltou a ser `RESTRICT` no banco.
Apagar um vendedor que tem orçamento agora **falha** — antes o `CASCADE` levava
junto todos os orçamentos dele, com itens e formas de pagamento.

## Parte 4 — Envio de pedido e orçamento: idempotência

`POST /sale` e `POST /budget` aceitam um campo `id` **opcional** (uuid). Quando
enviado, ele vira chave de idempotência: repetir o POST com o mesmo `id`
devolve o registro já criado, em vez de duplicar.

Serve para o caso clássico de queda de conexão — o pedido chegou, a resposta se
perdeu, o cliente reenvia. Sem o `id`, esse reenvio cria um pedido duplicado.

```
POST /sale
{ "id": "<uuid gerado por quem envia>", "customerId": "...", "sellerId": "...", ... }
```

A resposta traz o header:
```
X-Idempotent-Replay: true   (o registro já existia, nada foi criado)
X-Idempotent-Replay: false  (foi criado agora)
```

No caso do orçamento, uma repetição **não regera o PDF** — a URL do orçamento
que já foi compartilhado com o cliente continua valendo.

O campo é opcional para não quebrar clientes antigos, mas quem envia deve
gerar e **persistir** o uuid antes do primeiro POST, reutilizando-o em toda
retentativa daquele mesmo pedido.

## Códigos de erro a tratar

| Status | Quando | O que fazer |
| --- | --- | --- |
| `400` | `groupId` vazio, grupo de outro customer, payload inválido. | Corrigir o dado; a mensagem diz qual produto e o que falta. |
| `401` | Sem token, token inválido/expirado, **ou vendedor desativado**. | Renovar o token. Se a renovação também falhar, o usuário foi desativado — não insista. |
| `403` | Login de usuário desativado; lançamento em nome de vendedor desativado. | Não é erro transitório. Requer ação da retaguarda. |
| `404` | Grupo inexistente; matéria-prima não localizada. | Cadastrar o que falta antes de reenviar. |
| `409` | Cliente desativado, produto inativado, matéria-prima inativada. | Não retentar: a mensagem nomeia o cadastro. Reativar ou remover do lançamento. |

## Referência rápida de endpoints

Base URL: `https://automax.htcode.net`. Todas exigem `Authorization: Bearer <token>`.

| Método | Rota | Uso pelo ERP |
| --- | --- | --- |
| POST | `/users/sessions` | Login (obter token). |
| POST | `/users/sessions/refreshToken` | Renovar token. |
| POST | `/client` | Enviar/atualizar cliente (dedup por CNPJ). |
| PATCH | `/client` | Atualizar cliente por `id`. |
| PATCH | `/client/status` | Ativar/desativar cliente. |
| GET | `/client?customerId=` | Listar clientes. |
| POST | `/group` | Cadastrar grupo de produto (antes dos produtos). |
| GET | `/group?customerId=` | Resolver `groupId`. |
| POST | `/product` | Enviar/atualizar produto de venda. |
| PATCH | `/product` | Atualizar produto por `id`. |
| PATCH | `/product/status` | Ativar/desativar produto. |
| GET | `/product?customerId=&includeInactive=` | Listar produtos. |
| GET | `/product/group?customerId=&groupId=&includeInactive=` | Listar produtos de um grupo. |
| GET | `/product/priceTables?customerId=&regionId=` | Tabelas de preço da região. |
| GET | `/product/priceTable?customerId=&tableCode=&regionId=` | Produtos de uma tabela (com busca e paginação). |
| GET | `/product/tableCode?...` | Preço de um produto numa tabela. |
| POST | `/user` | Cadastrar vendedor (**agora exige token**). |
| PATCH | `/user` | Atualizar vendedor (**agora exige token**). |
| PATCH | `/user/status` | Ativar/desativar vendedor. |
| GET | `/user?customerId=` | Listar vendedores (**agora exige token**). |
| POST | `/sale` | Enviar pedido (aceita `id` para idempotência). |
| POST | `/budget` | Enviar orçamento (aceita `id` para idempotência). |

## Pontos em aberto para confirmar antes de codificar

1. **Nomes reais das colunas** de `CLIENTES` para `creditLimit`,
   `discountRate`, `initialDiscountLimit`, `blocked` e `blockReason` — os da
   tabela acima são a suposição a partir do dicionário do ERP.
2. **Quem decide o `blocked`** — se sai de um campo do cadastro ou de uma regra
   da retaguarda, e com que frequência precisa ser resincronizado.
3. **Qual coluna marca produto inativo** em `ESTOQUE`/cadastro de produtos de
   venda, para alimentar o `PATCH /product/status`.
4. **Se o ERP guarda o uuid** de cliente/produto/vendedor. Se não guardar, a
   rotina de status precisa listar (`includeInactive=true`) e casar pelo `code`
   antes de chamar `/status`.
5. **Qual usuário admin** o ERP usa para login — e confirmar que ele não será
   desativado por engano, o que derrubaria a integração inteira.
