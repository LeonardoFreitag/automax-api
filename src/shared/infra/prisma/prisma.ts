import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Carrega .env a partir da raiz do projeto independentemente do cwd (dist ou src)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Falha explícita para facilitar diagnóstico em ambiente de build
  throw new Error(
    'DATABASE_URL não encontrada. Verifique se o .env existe na raiz e contém a variável.',
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
