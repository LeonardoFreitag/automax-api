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

@Entity('salePaymentForm')
class SalePaymentForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  saleId: string;

  @Column()
  paymentFormId: string;

  @Column()
  descripriont: string;

  @Column()
  amount: number;

  @Column()
  installments: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Sale, tab => tab.paymentForm)
  @JoinColumn({ name: 'saleId' })
  sale: Sale;
}

export default SalePaymentForm;
