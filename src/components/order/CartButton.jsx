import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../state/cart';
import { formatPrice } from '../../lib/format';

// Floating summary pill, shown once something is in the order
const CartButton = () => {
  const { count, subtotal, isOpen, open } = useCart();
  const visible = count > 0 && !isOpen;

  return (
    <button
      type="button"
      onClick={open}
      inert={!visible}
      aria-label={`View order: ${count} items, ${formatPrice(subtotal)}`}
      className={`surface-brand fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[70] flex items-center gap-3 bg-noir-green text-noir-cream pl-5 pr-6 py-4 shadow-2xl text-xs tracking-[0.2em] uppercase font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'}`}
    >
      <span className="relative">
        <ShoppingBag size={18} strokeWidth={1.5} />
        <span className="absolute -top-2 -right-2.5 flex size-4 items-center justify-center rounded-full bg-noir-cream text-noir-green text-[10px] tracking-normal tabular-nums">
          {count}
        </span>
      </span>
      <span className="tabular-nums">View order · {formatPrice(subtotal)}</span>
    </button>
  );
};

export default CartButton;
