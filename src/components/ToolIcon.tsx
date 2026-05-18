import {
  Wrench,
  Drill,
  KeyRound,
  Gauge,
  Scissors,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'tool-001': Wrench,      // Destornillador
  'tool-002': Drill,       // Taladro
  'tool-003': KeyRound,    // Llaves
  'tool-004': Gauge,       // Multimetro
  'tool-005': Scissors,    // Sierra
};

export interface ToolIconProps {
  toolId: string;
  className?: string;
  'aria-label'?: string;
}

export function ToolIcon({ toolId, className = 'w-6 h-6', 'aria-label': ariaLabel }: ToolIconProps) {
  const Icon = iconMap[toolId] || Wrench;
  return <Icon className={className} aria-label={ariaLabel || 'icono de herramienta'} />;
}
