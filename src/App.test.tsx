import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { CartProvider } from './hooks/useCart';

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

vi.mock('./components/ToolSelectionView', () => ({
  ToolSelectionView: ({ tools, onSelect, loading, error, backendUp }: any) => (
    <div data-testid="tool-selection-view">
      <span data-testid="tools-count">{tools.length}</span>
      {loading && <div data-testid="loading">Cargando catálogo...</div>}
      {error && <div data-testid="error">Error: {error}</div>}
      {!loading && !error && (
        <button
          data-testid="select-tool"
          onClick={() =>
            onSelect({ id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 })
          }
        >
          Comprar
        </button>
      )}
      {!backendUp && <div data-testid="backend-down">Sin conexion</div>}
      <div data-testid="footer">Footer</div>
    </div>
  ),
}));

vi.mock('./components/CheckoutView', () => ({
  CheckoutView: ({ selectedTool, backendUp, onBack, redirectPaymentId }: any) => (
    <div data-testid="checkout-view">
      {redirectPaymentId && <div data-testid="success-view">{redirectPaymentId}</div>}
      {selectedTool && <div data-testid="checkout-tool">{selectedTool.name}</div>}
      {!backendUp && <div data-testid="backend-down">Sin conexion</div>}
      <button data-testid="checkout-back" onClick={onBack}>Volver</button>
      <div data-testid="footer">Footer</div>
    </div>
  ),
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

function renderWithCartProvider(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

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

    renderWithCartProvider(<App />);
    expect(screen.getByTestId('success-view')).toHaveTextContent('pi_123');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders ToolSelectionView on initial load', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    renderWithCartProvider(<App />);
    expect(screen.getByTestId('tool-selection-view')).toBeInTheDocument();
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

    renderWithCartProvider(<App />);
    expect(screen.getByTestId('tool-selection-view')).toBeInTheDocument();
  });

  it('shows warning when Stripe publishable key is missing', () => {
    vi.stubEnv('VITE_STRIPE_PUBLISHABLE_KEY', '');

    renderWithCartProvider(<App />);
    expect(screen.getByText(/VITE_STRIPE_PUBLISHABLE_KEY/)).toBeInTheDocument();
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

    renderWithCartProvider(<App />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
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

    renderWithCartProvider(<App />);
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('selects a tool and goes to checkout', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    renderWithCartProvider(<App />);
    const selectButton = screen.getByTestId('select-tool');
    fireEvent.click(selectButton);
    expect(screen.getByTestId('checkout-view')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-tool')).toHaveTextContent('Destornillador');
  });

  it('vuelve al catálogo desde checkout', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: '',
      },
    });

    renderWithCartProvider(<App />);
    fireEvent.click(screen.getByTestId('select-tool'));
    expect(screen.getByTestId('checkout-view')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('checkout-back'));
    expect(screen.getByTestId('tool-selection-view')).toBeInTheDocument();
  });
});
