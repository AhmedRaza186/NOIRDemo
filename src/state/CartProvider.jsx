import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cart';
import { ITEMS_BY_ID } from '../data/menu';

const STORAGE_KEY = 'noir:cart';
const MAX_QTY = 20;

// Cart is stored as { [itemId]: quantity }; ids no longer on the menu are dropped
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return Object.fromEntries(
      Object.entries(saved).filter(([id, qty]) => ITEMS_BY_ID[id] && Number.isInteger(qty) && qty > 0)
    );
  } catch {
    return {};
  }
};

const CartProvider = ({ children }) => {
  const [quantities, setQuantities] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      // Storage unavailable — the cart still works for this visit
    }
  }, [quantities]);

  const setQty = useCallback((id, qty) => {
    setQuantities((current) => {
      const next = { ...current };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, MAX_QTY);
      return next;
    });
  }, []);

  const add = useCallback((id) => {
    setQuantities((current) => ({ ...current, [id]: Math.min((current[id] || 0) + 1, MAX_QTY) }));
  }, []);

  const clear = useCallback(() => setQuantities({}), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const lines = Object.entries(quantities).map(([id, qty]) => ({ item: ITEMS_BY_ID[id], qty }));
    return {
      quantities,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal: lines.reduce((sum, line) => sum + line.qty * line.item.price, 0),
      add,
      setQty,
      clear,
      isOpen,
      open,
      close,
    };
  }, [quantities, isOpen, add, setQty, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
