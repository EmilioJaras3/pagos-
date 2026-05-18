import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/types/tool";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (toolId: string) => void;
  onUpdateQuantity: (toolId: string, quantity: number) => void;
  total: number;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  total,
  onCheckout,
}: CartDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Tu Carrito</h2>
            <Badge variant="secondary" className="ml-2 text-xs">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">El carrito está vacío.</p>
              <p className="text-sm text-muted-foreground/60">
                Agregá herramientas desde el catálogo.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <li
                  key={item.tool.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-background p-4"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {item.tool.name}
                    </span>
                    <span className="text-sm tabular-nums text-primary">
                      ${item.tool.price.toFixed(2)} c/u
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        item.quantity > 1
                          ? onUpdateQuantity(item.tool.id, item.quantity - 1)
                          : onRemoveItem(item.tool.id)
                      }
                      className="h-7 w-7 border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="flex h-7 w-8 items-center justify-center text-sm font-semibold tabular-nums text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => onUpdateQuantity(item.tool.id, item.quantity + 1)}
                      className="h-7 w-7 border-border bg-card text-foreground hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between pb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold tabular-nums tracking-tight text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={onCheckout}
              className="w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Pagar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
