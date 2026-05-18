import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { CartProvider } from "./hooks/useCart";

describe("App", () => {
  it("renders the catalog view by default", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Taladro")).toBeInTheDocument();
  });

  it("adds an item to the cart when clicking Agregar", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    const addButton = screen.getAllByText("Agregar")[0];
    fireEvent.click(addButton);

    expect(screen.getByLabelText("Abrir carrito")).toHaveTextContent("1");
  });

  it("opens the cart drawer when clicking the cart button", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    const addButton = screen.getAllByText("Agregar")[0];
    fireEvent.click(addButton);

    const cartButton = screen.getByLabelText("Abrir carrito");
    fireEvent.click(cartButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tu Carrito")).toBeInTheDocument();
  });

  it("shows checkout view after clicking Pagar", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    const addButton = screen.getAllByText("Agregar")[0];
    fireEvent.click(addButton);

    const cartButton = screen.getByLabelText("Abrir carrito");
    fireEvent.click(cartButton);

    const checkoutButton = screen.getByText("Pagar");
    fireEvent.click(checkoutButton);

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Confirmar Pago")).toBeInTheDocument();
  });

  it("returns to catalog from checkout", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    const addButton = screen.getAllByText("Agregar")[0];
    fireEvent.click(addButton);

    fireEvent.click(screen.getByLabelText("Abrir carrito"));
    fireEvent.click(screen.getByText("Pagar"));

    const backButton = screen.getByText("Volver al catálogo");
    fireEvent.click(backButton);

    expect(screen.getByText("Catálogo")).toBeInTheDocument();
  });

  it("calculates total correctly in sticky bar", () => {
    render(
      <CartProvider>
        <App />
      </CartProvider>
    );

    const addButtons = screen.getAllByText("Agregar");
    fireEvent.click(addButtons[0]); // Taladro $120
    fireEvent.click(addButtons[1]); // Destornillador $25

    expect(screen.getAllByText("$145.00").length).toBeGreaterThan(0);
  });
});
