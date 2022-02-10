import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @ManyToMany((type) => Role, (role) => role.user)
  @JoinTable()
  roles: Role[];

  @Column({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: string;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
