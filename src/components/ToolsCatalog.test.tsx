import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolsCatalog } from './ToolsCatalog';

describe('ToolsCatalog', () => {
  it('renderiza 5 tarjetas', () => {
    render(<ToolsCatalog onSelectTool={vi.fn()} />);
    const buttons = screen.getAllByText('Comprar');
    expect(buttons).toHaveLength(5);
  });

  it('llama onSelectTool con la herramienta correcta al hacer click en Comprar', () => {
    const handleSelect = vi.fn();
    render(<ToolsCatalog onSelectTool={handleSelect} />);

    const buttons = screen.getAllByText('Comprar');
    fireEvent.click(buttons[0]);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tool-001',
        name: 'Destornillador eléctrico',
        price: 45000,
      })
    );
  });
});
