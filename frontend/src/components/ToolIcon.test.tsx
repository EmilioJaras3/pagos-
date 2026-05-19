import { render, screen } from '@testing-library/react';
import { ToolIcon } from './ToolIcon';
import { Shirt } from 'lucide-react';

describe('ToolIcon', () => {
  it('renderiza icono para tool-001 (Camiseta Básica)', () => {
    render(<ToolIcon toolId="tool-001" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });

  it('renderiza icono para tool-002 (Pantalón Cargo)', () => {
    render(<ToolIcon toolId="tool-002" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });

  it('renderiza icono para tool-003 (Zapatillas Runner)', () => {
    render(<ToolIcon toolId="tool-003" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });

  it('renderiza icono para tool-004 (Lentes de Sol)', () => {
    render(<ToolIcon toolId="tool-004" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });

  it('renderiza icono para tool-005 (Reloj Minimalista)', () => {
    render(<ToolIcon toolId="tool-005" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });

  it('usa icono por defecto para toolId desconocido', () => {
    render(<ToolIcon toolId="tool-999" />);
    expect(screen.getByLabelText('icono de producto')).toBeInTheDocument();
  });
});
