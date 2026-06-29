import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { InvestmentType } from './entities/investment.entity';

@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    return this.investmentsService.create(user.userId, createInvestmentDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('investmentType') investmentType?: InvestmentType,
    @Query('sortBy') sortBy?: 'investedAmount' | 'currentValue' | 'purchaseDate',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.investmentsService.findAll(
      user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      investmentType,
      sortBy,
      order,
    );
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.investmentsService.findOne(user.userId, id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(user.userId, id, updateInvestmentDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.investmentsService.remove(user.userId, id);
  }
}
