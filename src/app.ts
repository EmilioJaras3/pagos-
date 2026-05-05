import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import paymentRoutes from './routes/payments';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/payments', paymentRoutes);

export default app;
