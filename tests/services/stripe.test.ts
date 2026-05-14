const mockStripeCreate = jest.fn();
const mockStripeRetrieve = jest.fn();
const mockCreatePaymentRecord = jest.fn();
const mockLoggerError = jest.fn();

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockStripeCreate,
      retrieve: mockStripeRetrieve,
    },
  })),
}));

jest.mock('../../src/config', () => ({
  config: {
    port: 3000,
    nodeEnv: 'test',
    stripe: {
      secretKey: 'sk_test_mock',
      apiVersion: '2026-04-22.dahlia',
    },
  },
}));

jest.mock('../../src/db/repositories/payments', () => ({
  paymentRepository: {
    createPayment: mockCreatePaymentRecord,
    getPaymentByStripeId: jest.fn(),
    updatePaymentStatus: jest.fn(),
    isEventProcessed: jest.fn(),
    markEventProcessed: jest.fn(),
  },
}));

jest.mock('../../src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: mockLoggerError,
    debug: jest.fn(),
  },
}));

import { createPaymentIntent, retrievePaymentIntent } from '../../src/services/stripe';

describe('StripeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('debe crear un payment intent con el monto en centavos', async () => {
      mockStripeCreate.mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        amount: 100,
        currency: 'mxn',
      });

      const result = await createPaymentIntent(100);

      expect(mockStripeCreate).toHaveBeenCalledWith({
        amount: 100,
        currency: 'mxn',
        payment_method_types: ['card'],
      });
      expect(result.id).toBe('pi_test_123');
      expect(result.client_secret).toBe('pi_test_123_secret');
    });

    it('debe aceptar moneda personalizada', async () => {
      mockStripeCreate.mockResolvedValue({
        id: 'pi_test_456',
        client_secret: 'pi_test_456_secret',
        amount: 200,
        currency: 'usd',
      });

      await createPaymentIntent(200, 'usd');

      expect(mockStripeCreate).toHaveBeenCalledWith({
        amount: 200,
        currency: 'usd',
        payment_method_types: ['card'],
      });
    });

    it('debe propagar errores de Stripe', async () => {
      mockStripeCreate.mockRejectedValue(new Error('Stripe API error'));

      await expect(createPaymentIntent(100)).rejects.toThrow('Stripe API error');
    });

    it('debe redondear montos decimales a enteros', async () => {
      mockStripeCreate.mockResolvedValue({
        id: 'pi_test_789',
        client_secret: 'pi_test_789_secret',
        amount: 150,
        currency: 'mxn',
      });

      await createPaymentIntent(150.75);

      expect(mockStripeCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 151 })
      );
    });

    it('debe persistir el pago en base de datos tras crearlo', async () => {
      mockStripeCreate.mockResolvedValue({
        id: 'pi_test_999',
        client_secret: 'pi_test_999_secret',
        amount: 500,
        currency: 'usd',
        status: 'requires_payment_method',
      });

      await createPaymentIntent(500, 'usd', { orderId: '123' });

      expect(mockCreatePaymentRecord).toHaveBeenCalledWith({
        stripePaymentIntentId: 'pi_test_999',
        amount: 500,
        currency: 'usd',
        status: 'requires_payment_method',
        metadata: { orderId: '123' },
      });
    });

    it('debe continuar si falla la persistencia en base de datos', async () => {
      mockStripeCreate.mockResolvedValue({
        id: 'pi_test_000',
        client_secret: 'pi_test_000_secret',
        amount: 100,
        currency: 'mxn',
        status: 'requires_payment_method',
      });
      mockCreatePaymentRecord.mockRejectedValue(new Error('DB connection failed'));

      const result = await createPaymentIntent(100);

      expect(result.id).toBe('pi_test_000');
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Error al guardar pago en base de datos',
        expect.objectContaining({ paymentIntentId: 'pi_test_000' })
      );
    });
  });

  describe('retrievePaymentIntent', () => {
    it('debe recuperar un payment intent por id', async () => {
      mockStripeRetrieve.mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 100,
        currency: 'mxn',
      });

      const result = await retrievePaymentIntent('pi_test_123');

      expect(mockStripeRetrieve).toHaveBeenCalledWith('pi_test_123');
      expect(result.status).toBe('succeeded');
      expect(result.amount).toBe(100);
    });

    it('debe propagar errores al recuperar', async () => {
      mockStripeRetrieve.mockRejectedValue(new Error('PaymentIntent not found'));

      await expect(retrievePaymentIntent('pi_invalid')).rejects.toThrow('PaymentIntent not found');
    });
  });
});
