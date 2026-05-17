import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePaymentIntent } from '../hooks/usePaymentIntent';
import { PaymentForm } from './PaymentForm';
import { SuccessView } from './SuccessView';
import { ErrorView } from './ErrorView';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface CheckoutFlowProps {
  amount: number;
  onChangeAmount?: () => void;
  toolId?: string;
  toolName?: string;
}

export function CheckoutFlow({ amount, onChangeAmount, toolId, toolName }: CheckoutFlowProps) {
  const {
    clientSecret,
    loading,
    paymentId,
    result,
    createPaymentIntent,
    handleSuccess,
    handleError,
    reset,
  } = usePaymentIntent(amount, toolId);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  if (result === 'success' && paymentId) {
    return <SuccessView paymentId={paymentId} />;
  }

  if (result === 'error') {
    return <ErrorView onRetry={() => { reset(); createPaymentIntent(); }} />;
  }

  if (!clientSecret || loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#635bff',
        colorBackground: '#ffffff',
        colorText: '#1b1b24',
        colorDanger: '#ba1a1a',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="flex flex-col gap-3">
      {onChangeAmount && (
        <button
          onClick={onChangeAmount}
          className="self-start text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Cambiar monto
        </button>
      )}
      {toolName && (
        <div className="text-sm text-gray-600 font-medium">
          {toolName}
        </div>
      )}
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm amount={amount} onSuccess={handleSuccess} onError={handleError} />
      </Elements>
    </div>
  );
}
