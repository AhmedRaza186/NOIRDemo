import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../state/cart';
import { getLenis } from '../../lib/lenis';
import { formatPrice } from '../../lib/format';
import { buildOrderMessage } from '../../lib/order';
import { openWhatsApp } from '../../lib/whatsapp';
import { WHATSAPP_URL } from '../../data/contact';
import AddToOrder from '../ui/AddToOrder';

const ORDER_TYPES = ['Takeaway', 'Delivery', 'Dine in'];

const fieldClass = 'w-full bg-transparent border-b border-noir-border py-3 text-base font-light placeholder:text-noir-muted/70 focus:border-noir-black focus:outline-none transition-colors duration-300';

// Slide-in order summary that hands the finished order to WhatsApp
const CartDrawer = () => {
  const { lines, count, subtotal, clear, isOpen, close } = useCart();
  const [orderType, setOrderType] = useState(ORDER_TYPES[0]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const closeButtonRef = useRef(null);

  // While open: pause page scroll, close on Escape, and restore focus afterwards
  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    getLenis()?.stop();
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      getLenis()?.start();
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, [isOpen, close]);

  const handleSubmit = (e) => {
    e.preventDefault();
    openWhatsApp(buildOrderMessage({ lines, subtotal, orderType, name, address, notes }));
  };

  return (
    <div className={`fixed inset-0 z-[80] ${isOpen ? '' : 'pointer-events-none'}`} inert={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute top-0 right-0 h-full w-full sm:w-[440px] bg-noir-cream text-noir-black flex flex-col shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-noir-border">
          <div>
            <h2 id="cart-title" className="text-3xl font-display uppercase">Your Order</h2>
            <p className="label-text mt-1">{count ? `${count} item${count > 1 ? 's' : ''}` : 'Nothing added yet'}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close order" className="p-2 hover-fade">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {!count ? (
          <div className="flex-grow flex flex-col justify-center px-6 md:px-8 gap-6">
            <p className="text-lg font-light text-noir-muted">
              Tap <span className="font-medium text-noir-black">+</span> on anything from the menu to build your order, then send it straight to us on WhatsApp.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="self-start border-b border-noir-black pb-1 text-sm tracking-[0.2em] uppercase font-medium hover:text-noir-muted hover:border-noir-muted transition-colors duration-300">
              Or message us directly &rarr;
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
            <div className="flex-grow overflow-y-auto px-6 md:px-8 py-6" data-lenis-prevent>
              {/* Items */}
              <ul className="flex flex-col gap-5 mb-10">
                {lines.map(({ item, qty }) => (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-light truncate">{item.orderName}</p>
                      <p className="text-sm text-noir-muted tabular-nums">{formatPrice(item.price * qty)}</p>
                    </div>
                    <AddToOrder id={item.id} className="shrink-0" />
                  </li>
                ))}
              </ul>

              {/* Order type */}
              <fieldset className="mb-8">
                <legend className="label-text mb-3">Order type</legend>
                <div className="grid grid-cols-3 border border-noir-border">
                  {ORDER_TYPES.map((type) => (
                    <label key={type} className={`text-center py-3 text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300 ${orderType === type ? 'bg-noir-black text-noir-cream' : 'hover:bg-noir-border/40'}`}>
                      <input type="radio" name="orderType" value={type} checked={orderType === type} onChange={() => setOrderType(type)} className="sr-only" />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Details */}
              <div className="flex flex-col gap-2">
                <input className={fieldClass} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" aria-label="Your name" />
                {orderType === 'Delivery' && (
                  <input className={fieldClass} placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} required autoComplete="street-address" aria-label="Delivery address" />
                )}
                <textarea className={`${fieldClass} resize-none`} rows={2} placeholder="Notes (flavours, spice level, table…)" value={notes} onChange={(e) => setNotes(e.target.value)} aria-label="Order notes" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-6 border-t border-noir-border">
              <div className="flex items-end justify-between mb-1">
                <span className="label-text">Subtotal</span>
                <span className="text-2xl font-display tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-noir-muted mb-5">Exclusive of taxes. We confirm every order on WhatsApp.</p>
              <button type="submit" className="w-full bg-noir-green text-noir-cream py-4 text-sm tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity duration-300">
                Send order on WhatsApp &rarr;
              </button>
              <button type="button" onClick={clear} className="w-full mt-3 py-2 label-text hover:text-noir-black transition-colors duration-300">
                Clear order
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
