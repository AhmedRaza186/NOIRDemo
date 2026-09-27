// Prices from the in-store menu (public/noir-menu.pdf), all exclusive of taxes.
// `orderName` is what appears in a WhatsApp order when `name` alone is ambiguous.

export const MENU_CATEGORIES = [
  {
    title: 'PIZZAS',
    items: [
      { id: 'pizza-fajita', name: 'Fajita', orderName: 'Fajita Pizza', price: 1150 },
      { id: 'pizza-creamy-tikka', name: 'Creamy Tikka', orderName: 'Creamy Tikka Pizza', price: 1150 },
      { id: 'pizza-bbq', name: 'BBQ', orderName: 'BBQ Pizza', price: 1150 },
      { id: 'pizza-ranch-supreme', name: 'Ranch Supreme', orderName: 'Ranch Supreme Pizza', price: 1250 },
    ],
  },
  {
    title: 'BURGERS',
    items: [
      { id: 'burger-american-classic', name: 'American Classic', orderName: 'American Classic Burger', price: 890 },
      { id: 'burger-bbq-banger', name: 'BBQ Banger', orderName: 'BBQ Banger Burger', price: 990 },
    ],
  },
  {
    title: 'PASTA',
    items: [
      { id: 'pasta-alfredo', name: 'Fettuccine Alfredo', price: 1890 },
      { id: 'pasta-tuscan-tomato', name: 'Tuscan Tomato', orderName: 'Tuscan Tomato Pasta', price: 1990 },
    ],
  },
  {
    title: 'COFFEE',
    items: [
      { id: 'coffee-cappuccino', name: 'Cappuccino / Latte', price: 600 },
      { id: 'coffee-classics', name: 'Classics', orderName: 'Classic Coffee', price: 750 },
      { id: 'coffee-house-special', name: 'House Special', orderName: 'House Special Coffee', price: 790 },
    ],
  },
  {
    title: 'SIGNATURES',
    items: [
      { id: 'frappe-signature', name: 'Signature Frappe', price: 850 },
      { id: 'purely-iced', name: 'Purely Iced', price: 990 },
      { id: 'iced-matcha', name: 'Iced Matcha', price: 850 },
    ],
  },
];

// Sippin' Bag pours: drive the 3D preview colours and add flavour-specific items
export const SIPPIN_FLAVORS = [
  { id: 'sippin-blueberry', name: 'Blueberry', orderName: "Sippin' Bag — Purely Iced Blueberry", price: 990, syrup: '#4a2f8f', milk: '#e2dcf3' },
  { id: 'sippin-strawberry', name: 'Strawberry', orderName: "Sippin' Bag — Purely Iced Strawberry", price: 990, syrup: '#c8245a', milk: '#f8dbe4' },
  { id: 'sippin-mango', name: 'Mango', orderName: "Sippin' Bag — Purely Iced Mango", price: 990, syrup: '#f09a00', milk: '#fcebc2' },
  { id: 'sippin-matcha', name: 'Matcha', orderName: "Sippin' Bag — Iced Matcha", price: 850, syrup: '#5f8a2e', milk: '#e5edd0' },
];

export const ITEMS_BY_ID = Object.fromEntries(
  [...MENU_CATEGORIES.flatMap((category) => category.items), ...SIPPIN_FLAVORS]
    .map((item) => [item.id, { orderName: item.name, ...item }])
);

// Horizontal "Signatures" strip
export const SIGNATURE_DISHES = [
  { id: 'pizza-creamy-tikka', tag: 'Pizza', image: '/assets/noir/food/chicken-tikka.webp', blurb: 'Extremely creamy and cheesy, topped with spicy chicken tikka and rich desi flavour.' },
  { id: 'pizza-fajita', tag: 'Pizza', image: '/assets/noir/food/fajita.webp', blurb: 'Seasoned grilled chicken, mushrooms, peppers, onions and zesty fajita spices.' },
  { id: 'burger-american-classic', tag: 'Double Smash', image: '/assets/noir/food/burger.webp', blurb: 'Beef bacon layered with cheddar and our signature sauce.' },
  { id: 'pizza-ranch-supreme', tag: 'Pizza', image: '/assets/noir/food/pizza-02.jpg', blurb: 'Spicy chicken chunks, green pepper, black olives, onions and ranch sauce.' },
  { id: 'frappe-signature', tag: 'Frappe', image: '/assets/noir/food/frappe.jpg', blurb: 'Coconut, caramel, vanilla or hazelnut, blended and piled high.' },
  { id: 'coffee-cappuccino', tag: 'Coffee', image: '/assets/noir/food/coffee.jpg', blurb: 'Bold espresso crowned with velvety froth. Always a classic.' },
];
