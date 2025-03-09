import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { EquipmentCategory } from '@domain/entities/EquipmentCategory';

export interface EquipmentProps {
  id?: number;
  name: string;
  description?: string;
  dailyRentalPrice: number;
  quantity: number;
  categoryId: number;
  category?: EquipmentCategory;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  dailyRentalPrice: number;

  @Column()
  quantity: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => EquipmentCategory)
  @JoinColumn({ name: 'categoryId' })
  category: EquipmentCategory;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
