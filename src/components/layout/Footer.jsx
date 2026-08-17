import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // 1. Heading reveal
      tl.fromTo('.footer-heading-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' }
      )
      // 2. Footer columns reveal
      .fromTo('.footer-col',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        '-=0.8'
      )
      // 3. Footer bottom reveal
      .fromTo('.footer-bottom',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.4'
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full bg-noir-green text-noir-cream overflow-hidden pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col">
        
        {/* HUGE EDITORIAL HEADING */}
        <div className="mb-20 md:mb-32">
          <h2 className="text-[12vw] md:text-[8rem] lg:text-[11rem] font-display font-medium leading-[0.8] tracking-tight uppercase whitespace-nowrap">
            <div className="overflow-hidden pb-2 lg:pb-4">
              <span className="block footer-heading-line">SEE YOU AT</span>
            </div>
            <div className="overflow-hidden pb-2 lg:pb-4">
              <span className="block footer-heading-line text-white">NOIR.</span>
            </div>
          </h2>
        </div>

        {/* ASYMMETRIC CONTENT LAYOUT */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 pb-16 md:pb-24 border-b border-noir-cream/20">
          
          {/* LEFT: Brand Intro */}
          <div className="flex flex-col w-full lg:w-[35%] footer-col">
            <div className="mb-6">
              <h3 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-white mb-1">NOIR</h3>
              <p className="text-sm tracking-[0.3em] uppercase text-noir-cream/60">Cafe & Pizzeria</p>
            </div>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-sm">
              Handcrafted coffee.<br />
              Slow-made pasta.<br />
              Wood-fired pizza.
            </p>
          </div>

          {/* CENTER: Visit Info */}
          <div className="flex flex-col w-full md:w-1/2 lg:w-[25%] footer-col">
            <h4 className="text-sm tracking-[0.2em] uppercase text-noir-cream/60 mb-6">VISIT</h4>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-base font-light leading-relaxed">
                  Plot 24–25, Block 07, DMCHS<br />
                  Tipu Sultan Road, Karachi
                </p>
              </div>
              <div>
                <p className="text-base font-light">5 PM — 4 AM</p>
                <p className="text-sm font-light text-noir-cream/60">Everyday</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Follow & CTA */}
          <div className="flex flex-col w-full md:w-1/2 lg:w-[25%] footer-col">
            <h4 className="text-sm tracking-[0.2em] uppercase text-noir-cream/60 mb-6">FOLLOW</h4>
            <div className="flex flex-col gap-4 mb-10">
              <a href="https://www.instagram.com/noircafepk/" target="_blank" rel="noopener noreferrer" className="text-base font-light hover:text-white transition-colors duration-300 w-fit relative group">
                Instagram
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="https://wa.me/923363355558" target="_blank" rel="noopener noreferrer" className="text-base font-light hover:text-white transition-colors duration-300 w-fit relative group">
                WhatsApp
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            
            <div>
              <a 
                href="https://wa.me/923363355558" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-noir-cream/30 hover:border-white px-6 py-4 text-sm tracking-[0.2em] uppercase font-medium text-white hover:bg-white hover:text-noir-green transition-all duration-300 w-fit"
              >
                ORDER / WHATSAPP &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM: Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-xs md:text-sm tracking-[0.1em] uppercase text-noir-cream/50 footer-bottom">
          <p>&copy; {new Date().getFullYear()} Noir Cafe & Pizzeria</p>
          <p className="text-center">Made By Ahmed Raza</p>
          <p>Karachi, Pakistan</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
