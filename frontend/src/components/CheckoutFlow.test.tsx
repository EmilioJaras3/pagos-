import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CheckoutFlow } from './CheckoutFlow';

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({} as any)),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">PaymentElement</div>,
  useStripe: () => ({ confirmPayment: vi.fn() }),
  useElements: () => ({}),
}));

vi.mock('../hooks/usePaymentIntent', () => ({
  usePaymentIntent: vi.fn(),
}));

vi.mock('../api', () => ({
  getPaymentDetails: vi.fn(() => Promise.resolve({ id: 'pi_123', status: 'succeeded', amount: 150, currency: 'mxn' })),
  checkHealth: vi.fn(() => Promise.resolve({ ok: true, webhookConfigured: false })),
  api: { get: vi.fn(), post: vi.fn() },
}));

import { usePaymentIntent } from '../hooks/usePaymentIntent';

describe('CheckoutFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(usePaymentIntent).mockReturnValue({
      clientSecret: null,
      loading: true,
      error: null,
      paymentId: null,
      result: null,
      createPaymentIntent: vi.fn(),
      handleSuccess: vi.fn(),
      handleError: vi.fn(),
      reset: vi.fn(),
    });

    render(<CheckoutFlow amount={150} />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders success state', async () => {
    vi.mocked(usePaymentIntent).mockReturnValue({
      clientSecret: 'cs_123',
      loading: false,
      error: null,
      paymentId: 'pi_123',
      result: 'success',
      createPaymentIntent: vi.fn(),
      handleSuccess: vi.fn(),
      handleError: vi.fn(),
      reset: vi.fn(),
    });

    render(<CheckoutFlow amount={150} />);
    await waitFor(() => {
      expect(screen.getByText('Pago completado')).toBeInTheDocument();
    });
    expect(screen.getByText('pi_123')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(usePaymentIntent).mockReturnValue({
      clientSecret: null,
      loading: false,
      error: 'Payment failed',
      paymentId: null,
      result: 'error',
      createPaymentIntent: vi.fn(),
      handleSuccess: vi.fn(),
      handleError: vi.fn(),
      reset: vi.fn(),
    });

    render(<CheckoutFlow amount={150} />);
    expect(screen.getByText('Error en el pago')).toBeInTheDocument();
    expect(screen.getByText('Reintentar pago')).toBeInTheDocument();
  });

  it('renders payment form when clientSecret is available', () => {
    vi.mocked(usePaymentIntent).mockReturnValue({
      clientSecret: 'cs_123',
      loading: false,
      error: null,
      paymentId: null,
      result: null,
      createPaymentIntent: vi.fn(),
      handleSuccess: vi.fn(),
      handleError: vi.fn(),
      reset: vi.fn(),
    });

    render(<CheckoutFlow amount={150} />);
    expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    expect(screen.getByTestId('payment-element')).toBeInTheDocument();
  });
});
