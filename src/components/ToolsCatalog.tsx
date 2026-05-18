import type { Tool } from '../types/tool';
import { ToolCard } from './ToolCard';

export interface ToolsCatalogProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  onAddToCart?: (tool: Tool) => void;
}

export function ToolsCatalog({ tools, onSelectTool, onAddToCart }: ToolsCatalogProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tools.map((tool, index) => (
          <div
            key={tool.id}
            className={index === 0 ? 'md:col-span-2 xl:col-span-1' : ''}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ToolCard tool={tool} onSelect={onSelectTool} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
