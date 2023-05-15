import { ProductPriceModel } from '@models/ProductPriceModel';
import { ProductTissueModel } from '@models/ProductTissueModel';

export interface ICreateProductDTO {
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
