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

  beforeEach(() => {
    mockOnSelect.mockClear();
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
    expect(screen.getByLabelText('Destornillador')).toBeInTheDocument();
  });

  it('llama onSelect al hacer click en la tarjeta', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /seleccionar destornillador/i }));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockTool);
  });

  it('llama onSelect al hacer click en el boton Comprar', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockTool);
  });

  it('es accesible por teclado con Enter', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    const card = screen.getByRole('button', { name: /seleccionar destornillador/i });
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('es accesible por teclado con Space', () => {
    render(<ToolCard tool={mockTool} onSelect={mockOnSelect} />);
    const card = screen.getByRole('button', { name: /seleccionar destornillador/i });
    fireEvent.keyDown(card, { key: ' ' });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});
