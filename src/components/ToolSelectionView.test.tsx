import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolSelectionView } from './ToolSelectionView';
import type { Tool } from '../types/tool';

const mockTools: Tool[] = [
  { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 },
  { id: 'tool-002', name: 'Taladro', description: 'Test', price: 125000 },
];

describe('ToolSelectionView', () => {
  it('renderiza header y catalogo con herramientas', () => {
    render(
      <ToolSelectionView
        tools={mockTools}
        selectedTool={null}
        onSelect={vi.fn()}
        loading={false}
        error={null}
        backendUp={true}
      />
    );

    expect(screen.getByText(/Catálogo de herramientas/)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona una herramienta para comprar/)).toBeInTheDocument();
    expect(screen.getAllByText('Comprar')).toHaveLength(2);
  });

  it('muestra banner de conexion cuando backendUp=false', () => {
    render(
      <ToolSelectionView
        tools={mockTools}
        selectedTool={null}
        onSelect={vi.fn()}
        loading={false}
        error={null}
        backendUp={false}
      />
    );

    expect(screen.getByText(/Sin conexion al servidor/)).toBeInTheDocument();
  });

  it('muestra loading', () => {
    render(
      <ToolSelectionView
        tools={[]}
        selectedTool={null}
        onSelect={vi.fn()}
        loading={true}
        error={null}
        backendUp={true}
      />
    );

    expect(screen.getByText(/Cargando catálogo/)).toBeInTheDocument();
    expect(screen.queryByText('Comprar')).not.toBeInTheDocument();
  });

  it('muestra error', () => {
    render(
      <ToolSelectionView
        tools={[]}
        selectedTool={null}
        onSelect={vi.fn()}
        loading={false}
        error={'Fetch failed'}
        backendUp={true}
      />
    );

    expect(screen.getByText(/Error: Fetch failed/)).toBeInTheDocument();
  });

  it('llama onSelect al hacer click en Comprar', () => {
    const handleSelect = vi.fn();
    render(
      <ToolSelectionView
        tools={mockTools}
        selectedTool={null}
        onSelect={handleSelect}
        loading={false}
        error={null}
        backendUp={true}
      />
    );

    const buttons = screen.getAllByText('Comprar');
    fireEvent.click(buttons[0]);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tool-001', name: 'Destornillador' })
    );
  });
});
