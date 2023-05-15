import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import ClientContact from './ClientContact';
import ClientPaymentForm from './ClientPaymentForm';

@Entity('client')
class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  code: string;

  @Column()
  companyName: string;

  @Column()
  comercialName: string;

  @Column()
  streetName: string;

  @Column()
  streetNumber: string;

  @Column()
  neighborhood: string;

  @Column()
  complement: string;

  @Column()
  cnpj: string;

  @Column()
  ie: string;

  @Column()
  cityCode: string;

  @Column()
  city: string;

  @Column()
  stateCode: string;

  @Column()
  state: string;

  @Column()
  financialPendency: boolean;

  @Column()
  isNew: boolean;

  @OneToMany(() => ClientContact, tab => tab.client, {
    cascade: true,
  })
  contacts: ClientContact[];

  @OneToMany(() => ClientPaymentForm, tab => tab.client, {
    cascade: true,
  })
  paymentForm: ClientPaymentForm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Client;
