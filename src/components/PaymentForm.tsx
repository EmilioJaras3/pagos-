import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeError, Stripe, StripeElements } from '@stripe/stripe-js';

export interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (message?: string) => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Función con reintentos exponenciales para errores de red o servidor
  async function confirmPaymentWithRetry(
    stripeInstance: Stripe,
    elementsInstance: StripeElements
  ): Promise<{ success: true } | { success: false; error: StripeError }> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 1) {
        setRetryCount(attempt - 1);
      }

      try {
        const { error } = await stripeInstance.confirmPayment({
          elements: elementsInstance,
          confirmParams: {
            return_url: import.meta.env.VITE_STRIPE_RETURN_URL || window.location.origin + '/success',
          },
          redirect: 'if_required',
        });

        if (!error) {
          setRetryCount(0);
          return { success: true };
        }

        // No reintentar errores del cliente (tarjeta o validación)
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setRetryCount(0);
          return { success: false, error };
        }

        // Reintentar en errores transitorios de red/servidor
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
          continue;
        }

        setRetryCount(0);
        return { success: false, error };
      } catch (err) {
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
          continue;
        }
        throw err;
      }
    }

    // Fallback para satisfacer TypeScript; nunca debería alcanzarse
    throw new Error('Bucle de reintentos finalizado inesperadamente');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);
    setRetryCount(0);

    try {
      const result = await confirmPaymentWithRetry(stripe, elements);

      if (!result.success) {
        setErrorMsg(result.error.message || 'Error al procesar el pago');
        onError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado al procesar el pago';
      setErrorMsg(message);
      onError(message);
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

          {retryCount > 0 && (
            <p className="text-sm text-yellow-600 text-center">
              Reintentando conexión... ({retryCount}/{MAX_RETRIES})
            </p>
          )}

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
