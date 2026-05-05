import Stripe from 'stripe';
import { config } from '../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: config.stripe.apiVersion,
});

export const createPaymentIntent = async (amount: number, currency: string = 'mxn') => {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  });
};

export const retrievePaymentIntent = async (id: string) => {
  return await stripe.paymentIntents.retrieve(id);
};

export default stripe;
