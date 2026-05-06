import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function getAmountFromURL(): number {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('amount');
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (parsed > 0 && parsed <= 99999999) return parsed;
  }
  return 100;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const redirectPaymentId = params.get('payment_intent');
  const redirectStatus = params.get('redirect_status');

  if (redirectPaymentId && redirectStatus === 'succeeded') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <SuccessView paymentId={redirectPaymentId} amount={getAmountFromURL()} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-6">
        <CheckoutFlow />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-1/3 after:bg-[#635bff]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
        <div className="text-lg font-bold tracking-tighter text-gray-900 uppercase">
          Vulturus
        </div>
        <span className="material-symbols-outlined text-gray-400">lock</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full opacity-80 pb-8 text-center">
      <div className="flex gap-4 justify-center mb-2">
        <a className="text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600" href="#">Privacy</a>
        <a className="text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600" href="#">Terms</a>
        <a className="text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600" href="#">Support</a>
      </div>
      <p className="text-[11px] uppercase tracking-widest text-gray-400">2024 Vulturus. Secure encrypted transaction.</p>
    </footer>
  );
}

function CheckoutFlow() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [amount] = useState(getAmountFromURL);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const { data } = await api.post('/api/payments/create', {
        amount,
        currency: 'mxn',
      });
      setClientSecret(data.clientSecret);
      setPaymentId(data.paymentIntentId);
    } catch (err) {
      setResult('error');
    }
  };

  const handleSuccess = () => setResult('success');
  const handleError = () => setResult('error');

  if (result === 'success' && paymentId) {
    return <SuccessView paymentId={paymentId} amount={amount} />;
  }

  if (result === 'error') {
    return <ErrorView onRetry={() => { setResult(null); createPaymentIntent(); }} />;
  }

  if (!clientSecret) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
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
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm amount={amount} onSuccess={handleSuccess} onError={handleError} />
    </Elements>
  );
}

function PaymentForm({ amount, onSuccess, onError }: { amount: number; onSuccess: () => void; onError: () => void }) {
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
      onError();
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="bg-white w-full max-w-[480px] rounded-lg border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <span className="material-symbols-outlined text-gray-700">credit_card</span>
        <h1 className="text-2xl font-semibold text-gray-900">Pasarela de Pagos</h1>
      </div>

      <div className="p-6 flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center text-center bg-[#f5f2ff] rounded-lg p-6 border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Monto a pagar</p>
          <p className="text-[28px] font-medium text-gray-900 font-mono">${amount.toFixed(2)} MXN</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <PaymentElement />

          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full h-[56px] bg-[#635bff] text-white rounded font-medium flex items-center justify-center gap-2 hover:bg-[#5851e5] transition-colors disabled:opacity-50 shadow-[0px_2px_4px_rgba(0,0,0,0.1)]"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            {loading ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="bg-[#f5f2ff] p-4 border-t border-gray-100 flex flex-col items-center gap-1">
        <p className="text-sm text-gray-500">Pagos seguros con Stripe</p>
        <p className="text-sm text-gray-500">Encriptacion SSL</p>
      </div>
    </div>
  );
}

function SuccessView({ paymentId, amount }: { paymentId: string; amount: number }) {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center text-center">
      <div className="mb-6">
        <span className="material-symbols-outlined text-[64px] text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Pago completado</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto</span>
          <span className="text-[28px] font-medium text-gray-900 font-mono">${amount.toFixed(2)} MXN</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</span>
          <span className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-green-100 text-green-600">Completado</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID de Transaccion</span>
          <span className="text-sm font-mono text-gray-500">{paymentId}</span>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 w-full py-4 px-6 bg-white border border-gray-300 rounded text-xs font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center text-center">
      <div className="mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-red-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          error
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Error en el pago</h1>
      <p className="text-gray-500 mb-8">El pago no pudo procesarse. Intenta de nuevo.</p>
      <div className="w-full flex flex-col gap-4">
        <button
          onClick={onRetry}
          className="w-full bg-[#635bff] text-white py-4 px-6 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#5851e5] transition-colors active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Reintentar pago
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
