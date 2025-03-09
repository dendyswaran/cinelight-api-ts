import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';

export interface UserProps {
  id?: number;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    // Only hash the password if it has been modified
    if (this.password && this.password.length < 60) {
      this.password = hashSync(this.password, 10);
    }
  }

  validatePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
