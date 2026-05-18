import { useState, useEffect } from 'react';
import { checkHealth } from './api';
import { useCatalog } from './hooks/useCatalog';
import { useCart } from './hooks/useCart';
import { ToolSelectionView } from './components/ToolSelectionView';
import { CheckoutView } from './components/CheckoutView';
import { CartDrawer } from './components/CartDrawer';
import { MissingKeyWarning } from './components/MissingKeyWarning';
import type { Tool } from './types/tool';

export default function App() {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return <MissingKeyWarning />;
  }

  const params = new URLSearchParams(window.location.search);
  const redirectPaymentId = params.get('payment_intent');
  const redirectStatus = params.get('redirect_status');

  const [backendUp, setBackendUp] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const { tools, loading, error } = useCatalog();
  const { items: cartItems, addItem, totalItems } = useCart();

  useEffect(() => {
    checkHealth().then((health) => setBackendUp(health.ok));
  }, []);

  function handleSelectTool(tool: Tool) {
    setSelectedTool(tool);
    setIsCartCheckout(false);
  }

  function handleAddToCart(tool: Tool) {
    addItem(tool);
    setIsCartOpen(true);
  }

  function handleBack() {
    setSelectedTool(null);
    setIsCartCheckout(false);
  }

  function handleCartCheckout() {
    setIsCartCheckout(true);
  }

  if (redirectPaymentId && redirectStatus === 'succeeded') {
    return (
      <CheckoutView
        selectedTool={null}
        backendUp={backendUp}
        onBack={handleBack}
        redirectPaymentId={redirectPaymentId}
      />
    );
  }

  if (selectedTool || isCartCheckout) {
    return (
      <CheckoutView
        selectedTool={selectedTool}
        backendUp={backendUp}
        onBack={handleBack}
        cartItems={isCartCheckout ? cartItems : []}
      />
    );
  }

  return (
    <>
      <ToolSelectionView
        tools={tools}
        selectedTool={selectedTool}
        onSelect={handleSelectTool}
        onAddToCart={handleAddToCart}
        loading={loading}
        error={error}
        backendUp={backendUp}
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCartCheckout}
      />
    </>
  );
}
