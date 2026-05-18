import type { Tool } from '../types/tool';
import { Header } from './Header';
import { ConnectionBanner } from './ConnectionBanner';
import { ToolsCatalog } from './ToolsCatalog';

export interface ToolSelectionViewProps {
  tools: Tool[];
  selectedTool: Tool | null;
  onSelect: (tool: Tool) => void;
  onAddToCart?: (tool: Tool) => void;
  loading: boolean;
  error: string | null;
  backendUp: boolean;
  cartCount?: number;
  onCartClick?: () => void;
}

export function ToolSelectionView({
  tools,
  onSelect,
  onAddToCart,
  loading,
  error,
  backendUp,
  cartCount = 0,
  onCartClick,
}: ToolSelectionViewProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header cartCount={cartCount} onCartClick={onCartClick} />
      <ConnectionBanner visible={!backendUp} />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Catálogo de herramientas</h1>
            <p className="text-sm text-gray-500">Selecciona una herramienta para comprar</p>
          </div>
          {loading && (
            <div className="text-center text-gray-500 py-8">Cargando catálogo...</div>
          )}
          {error && (
            <div className="text-center text-red-600 py-8">Error: {error}</div>
          )}
          {!loading && !error && (
            <ToolsCatalog tools={tools} onSelectTool={onSelect} onAddToCart={onAddToCart} />
          )}
        </div>
      </main>
    </div>
  );
}
