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

@Entity('clientContact')
class ClientContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  name: string;

  @Column()
  fone: string;

  @Column()
  foneType: string;

  @Column()
  isWhatsApp: boolean;

  @Column()
  email: string;

  @Column()
  job: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, tab => tab.contacts)
  @JoinColumn({ name: 'clientId' })
  client: Client;
}

export default ClientContact;
