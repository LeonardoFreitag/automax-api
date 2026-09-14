# Prompt — PDV Delphi: ajustes de contrato com a API para ESTORNO e crédito PARCELADO

> Colar no Cowork da máquina Windows onde vive o PDV (Delphi / Firebird 5).
> A API (`modules/stonePayment`) já está implementada e testada — 39/39 do
> roteiro de aceite, incluindo 12 casos de estorno/parcelado. Este documento é a
> **conferência do lado Delphi contra o que a API realmente faz**: são detalhes
> em que o comportamento real difere ou refina o contrato descrito no prompt
> original (`Prompt — API AutoMax + App SmartPOS: ESTORNO e crédito PARCELADO`).
> Nada aqui é funcionalidade nova no PDV; é conferir código já escrito.

## 1. Código de resposta do `POST /stonePayment` é **200**, não 201

Vale para pagamento e para estorno. É o padrão de toda a API AutoMax desde o
início e foi mantido para não quebrar o que já está em produção.

**Conferir:** onde o PDV cria o pedido (pagamento ou cancellation), o teste de
sucesso deve ser `StatusCode = 200` (ou, mais robusto, `StatusCode div 100 = 2`).
Se estiver comparando com `201`, o PDV vai tratar sucesso como erro.

## 2. `targetPaymentId` é o **`id` (uuid) que a API devolveu no POST do pagamento**

Não é o `externalRef`, não é o `atk`, não é o número do lançamento. É o campo
`id` do JSON de resposta do `POST /stonePayment` original — o mesmo que o PDV
usa no polling `GET /stonePayment/:id`.

**Conferir:** o PDV precisa ter **persistido esse uuid junto do recebimento**
(em `PDV_RECEB_PAGTOS` ou equivalente) no momento em que o pagamento aprovou.
Sem isso, não há como montar o estorno depois. Se o campo ainda não existe na
tabela, é a primeira coisa a criar.

## 3. Corpo mínimo do estorno (o que a API espera)

```json
{
  "terminalId": "<mesmo terminalId do caixa>",
  "externalRef": "<referência do estorno no PDV, ex.: VENDA-1234-EST>",
  "amountCents": <valor cheio do lançamento, em centavos>,
  "operation": "cancellation",
  "targetPaymentId": "<uuid do pagamento aprovado>"
}
```

- `transactionType`, `installmentType` e `installmentCount` **não precisam ser
  enviados** no estorno. Se o PDV mandar por hábito, a API **ignora** (não
  recusa) e grava no registro do estorno os valores copiados do pagamento
  original. Ou seja: não quebra, mas pode limpar.
- `customerId` no corpo continua opcional; se for enviado, tem que ser o do
  usuário do token, senão 403.
- `expiresInMinutes` vale também para o estorno (default 7, máx. 182). Como o
  operador está na frente da maquineta, 7 é suficiente; se o modal de estorno
  tiver um timeout próprio, alinhar os dois.

Resposta (200): o registro completo do estorno, já com
`"status": "pending"`, `"operation": "cancellation"`, `"targetPaymentId"` e
`"targetAtk"` (o `atk` do pagamento original, resolvido pela API). O `id` desse
registro é o que o PDV usa no polling do estorno.

## 4. Erros de regra de negócio vêm como **422** com `message` em português

Formato do corpo (mesmo `AppError` do resto da API):

```json
{ "status": "erro", "message": "Só é possível estornar um pagamento aprovado (status atual: pending)." }
```

Casos que a API devolve 422 — **os dois primeiros são do prompt, os demais são
guardas adicionais que a API implementa e o PDV deve estar preparado para
receber**:

| Situação | `message` (pode exibir direto no modal) |
|---|---|
| `targetPaymentId` inexistente **ou de outro customer** | `Pagamento a estornar não encontrado.` |
| alvo não está `approved` | `Só é possível estornar um pagamento aprovado (status atual: <status>).` |
| alvo aprovado **sem `atk`** gravado | `Pagamento aprovado sem atk gravado — não é possível estornar pela maquininha.` |
| alvo **já estornado** (tem `refundedByOrderId`) | `Este pagamento já foi estornado.` |
| já existe outro estorno `pending`/`sent_to_terminal`/`approved` para o mesmo alvo | `Já existe um estorno em andamento para este pagamento (<uuid do estorno>).` |
| `amountCents` maior que o do pagamento | `amountCents (<n>) maior que o valor do pagamento (<m>).` |
| alvo é um estorno, não um pagamento | `O pedido informado em targetPaymentId não é um pagamento.` |

**Conferir no PDV:**

- tratar **422 como "não dá para estornar, mostrar `message` e voltar"** — não é
  falha de comunicação, não é para retentar;
- o caso "já existe um estorno em andamento" traz o uuid do estorno existente
  na mensagem; se quiser, o PDV pode extrair esse uuid e retomar o polling
  dele em vez de bloquear (útil quando o operador fechou o modal no meio);
- o caso "sem atk" acontece se o app da maquininha aprovou o pagamento sem
  gravar `atk` (ex.: retorno truncado). Se o PDV quiser evitar a tentativa,
  pode fazer `GET /stonePayment/<uuid do pagamento>` antes de oferecer o DEL e
  só habilitar o estorno quando `atk` vier preenchido.

Diferença entre códigos, para o tratamento de erro do PDV:

- **400** — corpo malformado (celebrate). Ex.: `operation: "cancellation"` sem
  `targetPaymentId`; `targetPaymentId` num pagamento normal; `installmentCount`
  sem `installmentType` MERCHANT/ISSUER. Corpo vem no formato do celebrate
  (`{"statusCode":400,"error":"Bad Request","message":"celebrate request validation failed","validation":{...}}`).
  É bug do PDV, não situação de loja.
- **403** — customer do corpo diferente do token, ou pedido de outro customer.
- **422** — regra de negócio do estorno (tabela acima).
- **409** — só no `POST /stonePayment/:id/cancel` quando o pedido já está em
  status final (corpo = o registro atual).

## 5. Acompanhamento do estorno é idêntico ao do pagamento

`GET /stonePayment/<id do estorno>` a cada ~2,5 s até status final:
`approved` (estornado na Stone), `declined` (Stone recusou), `error` (falha no
app), `expired` (ninguém pegou a tempo), `canceled` (o PDV desistiu enquanto
ainda `pending`). O `POST /stonePayment/<id>/cancel` também funciona para um
estorno `pending`, com a mesma semântica do pagamento.

No `approved`, o registro do estorno traz `atk` (o mesmo `targetAtk`, ecoado
pelo retorno da Stone) e `rawResponse` com a URI crua
(`automaxpos://cancel?success=true&atk=...&canceledamount=...&responsecode=0000`).

Efeito colateral, só para conhecimento: quando o estorno aprova, a API grava
`refundedByOrderId = <id do estorno>` no **pagamento original**. O PDV não
precisa ler isso — marca o pagamento como estornado na venda pelo `approved` do
próprio estorno, como o prompt já descreve — mas é o que impede um segundo
estorno do mesmo pagamento (422 "já foi estornado").

## 6. Crédito parcelado — conferência

O contrato original já cobria; só confirmar que o PDV manda exatamente:

```json
{ "transactionType": "CREDIT", "installmentType": "MERCHANT", "installmentCount": 2 }
```

- `installmentCount` de 2 a 12, e **só** acompanhado de `installmentType`
  `MERCHANT` ou `ISSUER`. `installmentCount` sozinho, ou com `NONE`, é 400.
- À vista: mandar sem os dois campos (ou `installmentType: "NONE"` sem
  `installmentCount`). O app da maquininha já omite `installment_type` do
  Deeplink para débito/Pix/à vista — descoberta em hardware real: a Stone
  recusa a transação se `installment_type=NONE` for enviado nesses casos.
- A API devolve os dois campos no registro e na fila do app; nada a fazer no
  PDV além de enviá-los.

## 7. Critério de pronto (bancada com o terminal físico de homologação)

Com a API no ar e o app AutoMax rodando na maquininha de homologação da Stone
(mesmo `terminalId` configurado no caixa e no aparelho):

1. Lançar um recebimento com cartão → aprovar na maquininha → conferir que o
   `id` (uuid) do pedido ficou gravado no recebimento e que o registro na API
   tem `atk` preenchido (`GET /stonePayment/<uuid>`). Sem `atk` não há estorno.
2. Digitar o nº do pagamento + DEL → PDV cria o cancellation (200, `pending`)
   → modal de estorno → a maquininha abre a tela de cancelamento da Stone com
   o valor → confirmar → PDV vê `approved` e marca o pagamento como estornado.
   Cobre os testes 005/007/009 do roteiro de homologação da Stone.
3. Repetir o DEL no mesmo pagamento → API 422 "Este pagamento já foi
   estornado." → PDV mostra a mensagem e não trava.
4. DEL num pagamento cujo pedido não está `approved` → 422 com o status atual
   na mensagem.
5. Recusar o cancelamento na maquininha → estorno vira `declined` → PDV não
   marca nada e o DEL pode ser tentado de novo (a API libera nova tentativa
   quando o estorno anterior foi negado/expirou/deu erro).
6. Crédito 2x sem juros (teste 006 da Stone) → POST com `MERCHANT`/`2` → 200
   `pending` → maquininha apresenta a transação parcelada → aprovada →
   recebimento gravado com 2 parcelas.

Se algum passo devolver **400**, o corpo do PDV está fora do contrato — o campo
`validation.body.keys` do JSON diz qual chave.
