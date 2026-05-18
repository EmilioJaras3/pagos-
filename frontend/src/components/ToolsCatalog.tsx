import type { Tool } from '../types/tool';
import { ToolCard } from './ToolCard';

export interface ToolsCatalogProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
}

export function ToolsCatalog({ tools, onSelectTool }: ToolsCatalogProps) {
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
}
