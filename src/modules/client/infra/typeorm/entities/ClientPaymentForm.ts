import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Client from './Client';

@Entity('clientPaymentForm')
class ClientPaymentForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  paymentFormId: string;

  @Column()
  description: string;

  @Column()
  installmentsLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, tab => tab.paymentForm)
  @JoinColumn({ name: 'clientId' })
  client: Client;
}

export default ClientPaymentForm;
