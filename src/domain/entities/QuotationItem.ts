import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Quotation } from './Quotation';
import { QuotationSection } from './QuotationSection';
import { Equipment } from './Equipment';

export enum ItemType {
  RENTAL = 'rental',
  SERVICE = 'service',
  SALE = 'sale'
}

export interface QuotationItemProps {
  id?: number;
  quotationId: number;
  quotation?: Quotation;
  sectionId?: number;
  section?: QuotationSection;
  equipmentId?: number;
  equipment?: Equipment;
  itemName: string;
  description?: string;
  quantity: number;
  unit?: string;
  pricePerDay: number;
  days: number;
  total?: number;
  remarks?: string;
  type?: ItemType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('quotation_items')
export class QuotationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quotationId: number;

  @ManyToOne(() => Quotation, quotation => quotation.items)
  @JoinColumn({ name: 'quotationId' })
  quotation: Quotation;

  @Column({ nullable: true })
  sectionId: number;

  @ManyToOne(() => QuotationSection, section => section.items)
  @JoinColumn({ name: 'sectionId' })
  section: QuotationSection;

  @Column({ nullable: true })
  equipmentId: number;

  @ManyToOne(() => Equipment)
  @JoinColumn({ name: 'equipmentId' })
  equipment: Equipment;

  @Column()
  itemName: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column()
  quantity: number;

  @Column({ nullable: true, default: 'Set' })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerDay: number;

  @Column({ default: 1 })
  days: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.RENTAL
  })
  type: ItemType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculate total based on quantity, price and days
  calculateTotal(): void {
    this.total = this.quantity * this.pricePerDay * this.days;
  }
}
