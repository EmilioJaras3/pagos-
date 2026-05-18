import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckoutView } from './CheckoutView';

vi.mock('./CheckoutFlow', () => ({
  CheckoutFlow: ({ amount, onChangeAmount, toolName }: { amount: number; onChangeAmount?: () => void; toolName?: string }) => (
    <div data-testid="checkout-flow">
      <span data-testid="checkout-amount">{amount}</span>
      {toolName && <span data-testid="checkout-tool">{toolName}</span>}
      {onChangeAmount && <button data-testid="checkout-back" onClick={onChangeAmount}>Back</button>}
    </div>
  ),
}));

vi.mock('./SuccessView', () => ({
  SuccessView: ({ paymentId }: { paymentId: string }) => (
    <div data-testid="success-view">{paymentId}</div>
  ),
}));

vi.mock('./ConnectionBanner', () => ({
  ConnectionBanner: ({ visible }: { visible: boolean }) =>
    visible ? <div data-testid="connection-banner">Sin conexion</div> : null,
}));

vi.mock('./Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

describe('CheckoutView', () => {
  it('renderiza CheckoutFlow con datos de herramienta', () => {
    const tool = { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 };
    render(
      <CheckoutView
        selectedTool={tool}
        backendUp={true}
        onBack={vi.fn()}
      />
    );

    expect(screen.getByTestId('checkout-flow')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-amount')).toHaveTextContent('45000');
    expect(screen.getByTestId('checkout-tool')).toHaveTextContent('Destornillador');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza SuccessView cuando redirectPaymentId está presente', () => {
    render(
      <CheckoutView
        selectedTool={null}
        backendUp={true}
        redirectPaymentId="pi_123"
      />
    );

    expect(screen.getByTestId('success-view')).toHaveTextContent('pi_123');
    expect(screen.queryByTestId('checkout-flow')).not.toBeInTheDocument();
  });

  it('muestra banner de conexion cuando backendUp=false', () => {
    const tool = { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 };
    render(
      <CheckoutView
        selectedTool={tool}
        backendUp={false}
        onBack={vi.fn()}
      />
    );

    expect(screen.getByTestId('connection-banner')).toBeInTheDocument();
  });

  it('llama onBack al hacer click en volver', () => {
    const tool = { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 };
    const handleBack = vi.fn();
    render(
      <CheckoutView
        selectedTool={tool}
        backendUp={true}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByTestId('checkout-back');
    backButton.click();
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
