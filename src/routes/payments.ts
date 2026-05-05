import { Router, Request, Response } from 'express';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripe';
import logger from '../utils/logger';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    logger.warn('Intento de pago con monto invalido', { amount });
    return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
  }

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

export default router;
