import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
  cartQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function ToolCard({ tool, cartQuantity, onAdd, onRemove }: ToolCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="rounded border-border/60 bg-secondary/50 text-xs text-muted-foreground">
            {tool.category}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {tool.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-muted-foreground">$</span>
          <span className="text-3xl font-bold tabular-nums tracking-tight text-primary">
            {tool.price.toFixed(2)}
          </span>
        </div>

        {cartQuantity === 0 ? (
          <Button
            variant="default"
            size="default"
            onClick={onAdd}
            className="w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onRemove}
              className="h-9 w-9 border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex h-9 w-12 items-center justify-center rounded-md border border-border bg-background text-sm font-semibold tabular-nums text-foreground">
              {cartQuantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={onAdd}
              className="h-9 w-9 border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
