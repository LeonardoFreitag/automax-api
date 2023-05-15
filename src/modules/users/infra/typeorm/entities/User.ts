import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import UserRules from './UserRules';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  isAdmin: boolean;

  @Column()
  name: string;

  @Column()
  cellphone: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  isCommissioned: boolean;

  @Column()
  comissionPercentage: number;

  @OneToMany(() => UserRules, tab => tab.user, {
    cascade: true,
  })
  rules: UserRules[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
