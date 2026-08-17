# NOIR — Cafe & Pizzeria

**A cinematic digital experience crafted for Noir Cafe & Pizzeria, Karachi.**

---

## About

This project is a creative frontend demonstration designed to translate the premium physical atmosphere of Noir Cafe & Pizzeria into a digital environment. Rather than simply presenting a generic menu and contact page, the goal was to craft a cinematic, editorial journey. The website acts as an extension of the café's physical space, utilizing sophisticated typography, deliberate pacing, and fluid motion design to evoke the Noir brand experience.

*Note: This is a frontend demonstration focused on creative development and UI/UX. Backend functionality, databases, and online ordering systems are intentionally not part of this demo.*

## Experience

The digital experience is structured into a continuous, seamlessly flowing narrative:

- **Cinematic Preloader:** A minimal, staggered GSAP entrance sequence establishing the brand identity before smoothly transitioning control to the main website.
- **Hero Entrance:** A meticulously choreographed reveal combining clip-path masking and typographic staggers to introduce the brand.
- **Sippin' Bag:** A signature product spotlight featuring a scroll-driven image zoom and progressive clip-path reveal.
- **Menu Experience:** A curated, editorial showcase of Noir's signature offerings rather than a standard tabular menu list.
- **The Space:** An art-directed, asymmetric masonry photography gallery built with CSS Grid, utilizing independent GSAP `ScrollTrigger` staggers for each image to communicate the café's ambience.
- **Visit & Footer:** A bold, full-width deep green closing sequence featuring contact details, a location map, and a massive editorial closing statement ("SEE YOU AT NOIR.").

## Design Direction

The visual aesthetic is strictly rooted in premium editorial design, emphasizing sophistication and restraint:

- **Color Palette:** Dominated by Noir Deep Green (`#0f2d22`), Noir Cream (`#f4f3ef`), and Noir Black (`#0c0c0c`).
- **Typography:** **Playfair Display** is used exclusively for massive, high-impact editorial headings, while **Inter** provides high legibility for UI elements and body copy.
- **Composition:** Heavy reliance on asymmetric layouts, purposeful off-center alignments, and generous whitespace to avoid standard "blocky" web structures.

## Motion & Interaction

The technology serves to elevate the brand experience without overwhelming it. Key interactions include:

- **GSAP & ScrollTrigger:** Used extensively for entrance choreography, scroll-linked image scaling, and component reveals. Timeline contexts are carefully managed to ensure smooth lifecycle handling.
- **Lenis Smooth Scrolling:** Implemented natively to ensure a fluid, continuous scrolling experience that complements the cinematic animations.
- **Accessibility:** Full support for `prefers-reduced-motion`—if a user has enabled reduced motion in their OS, all GSAP entrance and preloader animations are intelligently bypassed to respect their preferences.

## Tech Stack

This project is built using modern, performant frontend technologies:

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (for custom design system tokens)
- **Animation:** GSAP (GreenSock Animation Platform)
- **Smooth Scroll:** Lenis
- **Icons:** Lucide React

## Project Structure

```text
├── public/
│   └── assets/
│       └── noir/             # Brand logos, hero images, menu assets, ambience photography
├── src/
│   ├── components/
│   │   ├── layout/           # Intro, Navbar, Footer
│   │   └── sections/         # Hero, SippinBag, MenuExperience, SpaceExperience, VisitNoir
│   ├── App.jsx               # Main orchestration and Lenis initialization
│   ├── index.css             # Global design tokens and typography configuration
│   └── main.jsx
├── tailwind.config.js
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
