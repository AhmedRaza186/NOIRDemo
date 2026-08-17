import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tlRef = useRef(null);

  // Set up mobile links refs
  const addToLinksRef = (el) => {
    if (el && !mobileLinksRef.current.includes(el)) {
      mobileLinksRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Load Animation
      gsap.from(navRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      // 2. Setup Mobile Menu Animation
      gsap.set(mobileMenuRef.current, { yPercent: -100 });
      
      tlRef.current = gsap.timeline({ paused: true });
      tlRef.current.to(mobileMenuRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: 'power4.inOut'
      })
      .fromTo(mobileLinksRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        "-=0.4"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Handle open/close toggle
  useEffect(() => {
    if (tlRef.current) {
      if (isMobileMenuOpen) {
        tlRef.current.play();
        document.body.style.overflow = 'hidden'; // Lock scroll
      } else {
        tlRef.current.reverse();
        document.body.style.overflow = ''; // Unlock scroll
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header 
      ref={navRef} 
      className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-6 md:px-12 lg:px-20 bg-noir-cream/85 backdrop-blur-md text-noir-black border-b border-noir-border/30"
    >
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
        {/* Logo */}
        <a href="/" className="relative z-50 flex items-center group" onClick={closeMenu}>
          <img 
            src={isMobileMenuOpen ? "/assets/noir/brand/logo-primary-white.png" : "/assets/noir/brand/logo-primary.png"} 
            alt="Noir Cafe & Pizzeria" 
            className="w-[90px] md:w-[110px] lg:w-[120px] h-auto object-contain hover-fade"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <a href="#menu" className="label-text text-noir-black hover-fade">MENU</a>
          <a href="#space" className="label-text text-noir-black hover-fade">EXPERIENCE</a>
          <a href="#visit" className="label-text text-noir-black hover-fade">VISIT</a>
          <a 
            href="https://wa.me/923363355558" 
            className="label-text text-noir-black border border-noir-black px-5 py-2 hover:bg-noir-black hover:text-noir-cream transition-colors duration-300"
          >
            ORDER / WHATSAPP
          </a>
        </nav>

        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden relative z-50 p-2 focus:outline-none hover-fade"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X size={28} strokeWidth={1.5} className="text-noir-cream" />
          ) : (
            <Menu size={28} strokeWidth={1.5} className="text-noir-black" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed top-0 left-0 w-full h-[100dvh] bg-noir-green text-noir-cream flex flex-col justify-center items-center space-y-10 md:hidden z-40"
      >
        <a ref={addToLinksRef} href="#menu" onClick={closeMenu} className="font-display text-4xl hover-fade">MENU</a>
        <a ref={addToLinksRef} href="#space" onClick={closeMenu} className="font-display text-4xl hover-fade">EXPERIENCE</a>
        <a ref={addToLinksRef} href="#visit" onClick={closeMenu} className="font-display text-4xl hover-fade">VISIT</a>
        <a 
          ref={addToLinksRef}
          href="#visit" 
          onClick={closeMenu} 
          className="font-display text-2xl border-b border-current pb-1 mt-4 hover-fade"
        >
          ORDER / WHATSAPP
        </a>
      </div>
    </header>
  );
};

export default Navbar;
