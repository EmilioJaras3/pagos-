import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { ToolIcon } from './ToolIcon';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, totalAmount, clearCart } = useCart();

  if (!isOpen) return null;

  const formattedTotal = `$${(totalAmount / 100).toFixed(2)} MXN`;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Carrito ({totalItems})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Cerrar carrito">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-12 h-12" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(({ tool, quantity }) => (
                <div key={tool.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="p-2 bg-white rounded-md border border-gray-200">
                    <ToolIcon toolId={tool.id} className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-gray-900">{tool.name}</h3>
                      <button
                        onClick={() => removeItem(tool.id)}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Eliminar ${tool.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(tool.price / 100).toFixed(2)} MXN c/u
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(tool.id, quantity - 1)}
                        className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(tool.id, quantity + 1)}
                        className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="ml-auto text-sm font-semibold text-gray-900">
                        ${((tool.price * quantity) / 100).toFixed(2)} MXN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2.5 rounded-md text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Vaciar
              </button>
              <button
                onClick={() => { onClose(); onCheckout(); }}
                className="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-gray-900 hover:bg-orange-600 transition-colors"
              >
                Pagar ahora
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
