import { useState, useEffect } from 'react';
import { Footer } from './components';
import { checkHealth } from './api';
import { useCatalog } from './hooks/useCatalog';
import { ToolSelectionView } from './components/ToolSelectionView';
import { CheckoutView } from './components/CheckoutView';
import type { Tool } from './types/tool';

function MissingKeyWarning() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-md text-center shadow-sm">
          <p className="text-red-600 font-semibold mb-2">Configuracion faltante</p>
          <p className="text-gray-500 text-sm">
            La variable <code className="bg-gray-100 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> no esta definida.
            Agregala en <code className="bg-gray-100 px-1 rounded">frontend/.env</code>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
