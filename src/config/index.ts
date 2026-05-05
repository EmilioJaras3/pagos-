import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    apiVersion: '2025-02-24.acacia' as const,
  },
};
