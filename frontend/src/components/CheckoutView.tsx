import type { Tool } from '../types/tool';
import { ConnectionBanner } from './ConnectionBanner';
import { CheckoutFlow } from './CheckoutFlow';
import { SuccessView } from './SuccessView';
import { Footer } from './Footer';

export interface CartItem {
  tool: Tool;
  quantity: number;
}

export interface CheckoutViewProps {
  selectedTool: Tool | null;
  backendUp: boolean;
  onBack: () => void;
  redirectPaymentId?: string | null;
  cartItems?: CartItem[];
}

export function CheckoutView({
  selectedTool,
  backendUp,
  onBack,
  redirectPaymentId,
  cartItems = [],
}: CheckoutViewProps) {
  if (redirectPaymentId) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <ConnectionBanner visible={!backendUp} />
        <main className="flex-grow flex items-center justify-center p-4">
          <SuccessView paymentId={redirectPaymentId} />
        </main>
        <Footer />
      </div>
    );
  }

  const isCartCheckout = cartItems.length > 0;
  const totalAmount = isCartCheckout
    ? cartItems.reduce((sum, item) => sum + item.tool.price * item.quantity, 0)
    : (selectedTool?.price ?? 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <ConnectionBanner visible={!backendUp} />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-6">
        <div className="bg-white w-full max-w-[420px] rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
          {isCartCheckout && (
            <div className="text-sm text-gray-600 font-medium border-b border-gray-100 pb-4">
              <p className="font-semibold mb-2">Resumen del carrito:</p>
              {cartItems.map((item) => (
                <div key={item.tool.id} className="flex justify-between text-xs py-1">
                  <span>{item.tool.name} x{item.quantity}</span>
                  <span>${((item.tool.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${(totalAmount / 100).toFixed(2)} MXN</span>
              </div>
            </div>
          )}
          <CheckoutFlow
            amount={totalAmount}
            onChangeAmount={onBack}
            toolId={selectedTool?.id}
            toolName={selectedTool?.name}
            cartItems={cartItems}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
