import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renderiza los enlaces de navegación', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('muestra el nombre Vulturus', () => {
    render(<Footer />);
    expect(screen.getByText('Vulturus')).toBeInTheDocument();
  });
});
