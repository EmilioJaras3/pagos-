import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "./CartDrawer";
import type { CartItem } from "@/types/tool";

const mockItems: CartItem[] = [
  { tool: { id: "1", name: "Taladro", price: 120, category: "Eléctrica" }, quantity: 2 },
  { tool: { id: "2", name: "Sierra", price: 150, category: "Eléctrica" }, quantity: 1 },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  cartItems: mockItems,
  onRemoveItem: vi.fn(),
  onUpdateQuantity: vi.fn(),
  total: 390,
  onCheckout: vi.fn(),
};

describe("CartDrawer", () => {
  it("renders cart items", () => {
    render(<CartDrawer {...defaultProps} />);

    expect(screen.getByText("Taladro")).toBeInTheDocument();
    expect(screen.getByText("Sierra")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("$390.00")).toBeInTheDocument();
  });

  it("shows item count in badge", () => {
    render(<CartDrawer {...defaultProps} />);

    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  it("shows empty state when cart is empty", () => {
    render(<CartDrawer {...defaultProps} cartItems={[]} total={0} />);

    expect(screen.getByText("El carrito está vacío.")).toBeInTheDocument();
    expect(screen.getByText("Agregá herramientas desde el catálogo.")).toBeInTheDocument();
  });

  it("calls onClose when clicking the overlay", () => {
    const onClose = vi.fn();
    render(<CartDrawer {...defaultProps} onClose={onClose} />);

    // The overlay is the element with aria-hidden="true" that sits behind the drawer
    const overlay = document.querySelector('[aria-hidden="true"]');
    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the close button", () => {
    const onClose = vi.fn();
    render(<CartDrawer {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByLabelText("Cerrar carrito");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onCheckout when clicking Pagar", () => {
    const onCheckout = vi.fn();
    render(<CartDrawer {...defaultProps} onCheckout={onCheckout} />);

    const payButton = screen.getByText("Pagar");
    fireEvent.click(payButton);

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it("calls onUpdateQuantity when clicking plus button", () => {
    const onUpdateQuantity = vi.fn();
    render(<CartDrawer {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);

    const plusButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg")?.getAttribute("data-icon") === "plus" ||
               btn.innerHTML.includes("Plus")
    );
    // The plus buttons are the ones with onClick that calls onUpdateQuantity with +1
    // Let's find by querying all buttons and clicking the one after the quantity
    const quantityElements = screen.getAllByText(/^[0-9]+$/);
    const firstQuantity = quantityElements[0];
    const parent = firstQuantity.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll("button");
      const plusButton = buttons[buttons.length - 1];
      fireEvent.click(plusButton);
    }

    expect(onUpdateQuantity).toHaveBeenCalledWith("1", 3);
  });

  it("calls onRemoveItem when clicking minus at quantity 1", () => {
    const onRemoveItem = vi.fn();
    const onUpdateQuantity = vi.fn();
    const itemsWithOne: CartItem[] = [
      { tool: { id: "1", name: "Taladro", price: 120, category: "Eléctrica" }, quantity: 1 },
    ];

    render(
      <CartDrawer
        {...defaultProps}
        cartItems={itemsWithOne}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
      />
    );

    const quantityElements = screen.getAllByText(/^[0-9]+$/);
    const firstQuantity = quantityElements[0];
    const parent = firstQuantity.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll("button");
      const minusButton = buttons[0];
      fireEvent.click(minusButton);
    }

    expect(onRemoveItem).toHaveBeenCalledWith("1");
    expect(onUpdateQuantity).not.toHaveBeenCalled();
  });

  it("calls onUpdateQuantity when clicking minus at quantity > 1", () => {
    const onRemoveItem = vi.fn();
    const onUpdateQuantity = vi.fn();

    render(
      <CartDrawer
        {...defaultProps}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
      />
    );

    const quantityElements = screen.getAllByText(/^[0-9]+$/);
    const firstQuantity = quantityElements[0]; // 2
    const parent = firstQuantity.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll("button");
      const minusButton = buttons[0];
      fireEvent.click(minusButton);
    }

    expect(onUpdateQuantity).toHaveBeenCalledWith("1", 1);
    expect(onRemoveItem).not.toHaveBeenCalled();
  });

  it("does not render footer when cart is empty", () => {
    render(<CartDrawer {...defaultProps} cartItems={[]} total={0} />);

    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText("Pagar")).not.toBeInTheDocument();
  });

  it("has correct aria attributes", () => {
    render(<CartDrawer {...defaultProps} />);

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Carrito de compras");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });
});
