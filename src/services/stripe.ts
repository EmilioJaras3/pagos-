import Stripe from 'stripe';
import { config } from '../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: config.stripe.apiVersion,
});

export const createPaymentIntent = async (amount: number, currency: string = 'mxn') => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    payment_method_types: ['card'],
  });
};

export const retrievePaymentIntent = async (id: string) => {
  return await stripe.paymentIntents.retrieve(id);
};

export default stripe;
