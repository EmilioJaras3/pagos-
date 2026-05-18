import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './useCart';
import type { Tool } from '../types/tool';

const mockTool: Tool = {
  id: 'tool-001',
  name: 'Destornillador',
  description: 'Test tool',
  price: 45000,
};

const mockTool2: Tool = {
  id: 'tool-002',
  name: 'Taladro',
  description: 'Test tool 2',
  price: 125000,
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('useCart', () => {
  it('addToCart adds item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].tool.id).toBe('tool-001');
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('addToCart merges duplicates (increments quantity)', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
      result.current.addItem(mockTool);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeFromCart removes item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
      result.current.addItem(mockTool2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem('tool-001');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].tool.id).toBe('tool-002');
  });

  it('updateQuantity changes quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
    });

    act(() => {
      result.current.updateQuantity('tool-001', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('updateQuantity removes item when quantity <= 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
    });

    act(() => {
      result.current.updateQuantity('tool-001', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart empties cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
      result.current.addItem(mockTool2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('totalItems calculates correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
      result.current.addItem(mockTool);
      result.current.addItem(mockTool2);
    });

    expect(result.current.totalItems).toBe(3);
  });

  it('totalAmount calculates correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockTool);
      result.current.addItem(mockTool2);
    });

    expect(result.current.totalAmount).toBe(170000);
  });

  it('throws error when used outside CartProvider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });
});
