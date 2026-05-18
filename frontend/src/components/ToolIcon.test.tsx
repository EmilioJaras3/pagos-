import { render, screen } from '@testing-library/react';
import { ToolIcon } from './ToolIcon';
import { Wrench } from 'lucide-react';

describe('ToolIcon', () => {
  it('renderiza icono para tool-001 (Destornillador)', () => {
    render(<ToolIcon toolId="tool-001" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });

  it('renderiza icono para tool-002 (Taladro)', () => {
    render(<ToolIcon toolId="tool-002" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });

  it('renderiza icono para tool-003 (Llaves)', () => {
    render(<ToolIcon toolId="tool-003" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });

  it('renderiza icono para tool-004 (Multimetro)', () => {
    render(<ToolIcon toolId="tool-004" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });

  it('renderiza icono para tool-005 (Sierra)', () => {
    render(<ToolIcon toolId="tool-005" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });

  it('usa icono por defecto para toolId desconocido', () => {
    render(<ToolIcon toolId="tool-999" />);
    expect(screen.getByLabelText('icono de herramienta')).toBeInTheDocument();
  });
});
