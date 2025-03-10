import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { EquipmentBundleItem } from './EquipmentBundleItem';

export interface EquipmentBundleProps {
  id?: number;
  name: string;
  description?: string;
  dailyRentalPrice: number;
  discount?: number; // Percentage discount compared to buying items separately
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  bundleItems?: EquipmentBundleItem[];
}

@Entity('equipment_bundles')
export class EquipmentBundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  dailyRentalPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => EquipmentBundleItem, bundleItem => bundleItem.bundle, {
    cascade: true
  })
  bundleItems: EquipmentBundleItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
