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

@Entity('productPrice')
class ProductPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  tableName: string;

  @Column()
  price: number;

  @Column()
  height: number;

  @Column()
  heightUnity: string;

  @Column()
  width: number;

  @Column()
  widthUnity: string;

  @Column()
  depth: number;

  @Column()
  depthUnity: string;

  @Column()
  depthOpen: number;

  @Column()
  depthOpenUnity: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, tab => tab.price)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

export default ProductPrice;
