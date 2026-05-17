import Stripe from 'stripe';
import { config } from '../config';
import { paymentRepository } from '../db/repositories/payments';
import logger from '../utils/logger';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: config.stripe.apiVersion as any,
});

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'mxn',
  metadata?: Record<string, string>
) => {
  const createParams: Stripe.PaymentIntentCreateParams = {
    amount: Math.round(amount),
    currency,
    payment_method_types: ['card'],
  };

  if (metadata && Object.keys(metadata).length > 0) {
    createParams.metadata = metadata;
  }

  const paymentIntent = await stripe.paymentIntents.create(createParams);

  try {
    await paymentRepository.createPayment({
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata,
    });
  } catch (dbError: any) {
    logger.error('Error al guardar pago en base de datos', {
      error: dbError.message,
      paymentIntentId: paymentIntent.id,
    });
  }

  return paymentIntent;
};

export const retrievePaymentIntent = async (id: string) => {
  return await stripe.paymentIntents.retrieve(id);
};

export default stripe;
