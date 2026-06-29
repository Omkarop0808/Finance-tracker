import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load .env from parent dir because backend is inside multiply/backend, while .env is at multiply/.env
// Wait, actually, let's just make sure backend uses its own .env if needed, or we point to the parent dir.
config({ path: join(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { 
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for many cloud databases like Render/Neon
      }
    : {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'multiply_finance',
      }),
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'database/migrations', '*.{ts,js}')],
  synchronize: false,
});
