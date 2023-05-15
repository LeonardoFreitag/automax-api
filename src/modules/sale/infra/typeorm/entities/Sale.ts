import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import SaleItems from './SaleItems';
import SalePaymentForm from './SalePaymentForm';

@Entity('sale')
class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  selerId: string;

  @Column()
  saleNumber: string;

  @Column()
  saleDate: Date;

  @Column()
  clientId: string;

  @Column()
  amount: number;

  @Column()
  discount: number;

  @Column()
  total: number;

  @Column()
  notes: string;

  @Column()
  finished: boolean;

  @Column()
  sent: boolean;

  @Column()
  refused: boolean;

  @Column()
  refusedNotes: string;

  @Column()
  returned: boolean;

  @Column()
  returnedNotes: string;

  @Column()
  signatureFileName?: string;

  @Column()
  signatureUrl?: string;

  @Column()
  signatureBase64?: string;

  @Column()
  accepted: boolean;

  @OneToMany(() => SaleItems, tab => tab.sale, {
    cascade: true,
  })
  items: SaleItems[];

  @OneToMany(() => SalePaymentForm, tab => tab.sale, {
    cascade: true,
  })
  paymentForm: SalePaymentForm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Sale;
