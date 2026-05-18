import { useState } from "react";
import { ArrowLeft, CreditCard, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { ToolsCatalog } from "@/components/ToolsCatalog";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import type { Tool } from "@/types/tool";

const TOOLS: Tool[] = [
  { id: "1", name: "Taladro", price: 120.0, category: "Eléctrica" },
  { id: "2", name: "Destornillador", price: 25.0, category: "Manual" },
  { id: "3", name: "Llaves", price: 45.0, category: "Manual" },
  { id: "4", name: "Multímetro", price: 60.0, category: "Medición" },
  { id: "5", name: "Sierra", price: 150.0, category: "Eléctrica" },
];

export default function App() {
  const {
    cartItems,
    cartCount,
    total,
    cartQuantities,
    addToCart,
    removeFromCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<"catalog" | "checkout">("catalog");

  const goToCheckout = () => {
    setIsDrawerOpen(false);
    setView("checkout");
  };

  const goBack = () => {
    setView("catalog");
  };

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      {view === "catalog" && (
        <>
          <Header
            cartCount={cartCount}
            onCartClick={() => setIsDrawerOpen(true)}
          />

          <main className="flex-1">
            <ToolsCatalog
              tools={TOOLS}
              cartQuantities={cartQuantities}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </main>

          {/* Sticky bottom bar with total */}
          {cartCount > 0 && (
            <div className="sticky bottom-0 z-40 w-full border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-xl font-bold tabular-nums text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => setIsDrawerOpen(true)}
                  className="gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Ver carrito
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-bold text-primary">
                    {cartCount}
                  </span>
                </Button>
              </div>
            </div>
          )}

          <CartDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            cartItems={cartItems}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            total={total}
            onCheckout={goToCheckout}
          />
        </>
      )}

      {view === "checkout" && (
        <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </button>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Checkout
          </h2>
          <p className="mt-1 text-muted-foreground">
            Resumen de tu compra en Vulturus.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {cartItems.map((item) => (
              <div
                key={item.tool.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{item.tool.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.quantity} x ${item.tool.price.toFixed(2)}
                  </span>
                </div>
                <span className="font-semibold tabular-nums text-foreground">
                  ${(item.tool.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border py-4">
            <span className="text-muted-foreground">Total a pagar</span>
            <span className="text-2xl font-bold tabular-nums text-primary">
              ${total.toFixed(2)}
            </span>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => alert(`Procesando pago de $${total.toFixed(2)}...`)}
            className="mt-2 w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <CreditCard className="h-4 w-4" />
            Confirmar Pago
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3 w-3 text-primary" />
            Pagos seguros procesados por Vulturus
          </div>
        </div>
      )}
    </div>
  );
}
