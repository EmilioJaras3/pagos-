import { Router, Request, Response } from 'express';
import { createPaymentIntent, retrievePaymentIntent } from '../services/stripe';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
  }

  try {
    const paymentIntent = await createPaymentIntent(amount, currency);
    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const payment = await retrievePaymentIntent(req.params.id);
    return res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
