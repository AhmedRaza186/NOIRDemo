import { formatPrice } from './format';

// Plain-text order for WhatsApp
export const buildOrderMessage = ({ lines, subtotal, orderType, name, address, notes }) => {
  const items = lines.map(({ item, qty }) => `• ${qty} × ${item.orderName} — ${formatPrice(qty * item.price)}`);

  return [
    'Hi NOIR! I would like to place an order:',
    '',
    ...items,
    '',
    `Subtotal: ${formatPrice(subtotal)} (excl. taxes)`,
    `Order type: ${orderType}`,
    `Name: ${name.trim()}`,
    orderType === 'Delivery' ? `Address: ${address.trim()}` : null,
    notes.trim() ? `Notes: ${notes.trim()}` : null,
  ].filter((line) => line !== null).join('\n');
};
