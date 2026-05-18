import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./useCart";
import type { Tool } from "@/types/tool";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockTool: Tool = { id: "1", name: "Taladro", price: 120, category: "Eléctrica" };
const mockTool2: Tool = { id: "2", name: "Sierra", price: 150, category: "Eléctrica" };

describe("useCart", () => {
  it("adds an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].tool.id).toBe("1");
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
  });

  it("merges quantities when adding a duplicate item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.addToCart(mockTool);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.cartCount).toBe(2);
  });

  it("removes an item (decrements quantity)", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.addToCart(mockTool);
      result.current.removeFromCart(mockTool);
    });

    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
  });

  it("removes item completely when quantity reaches 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.removeFromCart(mockTool);
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it("updates quantity directly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.updateQuantity("1", 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
    expect(result.current.cartCount).toBe(5);
  });

  it("removes item when updating quantity below 1", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.updateQuantity("1", 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.addToCart(mockTool2);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it("calculates total correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool); // 120
      result.current.addToCart(mockTool); // 120
      result.current.addToCart(mockTool2); // 150
    });

    expect(result.current.total).toBe(390);
  });

  it("exposes cartQuantities map", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockTool);
      result.current.addToCart(mockTool);
      result.current.addToCart(mockTool2);
    });

    expect(result.current.cartQuantities).toEqual({
      "1": 2,
      "2": 1,
    });
  });

  it("throws when used outside CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within a CartProvider"
    );
  });
});
