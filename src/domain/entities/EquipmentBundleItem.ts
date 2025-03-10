import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Equipment } from './Equipment';
import { EquipmentBundle } from './EquipmentBundle';

export interface EquipmentBundleItemProps {
  id?: number;
  bundleId: number;
  equipmentId: number;
  quantity: number;
  bundle?: EquipmentBundle;
  equipment?: Equipment;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('equipment_bundle_items')
export class EquipmentBundleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bundleId: number;

  @Column()
  equipmentId: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => EquipmentBundle, (bundle: EquipmentBundle) => bundle.bundleItems)
  @JoinColumn({ name: 'bundleId' })
  bundle: EquipmentBundle;

  @ManyToOne(() => Equipment, (equipment: Equipment) => equipment.bundleItems)
  @JoinColumn({ name: 'equipmentId' })
  equipment: Equipment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
