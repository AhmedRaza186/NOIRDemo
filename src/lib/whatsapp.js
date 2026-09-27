import { WHATSAPP_NUMBER } from '../data/contact';

export const whatsappUrl = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const openWhatsApp = (text) => {
  window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
};
