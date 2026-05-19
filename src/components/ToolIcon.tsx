import {
  Shirt,
  ShoppingBag,
  Footprints,
  Glasses,
  Watch,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'tool-001': Shirt,       // Camiseta Básica
  'tool-002': ShoppingBag, // Pantalón Cargo
  'tool-003': Footprints,  // Zapatillas Runner
  'tool-004': Glasses,     // Lentes de Sol
  'tool-005': Watch,       // Reloj Minimalista
};

export interface ToolIconProps {
  toolId: string;
  className?: string;
  'aria-label'?: string;
}

export function ToolIcon({ toolId, className = 'w-6 h-6', 'aria-label': ariaLabel }: ToolIconProps) {
  const Icon = iconMap[toolId] || Shirt;
  return <Icon className={className} aria-label={ariaLabel || 'icono de producto'} />;
}
