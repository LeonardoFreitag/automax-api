# Módulo `stonePayment` — ponte PDV ↔ SmartPOS Stone

O PDV Delphi (Windows) e a maquininha Stone SmartPOS (Android) não se falam
diretamente. Esta API é a fila entre os dois:

```
PDV Delphi  --POST /stonePayment-->  API  <--GET /stonePayment/pending--  App Android (SmartPOS)
     |                                |                                        |
     +--GET /stonePayment/:id (2,5s)--+--------PATCH /stonePayment/:id----------+
```

Nenhum job de expiração roda em background: quem lê um pedido `pending` vencido
é quem o marca como `expired` (expiração preguiçosa).

Todas as rotas exigem `Authorization: Bearer <token>` (mesmo JWT + refresh das
demais rotas; vendedor desativado é recusado pelo `ensureAuthenticated`).

## Isolamento por customer

A API atende vários customers, então **o customer de cada requisição vem do
token**, não do corpo nem da query. O `ensureAuthenticated` resolve o
`customerId` do usuário do JWT (com o mesmo cache de 30s do status de ativação)
e o disponibiliza em `request.user.customerId`.

Na prática, para o FrenteDeCaixa e para o app da SmartPOS:

- basta autenticar em `POST /users/sessions` com um usuário **daquele**
  customer — o `customerId` vem na resposta do login, mas não é obrigatório
  reenviá-lo;
- `POST /stonePayment` ainda aceita `customerId` no corpo (compatibilidade),
  porém apenas como conferência: se divergir do customer do token, responde
  **403** (sinal de aparelho configurado com o cliente errado);
- `GET /stonePayment/pending` filtra por **`customerId` + `terminalId`**. Isso
  importa porque `terminalId` é string configurada à mão no aparelho: sem o
  customer no filtro, dois clientes com um terminal chamado `CAIXA01` veriam a
  fila um do outro;
- `GET /stonePayment/:id`, `POST /:id/cancel` e `PATCH /:id` recusam com **403**
  um pedido que pertença a outro customer.

Ou seja: cada instalação só enxerga e só altera os próprios pedidos, e nada
disso depende de o PDV ou o Android mandarem o campo certo.

## Estados

| status             | significado                                        |
| ------------------ | -------------------------------------------------- |
| `pending`          | criado pelo PDV, ainda na fila do terminal          |
| `sent_to_terminal` | app disparou o Deeplink da Stone                    |
| `approved`         | transação aprovada (final)                          |
| `declined`         | negada pela Stone / emissor (final)                 |
| `canceled`         | PDV cancelou antes de o app pegar o pedido (final)  |
| `expired`          | venceu `expiresAt` ainda em `pending` (final)       |
| `error`            | falha no app / Deeplink (final)                     |

Status final nunca muda: um `PATCH` em cima dele responde 200 com o registro
como está (idempotência para reenvio após queda de rede).

Todo pedido tem também `operation`: `payment` (cobrança, default) ou
`cancellation` (estorno de um pagamento aprovado). As duas operações usam a
mesma fila e o mesmo fluxo de status; o que muda é o Deeplink que o app
dispara. Ver a seção "Estorno" abaixo.

## Endpoints

### `POST /stonePayment` — PDV cria a cobrança

```json
{
  "terminalId": "SMARTPOS-01",
  "externalRef": "VENDA-1234",
  "amountCents": 15990,
  "transactionType": "CREDIT",
  "installmentType": "MERCHANT",
  "installmentCount": 3,
  "expiresInMinutes": 7
}
```

- `customerId`: opcional; se enviado, precisa bater com o customer do token
- `operation`: `payment` (default) | `cancellation` — ver seção "Estorno"
- `mode`: `attended` (default) | `detached` — ver seção "Cards de cobrança"
- `transactionType`: `DEBIT` | `CREDIT` | `VOUCHER` | `INSTANT_PAYMENT`
  (obrigatório no pagamento; ignorado no estorno)
- `installmentType`: `MERCHANT` | `ISSUER` | `NONE` (opcional)
- `installmentCount`: 2..12, só com `installmentType` `MERCHANT`/`ISSUER`
- `expiresInMinutes`: default 7, máximo 182

Responde o registro completo com `status: "pending"` e `expiresAt`.

### `GET /stonePayment/:id` — PDV faz polling (~2,5s)

Devolve o registro. Se estiver `pending` com `expiresAt` no passado, grava
`expired` antes de responder.

### `POST /stonePayment/:id/cancel` — PDV desiste

- `pending` → vira `canceled` e some da fila do app.
- `sent_to_terminal` → só marca `cancelRequested = true`; o cancelamento real
  acontece na maquineta, o campo é o aviso para o app.
- status final → **409** com o registro atual no corpo.

### `GET /stonePayment/pending?terminalId=` — app Android faz polling (~2s)

Devolve, em ordem de `createdAt` asc, sempre dentro do customer do token:
- os `pending` daquele terminal ainda dentro da validade;
- os `sent_to_terminal` com `cancelRequested = true`.

Pendentes vencidos daquele terminal são marcados `expired` na mesma passada.

### `PATCH /stonePayment/:id` — app Android grava o andamento e o resultado

```json
{
  "status": "approved",
  "authorizationCode": "123456",
  "brand": "VISA",
  "atk": "...",
  "itk": "...",
  "panMasked": "**** **** **** 1234",
  "entryMode": "CHIP",
  "cardholderName": "FULANO DE TAL",
  "installmentCount": 3,
  "rawResponse": {}
}
```

Só `status` é obrigatório; o app costuma mandar `sent_to_terminal` primeiro
(sem campos de resultado) e depois o desfecho. Campos ausentes não são
apagados. **`panMasked` nunca recebe o PAN completo** — no máximo os 4 últimos
dígitos.

**Campos não previstos são aceitos, não recusados.** O conjunto que a Stone
devolve varia por modalidade (o retorno de Pix não está documentado), e um 400
aqui significaria perder o resultado de um pagamento já efetuado — o pedido
ficaria preso em `sent_to_terminal` com o cliente tendo pago. Então qualquer
chave extra é preservada dentro de `rawResponse`:

- sem campo extra, `rawResponse` é gravado exatamente como veio (string crua da
  URI ou objeto);
- com campo extra, vira objeto: o original em `rawResponse` e os campos novos em
  `extraFields`, por exemplo
  `{"rawResponse": "payment-app://response?...", "extraFields": {"endToEndId": "E999"}}`.

Isso não afrouxou as validações dos campos conhecidos: `status` fora do enum e
`panMasked` acima de 30 caracteres continuam 400.

## Pix (INSTANT_PAYMENT)

Pix usa a mesma fila, sem nada de especial na API: `transactionType:
"INSTANT_PAYMENT"`, sem `installmentType`/`installmentCount` (Pix não parcela —
`installmentCount` junto é recusado com 400). O app exibe o QR dinâmico na tela
da maquininha.

Duas recomendações práticas:

- **`expiresInMinutes` maior para Pix.** O default de 7 minutos é curto: o
  cliente ainda vai abrir o app do banco e ler o QR. Para tPag 17, 10 a 15
  minutos é mais realista.
- **`rawResponse` completo é o que interessa.** Não se sabe ainda quais campos a
  Stone devolve num Pix (`authorization_code` vazio? `end_to_end_id`? `brand`
  vazio?), e é esse retorno bruto que fecha o mapeamento fiscal do tPag 17 na
  NFC-e. O app deve mandar a URI de retorno crua, inteira.

## Estorno (`operation: "cancellation"`)

O PDV estorna um pagamento aprovado criando um pedido na mesma fila:

```json
{
  "terminalId": "SMARTPOS-01",
  "externalRef": "VENDA-1234-EST",
  "amountCents": 15990,
  "operation": "cancellation",
  "targetPaymentId": "<uuid do pagamento aprovado>"
}
```

A API resolve `targetAtk` a partir do `atk` gravado no pagamento alvo e o
registro nasce `pending`, com `transactionType`/`installment*` copiados do alvo
(só informativo — o que o PDV mandar nesses campos é ignorado). O app vê o item
no `GET /pending` com `operation: "cancellation"` e `targetAtk`, e dispara
`cancel-app://cancel?...&atk=<targetAtk>&amount=<amountCents>` em vez do
Deeplink de pagamento. Daí em diante é o mesmo fluxo: `sent_to_terminal` →
`approved` | `declined` | `error`, expiração preguiçosa, `cancel` de `pending`.

Regras de negócio no `POST`, todas com **422** (corpo bem formado, alvo que não
serve — o PDV distingue do 400 de validação):

- `targetPaymentId` inexistente ou de outro customer → "não encontrado";
- alvo que não é `operation: "payment"`;
- alvo que não está `approved` (a mensagem diz o status atual);
- alvo aprovado **sem `atk`** gravado — não há como estornar pela maquininha;
- alvo que já tem `refundedByOrderId` (já estornado);
- já existe outro estorno `pending`/`sent_to_terminal`/`approved` para o mesmo
  alvo (um `declined`/`expired`/`error` não bloqueia nova tentativa);
- `amountCents` maior que o do pagamento (v1 é estorno total; o PDV manda o
  valor cheio).

`cancellation` sem `targetPaymentId` é 400 (celebrate). `targetPaymentId` em
`operation: "payment"` também é 400.

Quando o estorno vira `approved`, a API grava `refundedByOrderId = <id do
estorno>` no pagamento original — auditoria, e é o que bloqueia um segundo
estorno. O PDV não depende desse campo.

## Crédito parcelado

`transactionType: "CREDIT"` + `installmentType: "MERCHANT"` (ou `ISSUER`) +
`installmentCount` de 2 a 12. Já estava no contrato original; o `GET /pending`
devolve os dois campos para o app montar `installment_type` e
`installment_count` na URI do Deeplink. `installmentCount` sem
`installmentType` MERCHANT/ISSUER é 400.

## Cards de cobrança — delivery (`mode: "detached"`)

Etapa 2. Um card é um pagamento que **não dispara sozinho**: em vez de entrar
na fila do terminal, aparece numa lista "Cobranças" em **todas** as maquininhas
do customer e só cobra no toque do entregador. Aprovado, o PDV o consome uma
única vez no fechamento da venda.

Três decisões de produto moldam o contrato: o tipo/parcelas do card são
**pré-seleção** (o entregador pode trocar na hora e a API grava o que foi de
fato cobrado); cards são **por customer**, não por terminal (`terminalId` do
POST é só auditoria de origem); e um card aprovado fecha **uma** venda só.

### `POST /stonePayment` com `mode: "detached"`

```json
{
  "terminalId": "CAIXA-01",
  "externalRef": "VENDA-1234",
  "amountCents": 5990,
  "transactionType": "CREDIT",
  "installmentType": "MERCHANT",
  "installmentCount": 3,
  "mode": "detached",
  "description": "Pedido 1234 — Rua das Flores, 10",
  "expiresInMinutes": 720
}
```

- `description` obrigatória (até 120 caracteres): é o que o entregador vê.
  Ausente → 422; acima de 120 → 400.
- `expiresInMinutes`: 1..1440 no card (attended continua 1..182). Fora da
  faixa do mode → **422** (não 400), porque o teto depende do mode.
- `mode: "detached"` só com `operation: "payment"` — cancellation detached é
  422. Estorno de um card pago usa o fluxo de cancellation normal.
- `transactionType`/`installment*` validam como no attended, mas são
  pré-seleção.

### `GET /stonePayment/cards` — lista de cobranças (app)

Do customer do token, **sem `terminalId`**. Devolve os `detached` com status
`pending` e `sent_to_terminal` ainda válidos, mais os `approved` com
`consumed = false` (o "PAGO" que o entregador mostra ao cliente). Ordem:
`createdAt` desc. Expiração preguiçosa antes de montar a lista; expirados,
cancelados e consumidos ficam de fora. Cada item é o registro completo (com
`id`, `description`, `amountCents`, `transactionType`, `installmentType`,
`installmentCount`, `status`, `consumed`, `createdAt`, `expiresAt`, ...).

### A fila attended nunca mostra cards

`GET /stonePayment/pending?terminalId=` filtra `mode = attended`. O app
dispara sozinho o que vier dessa rota — um card ali seria cobrado no balcão
sem ninguém pedir. Há teste explícito para isso (12.1).

### Claim atômico e desfecho com o que foi cobrado (`PATCH /:id`)

Duas maquininhas podem tocar o mesmo card ao mesmo tempo. Num `detached`, o
`PATCH {"status": "sent_to_terminal"}` é compare-and-set a partir de
`pending`: quem chega primeiro recebe 200; qualquer outro recebe **409 com o
pedido atual no corpo** (o app mostra "sendo cobrado em outra maquineta"). Em
`attended` nada muda (repetir `sent_to_terminal` continua 200).

No desfecho de um card, o app envia também `transactionType`,
`installmentType` e `installmentCount` **usados** — a API grava por cima da
pré-seleção. Demais campos e garantias iguais ao attended (`rawResponse`
sempre, idempotência em status final, campos extras preservados).

### `POST /stonePayment/:id/consume` — fechamento da venda (PDV)

Corpo `{"consumedBySale": "<código da venda>"}`. Guardas, todas com **422** e
mensagem em português: cobrança inexistente ou de outro customer ("não
encontrada"); `operation` que não é `payment`; `status` que não é `approved`
(a mensagem traz o atual); já consumida por **outra** venda ("Cobrança já
utilizada na venda X."). Grava `consumed = true`, `consumedBySale`,
`consumedAt` e devolve o registro. Repetir com a **mesma** venda é 200 (o PDV
pode reenviar após queda de rede). O consumo é compare-and-set no banco: dois
caixas retomando a mesma venda não usam o mesmo pagamento duas vezes.

### Cancelar um card

`POST /stonePayment/:id/cancel` funciona igual: `pending` → `canceled` na
hora (o PDV usa quando o operador decide cobrar por outra forma);
`sent_to_terminal` → só `cancelRequested`.

## Roteiro de teste automatizado

`scripts/test-stone-payment.py` executa os 7 critérios de pronto, mais o
isolamento entre customers e as validações de entrada — sem Android e sem
Delphi, só com a API no ar:

```bash
API_URL=http://localhost:3333 \
EMAIL_A=usuario@empresa.com PASS_A=senha \
EMAIL_B=usuario@outrocliente.com PASS_B=senha \
python3 scripts/test-stone-payment.py
```

`EMAIL_B`/`PASS_B` são opcionais e precisam ser de **outro** customer; sem eles
os testes de isolamento são pulados. O passo 7 leva ~65s de propósito (é o
pedido vencendo). O script só cria pedidos de pagamento, não mexe em nenhum
outro cadastro.

Última execução: **39/39 verificações passaram** (10/09/2026, contra Postgres
limpo com todas as migrations aplicadas). Inclui os blocos de Pix
(`INSTANT_PAYMENT`), tolerância a campos não previstos no PATCH, estorno
(`operation: "cancellation"`, 11 casos) e crédito parcelado.

Para o lado Delphi há um prompt de conferência do contrato em
`docs/PROMPT_PDV_DELPHI_Estorno_Parcelado.md`.

## Roteiro manual (curl passo a passo)

```bash
API=https://automax.htcode.net
TOKEN=<token do login>   # o customer sai do próprio token

# 1. PDV cria
curl -s -X POST $API/stonePayment -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"terminalId":"T1","externalRef":"V1","amountCents":1000,"transactionType":"CREDIT"}'
# -> id, status "pending"

# 2. terminal vê a fila
curl -s "$API/stonePayment/pending?terminalId=T1" -H "Authorization: Bearer $TOKEN"

# 3. app dispara o Deeplink e depois grava o resultado
curl -s -X PATCH $API/stonePayment/<id> -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"status":"sent_to_terminal"}'
curl -s -X PATCH $API/stonePayment/<id> -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved","authorizationCode":"123456","brand":"VISA"}'

# 4. PDV vê aprovado / 5. repetir o PATCH não muda nada
curl -s $API/stonePayment/<id> -H "Authorization: Bearer $TOKEN"

# 6. cancelar ainda pending some da fila
curl -s -X POST $API/stonePayment/<id2>/cancel -H "Authorization: Bearer $TOKEN"

# 7. expiração: criar com expiresInMinutes=1, esperar, consultar -> "expired"
```

## Migrations

1. `20260829120000_add_stone_payment_order` — cria a tabela.
2. `20260830120000_stone_payment_customer_scoped_index` — troca o índice da fila
   por `(customerId, terminalId, status, expiresAt)`. Usa `IF EXISTS` /
   `IF NOT EXISTS`, então roda tanto se a primeira já tiver sido aplicada quanto
   se as duas forem aplicadas juntas.
3. `20260910120000_stone_payment_cancellation` — colunas `operation`
   (default `payment`), `targetPaymentId`, `targetAtk`, `refundedByOrderId` e
   índice por `targetPaymentId`. Aditiva.
4. `20260911120000_stone_payment_cards` — coluna `consumedAt` e índice
   `(customerId, mode, status, consumed)` da lista de cards. Aditiva
   (`mode`, `description`, `consumed`, `consumedBySale` já existiam desde a
   criação da tabela).
