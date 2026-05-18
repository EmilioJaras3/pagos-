import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConnectionBanner } from './ConnectionBanner';

describe('ConnectionBanner', () => {
  it('renderiza banner cuando visible=true', () => {
    render(<ConnectionBanner visible={true} />);
    expect(screen.getByText(/Sin conexion al servidor/)).toBeInTheDocument();
  });

  it('no renderiza nada cuando visible=false', () => {
    render(<ConnectionBanner visible={false} />);
    expect(screen.queryByText(/Sin conexion al servidor/)).not.toBeInTheDocument();
  });
});
