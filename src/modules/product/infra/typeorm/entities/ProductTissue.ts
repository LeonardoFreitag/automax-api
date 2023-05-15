import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Product from './Product';

@Entity('productTissue')
class ProductTissue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  underConsultation: boolean;

  @Column()
  inRestocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, tab => tab.tissue)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

export default ProductTissue;
