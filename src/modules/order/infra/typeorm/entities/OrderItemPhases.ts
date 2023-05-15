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
import OrderItems from './OrderItems';

@Entity('orderItemsPhases')
class OrderItemsPhases {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderItemId: string;

  @Column()
  employeeId: string;

  @Column()
  phaseDate: Date;

  @Column()
  phaseId: string;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => OrderItems, tab => tab.phases)
  @JoinColumn({ name: 'orderItemId' })
  orderItemPhases: OrderItems;
}

export default OrderItemsPhases;
