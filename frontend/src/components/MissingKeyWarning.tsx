import { Footer } from './Footer';

export function MissingKeyWarning() {
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
