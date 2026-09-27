# NOIR — Cafe & Pizzeria

**A cinematic digital experience crafted for Noir Cafe & Pizzeria, Karachi.**

---

## About

This project is a creative frontend demonstration designed to translate the premium physical atmosphere of Noir Cafe & Pizzeria into a digital environment. Rather than simply presenting a generic menu and contact page, the goal was to craft a cinematic, editorial journey. The website acts as an extension of the café's physical space, utilizing sophisticated typography, deliberate pacing, and fluid motion design to evoke the Noir brand experience.

*Note: This is a frontend demonstration focused on creative development and UI/UX. Backend functionality, databases, and online ordering systems are intentionally not part of this demo.*

## Experience

The digital experience is structured into a continuous, seamlessly flowing narrative:

- **Cinematic Preloader:** A minimal, staggered GSAP entrance sequence establishing the brand identity before smoothly transitioning control to the main website. It plays once per browser session.
- **Hero Entrance:** A meticulously choreographed reveal combining clip-path masking and typographic staggers to introduce the brand, with a live "Open now · until 4 AM" status computed in Karachi time.
- **Sippin' Bag:** A product spotlight with a photo picker and a lazy-loaded, drag-to-rotate 3D model (React Three Fiber). Choosing a pour (Blueberry, Strawberry, Mango, Matcha) recolours the drink and adds it to the order.
- **Menu Experience:** A curated, editorial showcase of Noir's signature offerings, each with an add-to-order stepper.
- **Signatures:** A pinned, scroll-driven horizontal strip of signature dishes (a native swipe row on mobile).
- **The Space:** An art-directed, asymmetric masonry photography gallery built with CSS Grid, utilizing independent GSAP `ScrollTrigger` staggers for each image to communicate the café's ambience.
- **The Courts:** Padel court booking: pick a day, start time, duration and players, and the request opens as a pre-filled WhatsApp message.
- **Visit & Footer:** A bold, full-width deep green closing sequence featuring contact details, a location map, and a massive editorial closing statement ("SEE YOU AT NOIR.").

## Design Direction

The visual aesthetic is strictly rooted in premium editorial design, emphasizing sophistication and restraint:

- **Color Palette:** Dominated by Noir Deep Green (`#0f2d22`), Noir Cream (`#f4f3ef`), and Noir Black (`#0c0c0c`).
- **Typography:** **Playfair Display** is used exclusively for massive, high-impact editorial headings, while **Inter** provides high legibility for UI elements and body copy.
- **Composition:** Heavy reliance on asymmetric layouts, purposeful off-center alignments, and generous whitespace to avoid standard "blocky" web structures.
- **Day / Night:** From 7 PM to 6 AM Karachi time the site switches to a night palette and night photography. A toggle overrides it for the session, revealed with a circular View Transition.

## Motion & Interaction

The technology serves to elevate the brand experience without overwhelming it. Key interactions include:

- **GSAP & ScrollTrigger:** Used extensively for entrance choreography, scroll-linked image scaling, and component reveals. Timeline contexts are carefully managed to ensure smooth lifecycle handling.
- **Lenis Smooth Scrolling:** Driven by GSAP's ticker and synced with ScrollTrigger, with smooth anchor navigation offset for the fixed navbar.
- **Responsive motion:** All section animations go through a shared `useGsap` hook built on `gsap.matchMedia()`, so they rebuild when crossing the mobile breakpoint and clean up on unmount.
- **Custom cursor:** A follower dot for mouse users that grows over links and shows labels such as "+ ADD" and "DRAG" (disabled on touch and under reduced motion).
- **Accessibility:** Full support for `prefers-reduced-motion` — the preloader, entrance and scroll animations are skipped, Lenis falls back to native scrolling, and the mobile menu opens instantly. The closed mobile menu is `inert`, and `Escape` closes it.

## Ordering

There is no backend: the order builder is client-side state (persisted in `localStorage`). The drawer collects order type, name, address and notes, then opens WhatsApp with the whole order written out, ready for the café to confirm.

## Tech Stack

This project is built using modern, performant frontend technologies:

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (design tokens defined via `@theme` in `index.css`)
- **Animation:** GSAP (GreenSock Animation Platform)
- **Smooth Scroll:** Lenis
- **3D:** three.js + React Three Fiber + drei (code-split, loaded on demand)
- **Icons:** Lucide React

## Project Structure

```text
├── public/
│   ├── assets/noir/          # Brand logos, hero images, menu assets, ambience photography
│   └── noir-menu.pdf         # Full menu (linked from the Menu section)
├── src/
│   ├── components/
│   │   ├── layout/           # Intro, Navbar, Footer
│   │   ├── sections/         # Hero, SippinBag, MenuExperience, Signatures, SpaceExperience, Courts, VisitNoir
│   │   ├── order/            # CartDrawer, CartButton
│   │   ├── three/            # SippinBag3D (lazy), ErrorBoundary
│   │   └── ui/               # OpenBadge, ThemeToggle, AddToOrder, Cursor
│   ├── data/                 # contact.js (phone, hours, links), menu.js (items, prices, flavours)
│   ├── hooks/                # useGsap (scoped animations), useKarachiMinutes (live clock)
│   ├── lib/                  # lenis handle, Karachi time + opening status, WhatsApp + order message helpers
│   ├── state/                # CartProvider, ThemeProvider and their hooks
│   ├── App.jsx               # Main orchestration and Lenis initialization
│   ├── index.css             # Tailwind v4 @theme design tokens and base styles
│   └── main.jsx
├── vite.config.js
└── package.json
```

## Getting Started

To run this project locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Credits

**Concept & Development:**  
Ahmed Raza
