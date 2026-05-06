import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./components', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
  CheckoutFlow: () => <div data-testid="checkout-flow">CheckoutFlow</div>,
  SuccessView: ({ paymentId }: { paymentId: string }) => (
    <div data-testid="success-view">{paymentId}</div>
  ),
}));

vi.mock('./lib/utils', () => ({
  getAmountFromURL: vi.fn(() => 150),
}));

vi.mock('./api', () => ({
  checkHealth: vi.fn(() => Promise.resolve({ ok: true, webhookConfigured: false })),
  getPaymentDetails: vi.fn(),
  api: { get: vi.fn(), post: vi.fn() },
}));

describe('App', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test_valid');
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('renders SuccessView on 3DS redirect', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '?payment_intent=pi_123&redirect_status=succeeded',
      },
    });

    render(<App />);
    expect(screen.getByTestId('success-view')).toHaveTextContent('pi_123');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders normal checkout flow without redirect params', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    expect(screen.getByText(/Monto/)).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders normal flow when redirect_status is not succeeded', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '?payment_intent=pi_123&redirect_status=requires_action',
      },
    });

    render(<App />);
    expect(screen.getByText(/Monto/)).toBeInTheDocument();
  });

  it('shows warning when Stripe publishable key is missing', () => {
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', '');

    render(<App />);
    expect(screen.getByText(/VITE_STRIPE_PUBLISHABLE_KEY/)).toBeInTheDocument();
  });
});
