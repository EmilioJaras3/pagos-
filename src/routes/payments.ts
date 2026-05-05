import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripe';
import { createPaymentSchema } from '../types';
import logger from '../utils/logger';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const parsed = createPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.warn('Intento de pago con datos invalidos', { errors: parsed.error.flatten() });
    return res.status(400).json({ error: 'Datos invalidos', details: parsed.error.flatten() });
  }

  const { amount, currency } = parsed.data;

  try {
    logger.info('Creando PaymentIntent', { amount, currency });
    const paymentIntent = await createPaymentIntent(amount, currency);
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
  try {
    logger.info('Consultando PaymentIntent', { id: req.params.id });
    const payment = await retrievePaymentIntent(req.params.id);
    return res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error: any) {
    logger.error('Error al consultar PaymentIntent', { error: error.message, id: req.params.id });
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
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    logger.info('Webhook recibido', { type: event.type });

    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('Pago completado', { id: (event.data.object as Stripe.PaymentIntent).id });
        break;
      case 'payment_intent.payment_failed':
        logger.warn('Pago fallido', { id: (event.data.object as Stripe.PaymentIntent).id });
        break;
    }

    return res.json({ received: true });
  } catch (error: any) {
    logger.error('Error en webhook', { error: error.message });
    return res.status(400).json({ error: error.message });
  }
});

export default router;
