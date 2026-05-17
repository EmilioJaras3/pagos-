import type { Tool } from '../types/tool';

export interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

export function ToolCard({ tool, onSelect }: ToolCardProps) {
  const formattedPrice = `$${(tool.price / 100).toFixed(2)} MXN`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-base font-bold text-gray-900">{formattedPrice}</span>
        <button
          onClick={() => onSelect(tool)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#635bff] hover:bg-[#5851e5] transition-colors shadow-sm"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
