import { IsNotEmpty, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { InvestmentType } from '../entities/investment.entity';

export class CreateInvestmentDto {
  @IsNotEmpty()
  investmentName: string;

  @IsEnum(InvestmentType)
  @IsNotEmpty()
  investmentType: InvestmentType;

  @IsNumber()
  @Min(0)
  investedAmount: number;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsDateString()
  @IsNotEmpty()
  purchaseDate: string;
}
