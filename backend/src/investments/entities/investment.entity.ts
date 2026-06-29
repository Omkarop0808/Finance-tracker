import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InvestmentType {
  MUTUAL_FUND = 'Mutual Fund',
  STOCKS = 'Stocks',
  CRYPTO = 'Crypto',
  REAL_ESTATE = 'Real Estate',
  FIXED_DEPOSIT = 'Fixed Deposit',
  OTHER = 'Other',
}

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'investment_name' })
  investmentName: string;

  @Column({ name: 'investment_type', type: 'enum', enum: InvestmentType })
  investmentType: string;

  @Column({ name: 'invested_amount', type: 'decimal', precision: 12, scale: 2 })
  investedAmount: number;

  @Column({ name: 'current_value', type: 'decimal', precision: 12, scale: 2 })
  currentValue: number;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.investments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
