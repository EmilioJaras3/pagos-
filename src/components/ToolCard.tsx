import type { Tool } from '../types/tool';
import { ToolIcon } from './ToolIcon';
import { ShoppingCart } from 'lucide-react';

export interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
  onAddToCart?: (tool: Tool) => void;
}

export function ToolCard({ tool, onSelect, onAddToCart }: ToolCardProps) {
  const formattedPrice = `$${(tool.price / 100).toFixed(2)} MXN`;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-lg hover:border-gray-300 hover:scale-[1.02] transition-all duration-200"
         aria-label={tool.name}>
      <div className="flex items-start justify-between">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
          <ToolIcon toolId={tool.id} className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" aria-label={tool.name} />
        </div>
        <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-900">{tool.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
      </div>
      <div className="mt-auto pt-2 flex gap-2">
        <button
          onClick={() => onSelect(tool)}
          className="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-gray-900 hover:bg-orange-600 active:bg-orange-700 transition-colors"
        >
          Comprar
        </button>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(tool)}
            className="px-3 py-2.5 rounded-md text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-orange-100 hover:text-orange-700 active:bg-orange-200 transition-colors"
            aria-label={`Agregar ${tool.name} al carrito`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
