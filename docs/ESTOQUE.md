# Controle de Estoque (matéria-prima) — API

Documentação da implementação do controle de estoque de matéria-prima para o
chão de fábrica: cadastro de matéria-prima sincronizado do ERP AutoMax,
inventário e baixa de estoque. Implementado em `2026-07-17`.

## Visão geral

Três módulos novos, seguindo exatamente a arquitetura já usada no restante da
API (`dtos` implícitos via `Prisma.*UncheckedCreateInput`, `repositories`
(interface + implementação Prisma), `services` (um caso de uso por arquivo),
`infra/http/controllers` e `infra/http/routes`, registro central em
`shared/container/index.ts` e `shared/infra/http/routes/index.ts`):

- **`stockProduct`** — catálogo de matéria-prima (código, referência,
  descrição, unidade), enviado pelo ERP AutoMax.
- **`inventory`** — inventário feito no almoxarifado (cabeçalho + itens
  contados).
- **`stockWithdrawal`** — baixa de estoque (retirada de matéria-prima para
  produção): cabeçalho + itens retirados.

Todas as rotas exigem autenticação (`ensureAuthenticated`, JWT), igual ao
resto da API. Conforme combinado, o ERP se autentica logando com o usuário
`admin` já existente (mesmo padrão hoje usado para sincronizar o catálogo de
produtos de venda) — não foi criado nenhum mecanismo de API key.

**Campo `reference`**: é o campo em que o ERP grava o código de barras do
item (ou repete o campo `code` quando o item não tem código de barras). É por
esse campo que o QR code do produto é lido no app — o QR é gerado a partir de
`reference`.

## Models Prisma adicionados (`prisma/schema.prisma`)

```prisma
model StockProduct {
  id          String   @id @default(uuid())
  customerId  String
  code        String
  reference   String
  description String
  unity       String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("stockProduct")
}

model Inventory {
  id         String   @id @default(uuid())
  customerId String
  userId     String
  userName   String
  status     String   @default("em_andamento") // "em_andamento", "finalizado"
  downloaded Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  InventoryItems InventoryItems[]

  @@map("inventory")
}

model InventoryItems {
  id             String   @id @default(uuid())
  stockProductId String
  code           String
  reference      String
  description    String
  unity          String
  quantity       Decimal
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  inventory   Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  inventoryId String

  @@map("inventoryItems")
}

model StockWithdrawal {
  id         String   @id @default(uuid())
  customerId String
  userId     String
  userName   String
  notes      String?
  status     String   @default("em_andamento") // "em_andamento", "finalizado"
  downloaded Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  StockWithdrawalItems StockWithdrawalItems[]

  @@map("stockWithdrawal")
}

model StockWithdrawalItems {
  id             String   @id @default(uuid())
  stockProductId String
  code           String
  reference      String
  description    String
  unity          String
  quantity       Decimal
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  stockWithdrawal   StockWithdrawal @relation(fields: [stockWithdrawalId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  stockWithdrawalId String

  @@map("stockWithdrawalItems")
}
```

Observação de design: `InventoryItems`/`StockWithdrawalItems` **não** têm FK
com `onDelete: Cascade` para `StockProduct` — os campos `code`, `reference`,
`description`, `unity` ficam desnormalizados (mesmo padrão de `SaleItems` e
`BudgetItems`). Isso evita que uma resincronização do catálogo de matéria-prima
(que apaga e recria o `StockProduct` pelo `code`) apague em cascata itens de
inventários/baixas já lançados.

## ⚠️ Passo obrigatório antes de rodar

O sandbox usado para gerar este código não tinha acesso de rede aos binários
do Prisma, então **não foi possível rodar `prisma generate`/`migrate` aqui**.
Antes de subir para produção, rode localmente (com acesso ao banco):

```bash
npx prisma generate
npx prisma migrate dev --name add_stock_control
# ou, se preferir aplicar direto sem gerar migration:
npx prisma db push
```

Todo o código novo foi validado com `tsc --noEmit`; os únicos erros
apontados hoje são exclusivamente "member does not exist" nos tipos do
Prisma Client, porque o client gerado localmente ainda não conhece os novos
models — eles desaparecem assim que `prisma generate` rodar.

## Endpoints

### `stockProduct` — catálogo de matéria-prima (sincronizado pelo ERP)

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/stockProduct` | Cria/sincroniza um item. Se já existir um `StockProduct` com o mesmo `code` para o `customerId`, ele é apagado e recriado (mesmo padrão de "upsert por substituição" já usado no cadastro de produtos de venda). |
| PATCH | `/stockProduct` | Atualiza por `id`; se o `id` não existir ainda, cai para criar. |
| GET | `/stockProduct?customerId=` | Lista todo o catálogo do cliente. |
| GET | `/stockProduct/search?customerId=&search=` | Busca por código, referência ou descrição (`contains`, até 50 resultados) — usada pela tela de busca do app. |
| GET | `/stockProduct/reference?customerId=&reference=` | Busca exata pelo campo `reference` — usada pela leitura de QR code do app. |
| DELETE | `/stockProduct?id=` | Remove um item. |

Body de criação/atualização:
```json
{
  "customerId": "uuid",
  "code": "string",
  "reference": "string",
  "description": "string",
  "unity": "string"
}
```

### `inventory` — inventário de almoxarifado

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/inventory` | Inicia um novo inventário (`status: "em_andamento"`, `downloaded: false`). Body: `customerId`, `userId`, `userName`. |
| POST | `/inventory/item` | Registra a contagem de um produto (chamado a cada leitura/busca no app — não espera o inventário terminar para gravar). Body: `inventoryId`, `stockProductId`, `code`, `reference`, `description`, `unity`, `quantity`. Retorna erro 400 se o inventário já estiver `finalizado`. |
| GET | `/inventory?customerId=&downloaded=` | Lista inventários do cliente. Sem o filtro, lista todos; com `downloaded=false`, é a consulta que o **ERP** usa para saber o que ainda falta processar. |
| GET | `/inventory/item?inventoryId=` | Lista os itens já contados em um inventário. |
| PATCH | `/inventory/status` | Usuário conclui a contagem no app. Body: `id`, `status` (`"em_andamento"` \| `"finalizado"`). |
| PATCH | `/inventory/downloaded?id=&downloaded=` | **Chamado pelo ERP** depois de gravar o inventário no Firebird e atualizar o estoque. |
| DELETE | `/inventory/item?id=` | Remove um item lançado por engano (antes de finalizar). |

### `stockWithdrawal` — baixa de estoque (retirada para produção)

Mesmo desenho de `inventory`, trocando "contagem" por "retirada":

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/stockWithdrawal` | Inicia uma nova baixa. Body: `customerId`, `userId`, `userName`, `notes?`. |
| POST | `/stockWithdrawal/item` | Registra a retirada de um produto. Body: `stockWithdrawalId`, `stockProductId`, `code`, `reference`, `description`, `unity`, `quantity`. |
| GET | `/stockWithdrawal?customerId=&downloaded=` | Lista baixas do cliente (`downloaded=false` é a consulta do ERP). |
| GET | `/stockWithdrawal/item?stockWithdrawalId=` | Lista os itens de uma baixa. |
| PATCH | `/stockWithdrawal/status` | Usuário finaliza a baixa no app. Body: `id`, `status`. |
| PATCH | `/stockWithdrawal/downloaded?id=&downloaded=` | **Chamado pelo ERP** depois de gravar a baixa no Firebird e dar baixa no estoque. |
| DELETE | `/stockWithdrawal/item?id=` | Remove um item lançado por engano. |

## Fluxo ponta a ponta

1. ERP envia o catálogo de matéria-prima via `POST/PATCH /stockProduct` (um
   item por vez, mesmo padrão já usado para o catálogo de venda).
2. Usuário do almoxarifado loga no app, escolhe a rota "Almoxarifado/Estoque"
   e inicia um inventário (`POST /inventory`) ou uma baixa
   (`POST /stockWithdrawal`).
3. Para cada produto contado/retirado, o app identifica o item por busca
   (`GET /stockProduct/search`) ou QR code (`GET /stockProduct/reference`) e
   registra a quantidade (`POST /inventory/item` ou
   `POST /stockWithdrawal/item`) — cada lançamento já vai para o banco na
   hora, então nada se perde se o app fechar no meio da operação.
4. Usuário finaliza (`PATCH .../status` com `status: "finalizado"`).
5. ERP consulta periodicamente `GET /inventory?downloaded=false` e
   `GET /stockWithdrawal?downloaded=false` (com os itens de cada um, via
   `GET /inventory/item` / `GET /stockWithdrawal/item`), grava no Firebird
   (atualizando o estoque a partir do inventário, ou dando baixa a partir da
   retirada) e marca como processado
   (`PATCH .../downloaded?id=...&downloaded=true`).

## Arquivos criados

```
src/modules/stockProduct/
  repositories/IStockProductRepository.ts
  infra/prisma/repositories/StockProductRepository.ts
  services/CreateStockProductService.ts
  services/UpdateStockProductService.ts
  services/CheckExistsStockProductService.ts
  services/ListStockProductService.ts
  services/SearchStockProductService.ts
  services/FindStockProductByReferenceService.ts
  services/DeleteStockProductService.ts
  infra/http/controllers/StockProductControllers.ts
  infra/http/routes/stockProduct.routes.ts

src/modules/inventory/
  repositories/IInventoryRepository.ts
  infra/prisma/repositories/InventoryRepository.ts
  services/CreateInventoryService.ts
  services/CreateInventoryItemService.ts
  services/ListInventoryService.ts
  services/ListInventoryItemsService.ts
  services/UpdateInventoryStatusService.ts
  services/ChangeInventoryDownloadedService.ts
  services/DeleteInventoryItemService.ts
  infra/http/controllers/InventoryControllers.ts
  infra/http/routes/inventory.routes.ts

src/modules/stockWithdrawal/
  repositories/IStockWithdrawalRepository.ts
  infra/prisma/repositories/StockWithdrawalRepository.ts
  services/CreateStockWithdrawalService.ts
  services/CreateStockWithdrawalItemService.ts
  services/ListStockWithdrawalService.ts
  services/ListStockWithdrawalItemsService.ts
  services/UpdateStockWithdrawalStatusService.ts
  services/ChangeStockWithdrawalDownloadedService.ts
  services/DeleteStockWithdrawalItemService.ts
  infra/http/controllers/StockWithdrawalControllers.ts
  infra/http/routes/stockWithdrawal.routes.ts
```

## Arquivos alterados

- `prisma/schema.prisma` — 5 novos models (ver acima).
- `src/shared/container/index.ts` — registro dos 3 novos repositórios no
  tsyringe.
- `src/shared/infra/http/routes/index.ts` — registro das 3 novas rotas
  (`/stockProduct`, `/inventory`, `/stockWithdrawal`).

## Decisões em aberto / pontos de atenção

- **Regra de acesso**: não foi criada nenhuma regra nova obrigatória no
  banco — o app libera o menu de estoque para usuários com `UserRules`
  contendo `"stock"` **ou** `"admin"`. Cadastre a regra `"stock"` nos
  usuários do almoxarifado que não forem admin.
- **Status "em_andamento" vs "finalizado"**: o enunciado original pedia que o
  ERP baixe o inventário "com status de em andamento". Implementei os dois
  sinais (`status` e `downloaded`) para dar flexibilidade: o ERP pode optar
  por processar assim que `downloaded=false` (não esperando o app marcar
  `finalizado`) ou esperar `status="finalizado"` antes de processar — vale
  alinhar com o time qual comportamento faz mais sentido operacionalmente.
