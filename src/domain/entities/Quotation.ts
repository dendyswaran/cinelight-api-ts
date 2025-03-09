import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { QuotationItem } from '@domain/entities/QuotationItem';
import { QuotationSection } from '@domain/entities/QuotationSection';

export enum QuotationStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CONVERTED_TO_DO = 'converted_to_do',
  CONVERTED_TO_INVOICE = 'converted_to_invoice'
}

export interface QuotationProps {
  id?: number;
  quotationNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  projectName?: string;
  projectDescription?: string;
  issueDate: Date;
  validUntil?: Date;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  status?: QuotationStatus;
  notes?: string;
  terms?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  quotationNumber: string;

  @Column()
  clientName: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ nullable: true, type: 'text' })
  clientAddress: string;

  @Column({ nullable: true })
  projectName: string;

  @Column({ nullable: true, type: 'text' })
  projectDescription: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({
    type: 'enum',
    enum: QuotationStatus,
    default: QuotationStatus.DRAFT
  })
  status: QuotationStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, type: 'text' })
  terms: string;

  @OneToMany(() => QuotationSection, section => section.quotation, { cascade: true })
  sections: QuotationSection[];

  @OneToMany(() => QuotationItem, item => item.quotation, { cascade: true })
  items: QuotationItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Calculate totals based on items
  calculateTotals(): void {
    this.subtotal = 0;

    if (this.items && this.items.length > 0) {
      this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
    }

    // Apply tax and discount
    const taxAmount = this.subtotal * (this.tax / 100);
    const discountAmount = this.subtotal * (this.discount / 100);

    this.total = this.subtotal + taxAmount - discountAmount;
  }
}
