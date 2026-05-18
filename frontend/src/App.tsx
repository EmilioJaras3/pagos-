import { useState, useEffect } from 'react';
import { checkHealth } from './api';
import { useCatalog } from './hooks/useCatalog';
import { ToolSelectionView } from './components/ToolSelectionView';
import { CheckoutView } from './components/CheckoutView';
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
  const { tools, loading, error } = useCatalog();

  useEffect(() => {
    checkHealth().then((health) => setBackendUp(health.ok));
  }, []);

  function handleSelectTool(tool: Tool) {
    setSelectedTool(tool);
  }

  function handleBack() {
    setSelectedTool(null);
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

  if (!selectedTool) {
    return (
      <ToolSelectionView
        tools={tools}
        selectedTool={selectedTool}
        onSelect={handleSelectTool}
        loading={loading}
        error={error}
        backendUp={backendUp}
      />
    );
  }

  return (
    <CheckoutView
      selectedTool={selectedTool}
      backendUp={backendUp}
      onBack={handleBack}
    />
  );
}
