export interface ErrorViewProps {
  onRetry: () => void;
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center text-center">
      <div className="mb-6 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <span
          className="material-symbols-outlined text-red-600 text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
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
