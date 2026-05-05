import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import paymentRoutes from './routes/payments';
import logger from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/payments', paymentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error no manejado', { error: err.message });
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
