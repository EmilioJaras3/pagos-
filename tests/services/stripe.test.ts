const mockStripeCreate = jest.fn();
const mockStripeRetrieve = jest.fn();

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
      apiVersion: '2025-04-30.basil',
    },
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
        automatic_payment_methods: { enabled: true },
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
        automatic_payment_methods: { enabled: true },
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
