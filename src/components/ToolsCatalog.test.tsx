import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolsCatalog } from './ToolsCatalog';
import type { Tool } from '../types/tool';

const mockTools: Tool[] = [
  { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 },
  { id: 'tool-002', name: 'Taladro', description: 'Test', price: 125000 },
  { id: 'tool-003', name: 'Llaves', description: 'Test', price: 32000 },
  { id: 'tool-004', name: 'Multimetro', description: 'Test', price: 28000 },
  { id: 'tool-005', name: 'Sierra', description: 'Test', price: 89000 },
];

describe('ToolsCatalog', () => {
  it('renderiza las herramientas recibidas por prop', () => {
    render(<ToolsCatalog tools={mockTools} onSelectTool={vi.fn()} />);
    const buttons = screen.getAllByText('Comprar');
    expect(buttons).toHaveLength(5);
  });

  it('llama onSelectTool con la herramienta correcta al hacer click en Comprar', () => {
    const handleSelect = vi.fn();
    render(<ToolsCatalog tools={mockTools} onSelectTool={handleSelect} />);

    const buttons = screen.getAllByText('Comprar');
    fireEvent.click(buttons[0]);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tool-001',
        name: 'Destornillador',
        price: 45000,
      })
    );
  });

  it('renderiza array vacio sin errores', () => {
    render(<ToolsCatalog tools={[]} onSelectTool={vi.fn()} />);
    expect(screen.queryAllByText('Comprar')).toHaveLength(0);
  });
});
