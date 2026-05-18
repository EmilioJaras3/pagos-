import { ShoppingCart } from 'lucide-react';

export interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-1/3 after:bg-[#635bff]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
        <div className="text-lg font-bold tracking-tighter text-gray-900 uppercase">
          Vulturus
        </div>
        <div className="flex items-center gap-4">
          {onCartClick && (
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Abrir carrito (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <span className="material-symbols-outlined text-gray-400">lock</span>
        </div>
      </div>
    </header>
  );
}
