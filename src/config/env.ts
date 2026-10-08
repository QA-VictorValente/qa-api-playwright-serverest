import * as dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://serverest.dev',
  TIMEOUT: Number(process.env.TIMEOUT) || 30000
};
