import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/payments';
import logger from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/payments', paymentLimiter, paymentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error no manejado', { error: err.message });
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
