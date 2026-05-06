import { useState, useEffect } from 'react';
import { Footer, CheckoutFlow, SuccessView } from './components';
import { getAmountFromURL } from './lib/utils';
import { checkHealth } from './api';

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

const COMMON_AMOUNTS = [1000, 2000, 5000, 10000, 50000];

export default function App() {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return <MissingKeyWarning />;
  }

  const params = new URLSearchParams(window.location.search);
  const redirectPaymentId = params.get('payment_intent');
  const redirectStatus = params.get('redirect_status');

  const initialAmount = getAmountFromURL();
  const [amount, setAmount] = useState(initialAmount > 0 ? initialAmount : 0);
  const [inputValue, setInputValue] = useState(
    initialAmount > 0 ? String(initialAmount / 100) : ''
  );
  const [confirmed, setConfirmed] = useState(false);
  const [backendUp, setBackendUp] = useState(true);

  useEffect(() => {
    checkHealth().then((health) => setBackendUp(health.ok));
  }, []);

  function handleInputChange(raw: string) {
    setInputValue(raw);
    const cleaned = raw.replace(',', '.');
    const pesos = parseFloat(cleaned);
    if (!isNaN(pesos) && pesos > 0) {
      setAmount(Math.round(pesos * 100));
    } else {
      setAmount(0);
    }
  }

  function handleConfirm() {
    if (amount >= 1000) setConfirmed(true);
  }

  function handleChangeAmount() {
    setConfirmed(false);
    setAmount(0);
    setInputValue('');
  }

  if (redirectPaymentId && redirectStatus === 'succeeded') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        {!backendUp && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
            <p className="text-xs text-yellow-700">Sin conexion al servidor · Datos pueden estar desactualizados</p>
          </div>
        )}
        <main className="flex-grow flex items-center justify-center p-4">
          <SuccessView paymentId={redirectPaymentId} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!confirmed) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        {!backendUp && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
            <p className="text-xs text-yellow-700">Sin conexion al servidor · El pago no esta disponible</p>
          </div>
        )}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[420px] rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Nuevo pago</h1>
              <p className="text-sm text-gray-500">Ingresa el monto en pesos mexicanos</p>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="amount" className="text-sm font-medium text-gray-600">
                Monto (MXN)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                  }}
                  className="w-full h-[56px] pl-10 pr-4 text-2xl font-mono font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400">Minimo $10.00 MXN</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_AMOUNTS.map((centavos) => (
                <button
                  key={centavos}
                  onClick={() => {
                    setAmount(centavos);
                    setInputValue(String(centavos / 100));
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    amount === centavos
                      ? 'bg-[#635bff] text-white border-[#635bff] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#635bff] hover:text-[#635bff]'
                  }`}
                >
                  ${(centavos / 100).toFixed(0)}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={amount < 1000}
              className="w-full h-[56px] bg-[#635bff] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#5851e5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              Pagar ${amount > 0 ? (amount / 100).toFixed(2) : '0.00'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {!backendUp && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
          <p className="text-xs text-yellow-700">Sin conexion al servidor · Verificar estado del pago</p>
        </div>
      )}
      <main className="flex-grow flex items-center justify-center p-4 lg:p-6">
        <CheckoutFlow
          amount={amount}
          onChangeAmount={handleChangeAmount}
        />
      </main>
      <Footer />
    </div>
  );
}
