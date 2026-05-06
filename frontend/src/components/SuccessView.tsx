import { useEffect, useState } from 'react';
import { getPaymentDetails, type PaymentDetails } from '../api';

export interface SuccessViewProps {
  paymentId: string;
}

export function SuccessView({ paymentId }: SuccessViewProps) {
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPaymentDetails(paymentId)
      .then((data) => { if (!cancelled) { setDetails(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [paymentId]);

  if (loading) {
    return (
      <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
        <p className="text-gray-500">Verificando pago...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-[48px] text-yellow-500 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Pago registrado</h1>
        <p className="text-sm text-gray-500 mb-6">No se pudieron obtener los detalles. Si el cargo aparece en tu banco, el pago fue exitoso.</p>
        <div className="w-full border-t border-gray-100 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID de Transaccion</span>
          <p className="text-sm font-mono text-gray-500 mt-1">{paymentId}</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-6 w-full py-4 px-6 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Volver al inicio
        </button>
      </div>
    );
  }

  const amountInPesos = details.amount / 100;
  const statusLabel = details.status === 'succeeded' ? 'Completado' : details.status;
  const statusColor = details.status === 'succeeded' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600';

  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
      <div className="mb-6">
        <span className="material-symbols-outlined text-[64px] text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Pago completado</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto</span>
          <span className="text-[28px] font-medium text-gray-900 font-mono">
            ${amountInPesos.toFixed(2)} <span className="text-sm text-gray-400 font-sans">{details.currency.toUpperCase()}</span>
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</span>
          <span className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID de Transaccion</span>
          <span className="text-sm font-mono text-gray-500">{paymentId}</span>
        </div>
      </div>
      <button onClick={() => window.location.reload()} className="mt-8 w-full py-4 px-6 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        Volver al inicio
      </button>
    </div>
  );
}
