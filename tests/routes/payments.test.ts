import request from 'supertest';

const mockCreatePayment = jest.fn();
const mockRetrievePayment = jest.fn();
const mockConstructEvent = jest.fn();
const mockCreatePaymentRecord = jest.fn();
const mockUpdatePaymentStatus = jest.fn();
const mockIsEventProcessed = jest.fn();
const mockMarkEventProcessed = jest.fn();

jest.mock('../../src/services/stripe', () => ({
  createPaymentIntent: mockCreatePayment,
  retrievePaymentIntent: mockRetrievePayment,
  default: {},
}));

jest.mock('stripe', () => ({
  __esModule: true,
  default: {
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  },
}));

jest.mock('../../src/db/repositories/payments', () => ({
  paymentRepository: {
    createPayment: mockCreatePaymentRecord,
    getPaymentByStripeId: jest.fn(),
    updatePaymentStatus: mockUpdatePaymentStatus,
    isEventProcessed: mockIsEventProcessed,
    markEventProcessed: mockMarkEventProcessed,
  },
}));

jest.mock('winston', () => ({
  createLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
  },
}));

import app from '../../src/app';

describe('Payments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('debe retornar status ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', webhookConfigured: expect.any(Boolean) });
    });
  });

  describe('POST /api/payments/create', () => {
    it('debe crear payment intent exitosamente', async () => {
      mockCreatePayment.mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
      });

      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 100, currency: 'mxn' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        clientSecret: 'pi_test_123_secret',
        paymentIntentId: 'pi_test_123',
      });
      expect(mockCreatePayment).toHaveBeenCalledWith(100, 'mxn', undefined);
    });

    it('debe rechazar monto faltante', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar monto cero', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 0 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar monto negativo', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: -10 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debe manejar error de Stripe con 500', async () => {
      mockCreatePayment.mockRejectedValue(new Error('Stripe connection failed'));

      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 100 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('debe usar el precio de la herramienta cuando viene toolId', async () => {
      mockCreatePayment.mockResolvedValue({
        id: 'pi_test_tool',
        client_secret: 'pi_test_tool_secret',
      });

      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 100, toolId: 'tool-001' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        clientSecret: 'pi_test_tool_secret',
        paymentIntentId: 'pi_test_tool',
        toolId: 'tool-001',
        toolName: 'Camiseta Básica',
      });
      expect(mockCreatePayment).toHaveBeenCalledWith(
        35000,
        'mxn',
        expect.objectContaining({
          toolId: 'tool-001',
        toolName: 'Camiseta Básica',
        })
      );
    });

    it('debe usar el amount del body cuando no viene toolId', async () => {
      mockCreatePayment.mockResolvedValue({
        id: 'pi_test_amount',
        client_secret: 'pi_test_amount_secret',
      });

      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 25000, currency: 'mxn' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        clientSecret: 'pi_test_amount_secret',
        paymentIntentId: 'pi_test_amount',
      });
      expect(mockCreatePayment).toHaveBeenCalledWith(25000, 'mxn', undefined);
    });

    it('debe retornar 404 cuando toolId no existe', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({ amount: 100, toolId: 'tool-999' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Herramienta no encontrada');
    });
  });

  describe('GET /api/payments/:id', () => {
    it('debe recuperar payment intent por id', async () => {
      mockRetrievePayment.mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 100,
        currency: 'mxn',
      });

      const response = await request(app).get('/api/payments/pi_test_123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 100,
        currency: 'mxn',
      });
      expect(mockRetrievePayment).toHaveBeenCalledWith('pi_test_123');
    });

    it('debe manejar error al recuperar con 500', async () => {
      mockRetrievePayment.mockRejectedValue(new Error('Not found'));

      const response = await request(app).get('/api/payments/pi_invalid');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('debe rechazar sin firma de Stripe', async () => {
      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment_intent.succeeded' });

      expect(response.status).toBe(400);
    });

    it('debe procesar webhook con firma valida', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_test_123',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_123', amount: 100, currency: 'mxn', status: 'succeeded' } },
      });
      mockIsEventProcessed.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'sig_valid')
        .send('{"type":"payment_intent.succeeded"}');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
      expect(mockCreatePaymentRecord).toHaveBeenCalledWith(expect.objectContaining({
        stripePaymentIntentId: 'pi_test_123',
        amount: 100,
        currency: 'mxn',
        status: 'succeeded',
      }));
      expect(mockMarkEventProcessed).toHaveBeenCalledWith('evt_test_123', 'payment_intent.succeeded');
    });

    it('debe retornar alreadyProcessed si el evento ya fue procesado', async () => {
      mockConstructEvent.mockReturnValue({
        id: 'evt_test_456',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_456' } },
      });
      mockIsEventProcessed.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'sig_valid')
        .send('{"type":"payment_intent.succeeded"}');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true, alreadyProcessed: true });
      expect(mockCreatePaymentRecord).not.toHaveBeenCalled();
      expect(mockMarkEventProcessed).not.toHaveBeenCalled();
    });
  });
});
