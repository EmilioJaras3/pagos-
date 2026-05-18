import { ToolCard } from "./ToolCard";
import type { Tool } from "@/types/tool";

interface ToolsCatalogProps {
  tools: Tool[];
  cartQuantities: Record<string, number>;
  onAdd: (tool: Tool) => void;
  onRemove: (tool: Tool) => void;
}

export function ToolsCatalog({ tools, cartQuantities, onAdd, onRemove }: ToolsCatalogProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Herramientas profesionales para cada trabajo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            cartQuantity={cartQuantities[tool.id] ?? 0}
            onAdd={() => onAdd(tool)}
            onRemove={() => onRemove(tool)}
          />
        ))}
      </div>
    </section>
  );
}
