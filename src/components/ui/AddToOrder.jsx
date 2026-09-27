import { Minus, Plus } from 'lucide-react';
import { useCart } from '../../state/cart';
import { ITEMS_BY_ID } from '../../data/menu';

// "+" button that turns into a quantity stepper once the item is in the order
const AddToOrder = ({ id, className = '' }) => {
  const { quantities, add, setQty } = useCart();
  const qty = quantities[id] || 0;
  const name = ITEMS_BY_ID[id].orderName;

  const buttonClass = 'flex items-center justify-center size-8 rounded-full border border-current hover:bg-noir-green hover:border-noir-green hover:text-noir-cream transition-colors duration-300';

  if (!qty) {
    return (
      <button type="button" onClick={() => add(id)} aria-label={`Add ${name} to order`} className={`${buttonClass} ${className}`}>
        <Plus size={14} strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" onClick={() => setQty(id, qty - 1)} aria-label={`Remove one ${name}`} className={buttonClass}>
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span className="w-5 text-center text-sm font-medium tabular-nums" aria-live="polite" aria-label={`${qty} in order`}>
        {qty}
      </span>
      <button type="button" onClick={() => add(id)} aria-label={`Add another ${name}`} className={buttonClass}>
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default AddToOrder;
