import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity('userRefreshTokens')
class UserRefreshTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  refreshToken: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  expiresDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}

export default UserRefreshTokens;
