import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  async getSummary(userId: string) {
    const investments = await this.investmentRepository.find({
      where: { userId },
    });

    if (investments.length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        profitPercentage: 0,
        totalInvestments: 0,
        bestPerforming: null,
        worstPerforming: null,
        breakdownByType: [],
      };
    }

    let totalInvested = 0;
    let currentValue = 0;

    let bestPerforming = investments[0];
    let worstPerforming = investments[0];
    let bestProfitPercentage = -Infinity;
    let worstProfitPercentage = Infinity;

    const breakdownMap = new Map<string, { type: string; totalInvested: number; currentValue: number }>();

    investments.forEach((inv) => {
      const invInvested = Number(inv.investedAmount);
      const invCurrent = Number(inv.currentValue);
      
      totalInvested += invInvested;
      currentValue += invCurrent;

      const profit = invCurrent - invInvested;
      const profitPercentage = invInvested > 0 ? (profit / invInvested) * 100 : 0;

      if (profitPercentage > bestProfitPercentage) {
        bestProfitPercentage = profitPercentage;
        bestPerforming = inv;
      }

      if (profitPercentage < worstProfitPercentage) {
        worstProfitPercentage = profitPercentage;
        worstPerforming = inv;
      }

      const type = inv.investmentType;
      if (!breakdownMap.has(type)) {
        breakdownMap.set(type, { type, totalInvested: 0, currentValue: 0 });
      }
      const bd = breakdownMap.get(type)!;
      bd.totalInvested += invInvested;
      bd.currentValue += invCurrent;
    });

    const totalProfit = currentValue - totalInvested;
    const totalProfitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      profit: totalProfit,
      profitPercentage: totalProfitPercentage,
      totalInvestments: investments.length,
      bestPerforming,
      worstPerforming,
      breakdownByType: Array.from(breakdownMap.values()),
    };
  }
}
