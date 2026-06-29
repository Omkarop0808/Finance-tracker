import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...(configService.get<string>('DATABASE_URL')
          ? { 
              url: configService.get<string>('DATABASE_URL'),
              ssl: { rejectUnauthorized: false }
            }
          : {
              host: configService.get<string>('DATABASE_HOST') || configService.get<string>('DB_HOST', 'localhost'),
              port: configService.get<number>('DATABASE_PORT') || configService.get<number>('DB_PORT', 5433),
              username: configService.get<string>('DATABASE_USER') || configService.get<string>('DB_USER', 'postgres'),
              password: configService.get<string>('DATABASE_PASSWORD') || configService.get<string>('DB_PASSWORD', 'postgres'),
              database: configService.get<string>('DATABASE_NAME') || configService.get<string>('DB_NAME', 'multiply_finance'),
            }),
        entities: [User, Investment],
        synchronize: false, // Using migrations instead
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
