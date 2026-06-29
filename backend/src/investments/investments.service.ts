import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment, InvestmentType } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  async create(userId: string, createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      purchaseDate: new Date(createInvestmentDto.purchaseDate),
      userId,
    });
    return this.investmentRepository.save(investment);
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    investmentType?: InvestmentType,
    sortBy?: 'investedAmount' | 'currentValue' | 'purchaseDate',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const query = this.investmentRepository.createQueryBuilder('investment')
      .where('investment.userId = :userId', { userId });

    if (investmentType) {
      query.andWhere('investment.investmentType = :investmentType', { investmentType });
    }

    if (sortBy) {
      query.orderBy(`investment.${sortBy}`, order);
    } else {
      query.orderBy('investment.createdAt', 'DESC');
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, id: string): Promise<Investment> {
    const investment = await this.investmentRepository.findOne({ where: { id } });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }
    if (investment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this investment');
    }
    return investment;
  }

  async update(userId: string, id: string, updateInvestmentDto: UpdateInvestmentDto): Promise<Investment> {
    const investment = await this.findOne(userId, id);
    
    const updateData: any = { ...updateInvestmentDto };
    if (updateData.purchaseDate) {
      updateData.purchaseDate = new Date(updateData.purchaseDate);
    }

    Object.assign(investment, updateData);
    return this.investmentRepository.save(investment);
  }

  async remove(userId: string, id: string): Promise<void> {
    const investment = await this.findOne(userId, id);
    await this.investmentRepository.remove(investment);
  }
}
