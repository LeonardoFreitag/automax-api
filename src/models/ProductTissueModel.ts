export interface ProductTissueModel {
  id?: string;
  productId: string;
  description: string;
  type: string;
  underConsultation: boolean;
  inRestocked: boolean;
}
