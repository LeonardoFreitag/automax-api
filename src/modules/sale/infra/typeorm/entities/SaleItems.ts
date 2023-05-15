import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Sale from './Sale';

@Entity('saleItems')
class SaleItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  saleId: string;

  @Column()
  productId: string;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column()
  description: string;

  @Column()
  unity: string;

  @Column()
  tableId: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  amount: number;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Sale, tab => tab.items)
  @JoinColumn({ name: 'saleId' })
  sale: Sale;
}

export default SaleItems;
