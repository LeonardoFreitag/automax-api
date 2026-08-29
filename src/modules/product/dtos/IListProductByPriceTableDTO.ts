export default interface IListProductByPriceTableDTO {
  customerId: string;
  tableCode: string;
  regionId: string;
  groupId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  /**
   * Escape para consumidores que precisam ver o catálogo inteiro (conferência,
   * retaguarda). O app nunca envia: a tela de escolha de produto é entrada de
   * movimento novo e não pode oferecer item inativo.
   */
  includeInactive?: boolean;
}
