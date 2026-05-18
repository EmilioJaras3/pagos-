import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

vi.mock('./components', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
  CheckoutFlow: () => <div data-testid="checkout-flow">CheckoutFlow</div>,
  SuccessView: ({ paymentId }: { paymentId: string }) => (
    <div data-testid="success-view">{paymentId}</div>
  ),
  ToolsCatalog: ({ tools, onSelectTool }: { tools: { id: string; name: string; description: string; price: number }[]; onSelectTool: (tool: { id: string; name: string; description: string; price: number }) => void }) => (
    <div data-testid="tools-catalog">
      <span data-testid="tools-count">{tools.length}</span>
      <button
        data-testid="select-tool"
        onClick={() =>
          onSelectTool({ id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 })
        }
      >
        Comprar
      </button>
    </div>
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

vi.mock('./hooks/useCatalog', () => ({
  useCatalog: vi.fn(() => ({
    tools: [
      { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 },
      { id: 'tool-002', name: 'Taladro', description: 'Test', price: 125000 },
    ],
    loading: false,
    error: null,
  })),
}));

import { useCatalog } from './hooks/useCatalog';

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

  it('renders catalog on initial load', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    expect(screen.getByTestId('tools-catalog')).toBeInTheDocument();
    expect(screen.getByText(/Ingresar monto manual/)).toBeInTheDocument();
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
    expect(screen.getByTestId('tools-catalog')).toBeInTheDocument();
  });

  it('shows warning when Stripe publishable key is missing', () => {
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', '');

    render(<App />);
    expect(screen.getByText(/VITE_STRIPE_PUBLISHABLE_KEY/)).toBeInTheDocument();
  });

  it('switches to manual mode and back', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    const manualButton = screen.getByText(/Ingresar monto manual/);
    fireEvent.click(manualButton);
    expect(screen.getByText(/Monto \(MXN\)/)).toBeInTheDocument();

    const backButton = screen.getByText(/Volver al catálogo/);
    fireEvent.click(backButton);
    expect(screen.getByTestId('tools-catalog')).toBeInTheDocument();
  });

  it('muestra loading cuando useCatalog está cargando', () => {
    vi.mocked(useCatalog).mockReturnValueOnce({
      tools: [],
      loading: true,
      error: null,
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    expect(screen.getByText(/Cargando catálogo/)).toBeInTheDocument();
  });

  it('muestra error cuando useCatalog falla', () => {
    vi.mocked(useCatalog).mockReturnValueOnce({
      tools: [],
      loading: false,
      error: 'Network error',
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
  });

  it('selects a tool and goes to checkout', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    render(<App />);
    const selectButton = screen.getByTestId('select-tool');
    fireEvent.click(selectButton);
    expect(screen.getByTestId('checkout-flow')).toBeInTheDocument();
  });
});
