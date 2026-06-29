import { AppDataSource } from '../ormconfig';
import { User } from '../users/entities/user.entity';
import { Investment, InvestmentType } from '../investments/entities/investment.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding.');

  const userRepository = AppDataSource.getRepository(User);
  const investmentRepository = AppDataSource.getRepository(Investment);

  // Clear existing data for a fresh start (optional, maybe skip for now or do if needed)
  // await investmentRepository.delete({});
  // await userRepository.delete({});

  const existingUser = await userRepository.findOne({ where: { email: 'test@example.com' } });
  if (existingUser) {
    console.log('Test user already exists. Seeding skipped.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = userRepository.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
  });

  const savedUser = await userRepository.save(testUser);

  const investments = [
    {
      investmentName: 'Vanguard S&P 500',
      investmentType: InvestmentType.MUTUAL_FUND,
      investedAmount: 20000,
      currentValue: 25000,
      purchaseDate: new Date('2023-01-15'),
      userId: savedUser.id,
    },
    {
      investmentName: 'Apple Inc',
      investmentType: InvestmentType.STOCKS,
      investedAmount: 10000,
      currentValue: 12000,
      purchaseDate: new Date('2023-05-10'),
      userId: savedUser.id,
    },
    {
      investmentName: 'Bitcoin',
      investmentType: InvestmentType.CRYPTO,
      investedAmount: 5000,
      currentValue: 15000,
      purchaseDate: new Date('2022-11-01'),
      userId: savedUser.id,
    },
    {
      investmentName: 'Rental Property',
      investmentType: InvestmentType.REAL_ESTATE,
      investedAmount: 100000,
      currentValue: 105000,
      purchaseDate: new Date('2024-01-05'),
      userId: savedUser.id,
    },
    {
      investmentName: 'SBI FD',
      investmentType: InvestmentType.FIXED_DEPOSIT,
      investedAmount: 50000,
      currentValue: 52000,
      purchaseDate: new Date('2023-12-01'),
      userId: savedUser.id,
    },
  ];

  await investmentRepository.save(investments);
  console.log('Seeding complete. Created 1 test user and 5 sample investments.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error during seeding', error);
  process.exit(1);
});
