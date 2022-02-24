import { type } from 'os';
import { User } from '../../users/entities/user.entity';
User;
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany((type) => User, (user) => user.roles)
  @JoinColumn()
  user: User[];
}

export type RoleName = 'Administrador' | 'Usuario';
