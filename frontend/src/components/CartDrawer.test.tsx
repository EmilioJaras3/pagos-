import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import * as useCartModule from '../hooks/useCart';
import type { CartItem } from '../hooks/useCart';

const mockItems: CartItem[] = [
  {
    tool: { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 },
    quantity: 2,
  },
  {
    tool: { id: 'tool-002', name: 'Taladro', description: 'Test', price: 125000 },
    quantity: 1,
  },
];

const mockHandlers = {
  onClose: vi.fn(),
  onCheckout: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
};

function mockUseCart(items: CartItem[] = mockItems) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.tool.price * item.quantity, 0);

  vi.spyOn(useCartModule, 'useCart').mockReturnValue({
    items,
    addItem: vi.fn(),
    removeItem: mockHandlers.removeItem,
    updateQuantity: mockHandlers.updateQuantity,
    clearCart: mockHandlers.clearCart,
    totalItems,
    totalAmount,
  });
}

describe('CartDrawer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders cart items with quantities', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    expect(screen.getByText('Destornillador')).toBeInTheDocument();
    expect(screen.getByText('Taladro')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Carrito (3)')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    mockUseCart([]);
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.queryByText('Pagar ahora')).not.toBeInTheDocument();
  });

  it('calls onCheckout when clicking checkout', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    fireEvent.click(screen.getByText('Pagar ahora'));
    expect(mockHandlers.onCheckout).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateQuantity when clicking +', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    const plusButtons = screen.getAllByLabelText('Aumentar cantidad');
    fireEvent.click(plusButtons[0]);
    expect(mockHandlers.updateQuantity).toHaveBeenCalledWith('tool-001', 3);
  });

  it('calls onUpdateQuantity when clicking -', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    const minusButtons = screen.getAllByLabelText('Disminuir cantidad');
    fireEvent.click(minusButtons[0]);
    expect(mockHandlers.updateQuantity).toHaveBeenCalledWith('tool-001', 1);
  });

  it('calls onRemoveItem when clicking remove', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    const removeButtons = screen.getAllByLabelText(/Eliminar/);
    fireEvent.click(removeButtons[0]);
    expect(mockHandlers.removeItem).toHaveBeenCalledWith('tool-001');
  });

  it('calls onClose when clicking close button', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    fireEvent.click(screen.getByLabelText('Cerrar carrito'));
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay', () => {
    mockUseCart();
    render(<CartDrawer isOpen onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    const overlay = screen.getByLabelText('Cerrar carrito').closest('div')?.parentElement?.previousSibling;
    if (overlay && overlay instanceof HTMLElement) {
      fireEvent.click(overlay);
      expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not render when isOpen is false', () => {
    mockUseCart();
    const { container } = render(<CartDrawer isOpen={false} onClose={mockHandlers.onClose} onCheckout={mockHandlers.onCheckout} />);

    expect(container.firstChild).toBeNull();
  });
});
