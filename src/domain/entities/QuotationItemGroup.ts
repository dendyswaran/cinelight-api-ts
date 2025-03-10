import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { QuotationSection } from './QuotationSection';
import { QuotationItem } from './QuotationItem';

@Entity('quotation_items')
export class QuotationItemGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sectionId: number;

  @ManyToOne(() => QuotationSection, section => section.groups)
  @JoinColumn({ name: 'sectionId' })
  section: QuotationSection;

  @OneToMany(() => QuotationItem, item => item.group)
  items: QuotationItem[];

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  calculateTotal(): void {
    this.total = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
  }
}
