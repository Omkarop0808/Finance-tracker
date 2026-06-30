# Multiply Finance Portfolio Tracker

A complete full-stack Finance Portfolio Tracker application.

## Tech Stack
- **Backend**: NestJS (Node.js), TypeScript, PostgreSQL, TypeORM, JWT Auth,Neon DB
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, React Hook Form, Zod
- **Infrastructure**: Docker & Docker Compose

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Quick Start with Docker

1. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Backend Setup:**
   Navigate to the `backend` folder and copy `.env.example` to `.env`:
   ```bash
   cd backend
   npm install
   ```

   Run Migrations and Seed Data:
   ```bash
   npm run migration:run
   npm run seed
   ```

   Start the Backend:
   ```bash
   npm run start:dev
   ```

3. **Frontend Setup:**
   Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be available at [http://localhost:3001](http://localhost:3001).
The backend API is running at [http://localhost:3000](http://localhost:3000).

## Features
- **User Authentication**: Register and login securely using JWT tokens and bcrypt password hashing.
- **Dashboard Summary**: Real-time calculated cards showing total invested, current portfolio value, total profit/loss, and profit percentage.
- **Investments CRUD**: Add, edit, and delete investments spanning Mutual Funds, Stocks, Crypto, Real Estate, and more.
- **Pagination & Filtering**: Investments table supports pagination, sorting, and filtering by investment type.
- **Dynamic UX**: Responsive UI crafted with Tailwind CSS v4 and Framer Motion micro-animations.

## Seeder Info
A test user is automatically generated when running `npm run seed`:
- **Email:** test@multiply.com
- **Password:** password123
