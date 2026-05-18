import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './hooks/useCart';

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <App />
  </CartProvider>
);
