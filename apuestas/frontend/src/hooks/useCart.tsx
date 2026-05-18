import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";
import type { CartItem, Tool } from "@/types/tool";

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  total: number;
  cartQuantities: Record<string, number>;
  addToCart: (tool: Tool) => void;
  removeFromCart: (tool: Tool) => void;
  removeItem: (toolId: string) => void;
  updateQuantity: (toolId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.tool.price * item.quantity, 0),
    [cartItems]
  );

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.tool.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  const addToCart = useCallback((tool: Tool) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.tool.id === tool.id);
      if (existing) {
        return prev.map((i) =>
          i.tool.id === tool.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { tool, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((tool: Tool) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.tool.id === tool.id);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((i) => i.tool.id !== tool.id);
      }
      return prev.map((i) =>
        i.tool.id === tool.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const removeItem = useCallback((toolId: string) => {
    setCartItems((prev) => prev.filter((i) => i.tool.id !== toolId));
  }, []);

  const updateQuantity = useCallback((toolId: string, quantity: number) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((i) => i.tool.id !== toolId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.tool.id === toolId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        total,
        cartQuantities,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
