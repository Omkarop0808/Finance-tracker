import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InvestmentsModule } from './investments/investments.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    DatabaseModule, 
    UsersModule, 
    AuthModule, 
    InvestmentsModule, 
    PortfolioModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
