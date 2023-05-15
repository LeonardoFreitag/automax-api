import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import ProductPrice from './ProductPrice';
import ProductTissue from './ProductTissue';

@Entity('product')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column()
  description: string;

  @Column()
  unity: string;

  @Column()
  groupId: string;

  @Column()
  group: string;

  @OneToMany(() => ProductPrice, tab => tab.product, {
    cascade: true,
  })
  price: ProductPrice[];

  @OneToMany(() => ProductTissue, tab => tab.product, {
    cascade: true,
  })
  tissue: ProductTissue[];

  @Column({
    nullable: true,
  })
  photoFileName: string;

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @Column({
    nullable: true,
  })
  photoSize: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Product;
