import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z.number().int().positive().max(99999999),
  currency: z.string().length(3).default('mxn'),
  metadata: z.record(z.string()).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export interface PaymentResponse {
  clientSecret: string | null;
  paymentIntentId: string;
}

export interface PaymentStatusResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
}
