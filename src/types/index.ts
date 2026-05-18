import { z } from 'zod';

const cartItemSchema = z.object({
  toolId: z.string().regex(/^tool-\d{3}$/),
  quantity: z.number().int().positive().default(1),
});

export const createPaymentSchema = z.object({
  amount: z.number().int().positive().max(99999999),
  currency: z.string().length(3).default('mxn'),
  metadata: z.record(z.string()).optional(),
  toolId: z.string().regex(/^tool-\d{3}$/).optional(),
  items: z.array(cartItemSchema).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export interface PaymentResponse {
  clientSecret: string | null;
  paymentIntentId: string;
  toolId?: string;
  toolName?: string;
  items?: { toolId: string; toolName: string; quantity: number; price: number }[];
  totalAmount?: number;
}

export interface PaymentStatusResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
}
