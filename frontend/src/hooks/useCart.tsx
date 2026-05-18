import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Tool } from '../types/tool';

export interface CartItem {
  tool: Tool;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (tool: Tool) => void;
  removeItem: (toolId: string) => void;
  updateQuantity: (toolId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((tool: Tool) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.tool.id === tool.id);
      if (existing) {
        return prev.map((item) =>
          item.tool.id === tool.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { tool, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((toolId: string) => {
    setItems((prev) => prev.filter((item) => item.tool.id !== toolId));
  }, []);

  const updateQuantity = useCallback((toolId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.tool.id !== toolId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.tool.id === toolId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.tool.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
