import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import OrderItems from './OrderItems';

@Entity('order')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  orderNumber: string;

  @Column()
  userId: string;

  @Column()
  orderDate: Date;

  @Column()
  description: string;

  @Column()
  notes: string;

  @OneToMany(() => OrderItems, tab => tab.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItems[];

  @Column()
  finished: boolean;

  @Column()
  canceled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Order;
