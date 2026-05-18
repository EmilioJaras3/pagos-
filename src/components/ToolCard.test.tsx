import { render, screen, fireEvent } from '@testing-library/react';
import { ToolCard } from './ToolCard';
import type { Tool } from '../types/tool';

const mockTool: Tool = {
  id: 'tool-001',
  name: 'Destornillador',
  description: 'Destornillador profesional',
  price: 1500,
};

describe('ToolCard', () => {
  const mockOnSelect = vi.fn();
  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnAddToCart.mockClear();
  });

  it('renderiza nombre y descripcion', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    expect(screen.getByText('Destornillador')).toBeInTheDocument();
    expect(screen.getByText('Destornillador profesional')).toBeInTheDocument();
  });

  it('formatea precio correctamente', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    expect(screen.getByText('$15.00 MXN')).toBeInTheDocument();
  });

  it('renderiza icono de herramienta', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    // Use getAllByLabelText and check at least one exists
    const elements = screen.getAllByLabelText('Destornillador');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('llama onSelect al hacer click en Comprar', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockTool);
  });

  it('llama onAddToCart al hacer click en el boton del carrito', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} onAddToCart={mockOnAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /agregar destornillador al carrito/i }));
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockTool);
  });

  it('no muestra boton de carrito si onAddToCart no esta definido', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    expect(screen.queryByRole('button', { name: /agregar/i })).not.toBeInTheDocument();
  });
});
