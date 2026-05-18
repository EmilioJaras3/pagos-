import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renderiza el logo Vulturus', () => {
    render(<Header />);
    expect(screen.getByText('Vulturus')).toBeInTheDocument();
  });

  it('tiene el elemento de seguridad', () => {
    render(<Header />);
    expect(screen.getByText('lock')).toBeInTheDocument();
  });
});
