import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripe';
import { paymentRepository } from '../db/repositories/payments';
import { createPaymentSchema } from '../types';
import { config } from '../config';
import logger from '../utils/logger';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  return res.json({ message: 'API de pagos Vulturus', endpoints: ['POST /create', 'GET /:id', 'POST /webhook'] });
});

router.post('/create', async (req: Request, res: Response) => {
  const parsed = createPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.warn('Intento de pago con datos invalidos', { errors: parsed.error.flatten() });
    return res.status(400).json({ error: 'Datos invalidos', details: parsed.error.flatten() });
  }

  const { amount, currency, metadata } = parsed.data;

  try {
    logger.info('Creando PaymentIntent', { amount, currency });
    const paymentIntent = await createPaymentIntent(amount, currency, metadata);
    logger.info('PaymentIntent creado', { id: paymentIntent.id, amount });
    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    logger.error('Error al crear PaymentIntent', { error: error.message, amount });
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id.startsWith('pi_')) {
    return res.status(404).json({ error: 'PaymentIntent no encontrado' });
  }

  try {
    logger.info('Consultando PaymentIntent', { id });
    const payment = await retrievePaymentIntent(id);
    return res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error: any) {
    logger.error('Error al consultar PaymentIntent', { error: error.message, id });
    return res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: 'Falta firma de Stripe' });
  }

  try {
    const event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret
    );

    logger.info('Webhook recibido', { type: event.type, id: event.id });

    const isProcessed = await paymentRepository.isEventProcessed(event.id);
    if (isProcessed) {
      logger.info('Webhook event already processed', { eventId: event.id });
      return res.json({ received: true, alreadyProcessed: true });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info('Pago completado', { id: paymentIntent.id });
        await paymentRepository.createPayment({
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
        });
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.warn('Pago fallido', { id: paymentIntent.id });
        await paymentRepository.updatePaymentStatus(
          paymentIntent.id,
          paymentIntent.status,
          paymentIntent.metadata
        );
        break;
      }
    }

    await paymentRepository.markEventProcessed(event.id, event.type);

    return res.json({ received: true });
  } catch (error: any) {
    logger.error('Error en webhook', { error: error.message });
    return res.status(400).json({ error: error.message });
  }
});

export default router;
