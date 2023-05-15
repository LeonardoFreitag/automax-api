import { ProductPriceModel } from './ProductPriceModel';
import { ProductTissueModel } from './ProductTissueModel';

export interface ProductModel {
  id: string;
  customerId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  groupId: string;
  group: string;
  price: ProductPriceModel[];
  tissue: ProductTissueModel[];
  photoFileName?: string;
  photoUrl?: string;
  photoSize?: string;
}
