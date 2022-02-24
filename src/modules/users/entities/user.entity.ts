import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../../roles/entities/roles.enum';

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

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  get fullName(): string {
    return this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName;
  }

  @Expose()
  get isAdmin(): boolean {
    return this.roles.some((role: Role) => role.id === Roles.ADMINISTRADOR);
  }
}
