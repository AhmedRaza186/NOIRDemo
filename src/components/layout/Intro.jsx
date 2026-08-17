import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Intro = ({ onReveal, onComplete }) => {
  const introRef = useRef(null);
  const estRef = useRef(null);
  const logoRef = useRef(null);
  const typeRef = useRef(null);

  const callbacks = useRef({ onReveal, onComplete });

  useEffect(() => {
    callbacks.current = { onReveal, onComplete };
  }, [onReveal, onComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      callbacks.current.onReveal();
      callbacks.current.onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to({}, { duration: 0.3 }) // Initial pause
        // 1. EST. KARACHI fades up
        .fromTo(estRef.current, 
          { y: 15, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
        // 2. Logo reveals
        .fromTo(logoRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          "-=0.3"
        )
        // 3. CAFE & PIZZERIA
        .fromTo(typeRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          "-=0.4"
        )
        // 4. Hold
        .to({}, { duration: 0.6 })
        // 5. Trigger app rendering underneath
        .call(() => callbacks.current.onReveal())
        // 6. Slide away (Reveal)
        .to(introRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => callbacks.current.onComplete()
        });

    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={introRef}
      className="fixed inset-0 z-[100] bg-noir-green flex flex-col items-center justify-center text-noir-cream pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
        <div ref={estRef} className="opacity-0">
          <span className="text-[10px] md:text-xs tracking-[0.4em] font-medium uppercase text-noir-cream/70">EST. KARACHI</span>
        </div>
        
        <div ref={logoRef} className="opacity-0 w-[140px] md:w-[180px] lg:w-[220px]">
          <img 
            src="/assets/noir/brand/logo-primary-white.png" 
            alt="Noir Logo" 
            className="w-full h-auto object-contain"
          />
        </div>
        
        <div ref={typeRef} className="opacity-0">
          <span className="text-[10px] md:text-xs tracking-[0.3em] font-light uppercase text-noir-cream/70">CAFE & PIZZERIA</span>
        </div>
      </div>
    </div>
  );
};

export default Intro;
