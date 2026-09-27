import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGsap } from '../../hooks/useGsap';
import { getLenis } from '../../lib/lenis';
import { useCart } from '../../state/cart';
import { useTheme } from '../../state/theme';
import OpenBadge from '../ui/OpenBadge';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  { href: '#menu', label: 'MENU' },
  { href: '#space', label: 'EXPERIENCE' },
  { href: '#courts', label: 'COURTS' },
  { href: '#visit', label: 'VISIT' },
];

const Navbar = () => {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const tlRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count, open: openCart } = useCart();
  const { theme } = useTheme();
  const orderLabel = count ? `ORDER (${count})` : 'ORDER';
  const logoSrc = isMobileMenuOpen || theme === 'night'
    ? '/assets/noir/brand/logo-primary-white.png'
    : '/assets/noir/brand/logo-primary.png';

  useGsap(({ reduceMotion }) => {
    // 1. Initial Load Animation
    if (!reduceMotion) {
      gsap.from(navRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    // 2. Setup Mobile Menu Animation (instant under reduced motion)
    gsap.set(mobileMenuRef.current, { yPercent: -100 });

    tlRef.current = gsap.timeline({ paused: true })
      .to(mobileMenuRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: 'power4.inOut'
      })
      .fromTo('.mobile-link',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        "-=0.4"
      );

    if (reduceMotion) tlRef.current.duration(0.01);
  }, navRef, { allowReducedMotion: true });

  // Handle open/close toggle: lock scroll and allow Escape to close
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isMobileMenuOpen) {
      tl.reverse();
      return;
    }

    tl.play();
    getLenis()?.stop();
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      getLenis()?.start();
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close the mobile menu if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Resume Lenis synchronously so its anchor handler can scroll on this same click
  const closeMenu = () => {
    getLenis()?.start();
    setIsMobileMenuOpen(false);
  };

  const openOrderFromMenu = () => {
    closeMenu();
    openCart();
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-6 md:px-12 lg:px-20 bg-noir-cream/85 backdrop-blur-md text-noir-black border-b border-noir-border/30"
    >
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
        {/* Logo */}
        <a href="/" className="relative z-50 flex items-center group" onClick={closeMenu}>
          <img
            src={logoSrc}
            alt="Noir Cafe & Pizzeria"
            width={204}
            height={192}
            className="w-[90px] md:w-[110px] lg:w-[120px] h-auto object-contain hover-fade"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <OpenBadge className="hidden xl:inline-flex text-noir-muted mr-2" />
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="label-text text-noir-black hover-fade">{link.label}</a>
          ))}
          <button
            type="button"
            onClick={openCart}
            className="label-text text-noir-black border border-noir-black px-5 py-2 hover:bg-noir-black hover:text-noir-cream transition-colors duration-300 tabular-nums"
          >
            {orderLabel}
          </button>
          <ThemeToggle className="-mr-2" />
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden relative z-50 flex items-center gap-1">
          <ThemeToggle className={isMobileMenuOpen ? 'text-white' : 'text-noir-black'} />
          <button
            className="p-2 hover-fade"
            onClick={() => setIsMobileMenuOpen(open => !open)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X size={28} strokeWidth={1.5} className="text-white" />
            ) : (
              <Menu size={28} strokeWidth={1.5} className="text-noir-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay (inert while closed so its links can't be tabbed to) */}
      <nav
        ref={mobileMenuRef}
        id="mobile-menu"
        inert={!isMobileMenuOpen}
        className="surface-brand fixed top-0 left-0 w-full h-[100dvh] bg-noir-green text-noir-cream flex flex-col justify-center items-center space-y-10 md:hidden z-40"
      >
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href} onClick={closeMenu} className="mobile-link font-display text-4xl hover-fade">{link.label}</a>
        ))}
        <button
          type="button"
          onClick={openOrderFromMenu}
          className="mobile-link font-display text-2xl border-b border-current pb-1 mt-4 hover-fade tabular-nums"
        >
          {count ? `YOUR ORDER (${count})` : 'START AN ORDER'}
        </button>
        <OpenBadge className="mobile-link text-noir-cream/70 pt-4" />
      </nav>
    </header>
  );
};

export default Navbar;
