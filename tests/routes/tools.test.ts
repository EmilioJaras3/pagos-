import request from 'supertest';

jest.mock('../../src/services/stripe', () => ({
  createPaymentIntent: jest.fn(),
  retrievePaymentIntent: jest.fn(),
  default: {},
}));

jest.mock('stripe', () => ({
  __esModule: true,
  default: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

jest.mock('../../src/db/repositories/payments', () => ({
  paymentRepository: {
    createPayment: jest.fn(),
    getPaymentByStripeId: jest.fn(),
    updatePaymentStatus: jest.fn(),
    isEventProcessed: jest.fn(),
    markEventProcessed: jest.fn(),
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

describe('Tools API', () => {
  describe('GET /api/tools', () => {
    it('debe retornar las 5 herramientas', async () => {
      const response = await request(app).get('/api/tools');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(5);
      expect(response.body[0]).toMatchObject({
        id: 'tool-001',
        name: 'Camiseta Básica',
      });
    });
  });

  describe('GET /api/tools/:id', () => {
    it('debe retornar la herramienta correcta', async () => {
      const response = await request(app).get('/api/tools/tool-001');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 'tool-001',
        name: 'Camiseta Básica',
        price: 35000,
      });
    });

    it('debe retornar 404 para id invalido', async () => {
      const response = await request(app).get('/api/tools/invalid');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
