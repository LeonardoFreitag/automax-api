import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Order from './Order';
import OrderItemPhases from './OrderItemPhases';

@Entity('orderItems')
class OrderItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  saleId: string;

  @Column()
  description: string;

  @OneToMany(() => OrderItemPhases, tab => tab.orderItemPhases, {
    cascade: true,
    eager: true,
  })
  phases: OrderItemPhases[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, tab => tab.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}

export default OrderItems;
