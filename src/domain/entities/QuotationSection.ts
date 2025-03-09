import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Quotation } from '@domain/entities/Quotation';
import { QuotationItem } from '@domain/entities/QuotationItem';

export interface QuotationSectionProps {
  id?: number;
  name: string;
  date: Date;
  quotationId: number;
  quotation?: Quotation;
  description?: string;
  subtotal?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('quotation_sections')
export class QuotationSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  quotationId: number;

  @ManyToOne(() => Quotation, quotation => quotation.sections)
  @JoinColumn({ name: 'quotationId' })
  quotation: Quotation;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @OneToMany(() => QuotationItem, item => item.section)
  items: QuotationItem[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculate section subtotal based on items
  calculateSubtotal(): void {
    this.subtotal = 0;

    if (this.items && this.items.length > 0) {
      this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
    }
  }
}
