import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (message?: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success',
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message || 'Error al procesar el pago');
      onError(error.message);
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="bg-white w-full max-w-[480px] rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-700">credit_card</span>
          <h1 className="text-xl font-semibold text-gray-900">Pago</h1>
        </div>
        <span className="text-lg font-mono font-medium text-gray-900">
          ${(amount / 100).toFixed(2)} <span className="text-sm text-gray-400 font-sans">MXN</span>
        </span>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <PaymentElement />

          {errorMsg && (
            <p className="text-sm text-red-600 text-center bg-red-50 py-3 px-4 rounded-lg">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full h-[56px] bg-[#635bff] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#5851e5] transition-colors disabled:opacity-40 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            {loading ? 'Procesando...' : `Pagar $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">Procesado por Stripe</p>
      </div>
    </div>
  );
}
