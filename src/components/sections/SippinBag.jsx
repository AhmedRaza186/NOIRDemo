import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SippinBag = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const detailImageWrapperRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Create a single ScrollTrigger timeline for the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' }
      });

      // 1. Heading reveal upward
      tl.fromTo('.sippin-heading-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1 }
      )
      // 2. Description fade upward
      .fromTo(textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      )
      // CTA fade in
      .fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      // --- SCROLL-DRIVEN ENHANCEMENTS ---
      const isMobile = window.innerWidth < 768;
      const startScale = isMobile ? 1.05 : 1.18;
      const startY = isMobile ? 0 : 4;
      const startClip = isMobile ? 'inset(0% 0% 0% 0%)' : 'inset(15% 0% 15% 0%)';

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', // Start as soon as the section enters the bottom of the screen
          end: 'center center', // Fully revealed when the section is centered
          scrub: 1.5
        }
      });

      // 1. Main image wrapper clip-path reveal
      scrubTl.fromTo(imageWrapperRef.current,
        { clipPath: startClip },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
        0
      )
      // 2. Main image scale & parallax zoom
      .fromTo(imageRef.current,
        { scale: startScale, yPercent: startY },
        { scale: 1, yPercent: 0, ease: 'none' },
        0
      );

      // 3. Detail image scroll reveal (desktop only)
      if (!isMobile) {
        // Need to grab the actual img element inside the wrapper for scaling
        const detailImg = detailImageWrapperRef.current.querySelector('img');
        
        scrubTl.fromTo(detailImageWrapperRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'power1.out' },
          0.1
        )
        .fromTo(detailImg,
          { scale: 0.96 },
          { scale: 1, ease: 'none' },
          0.1
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="experience"
      className="relative min-h-[90svh] w-full flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-cream text-noir-black overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        
        {/* LEFT: Typography & Content */}
        <div className="w-full lg:w-[45%] flex flex-col z-10 pt-10 lg:pt-0 order-2 lg:order-1">
          <div className="overflow-hidden mb-6">
            <span className="block label-text text-noir-muted sippin-heading-line">SIGNATURE EXPERIENCE</span>
          </div>
          
          <h2 ref={headingRef} className="text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-8">
            <div className="overflow-hidden pb-2">
              <span className="block sippin-heading-line">THE</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="block sippin-heading-line text-noir-green">SIPPIN' BAG</span>
            </div>
          </h2>
          
          <div className="max-w-md mb-12">
            <p ref={textRef} className="text-lg md:text-xl font-light text-noir-muted leading-relaxed">
              Elevating the takeaway culture. Our signature Sippin' Bag combines premium craft beverages with an iconic, portable aesthetic designed for the modern lifestyle.
            </p>
          </div>

          <div ref={ctaRef} className="self-start">
            <a 
              href="#explore" 
              className="inline-flex items-center gap-3 border-b border-noir-black pb-1 text-sm tracking-[0.2em] uppercase font-medium hover:text-noir-muted hover:border-noir-muted transition-colors duration-300"
            >
              EXPLORE THE EXPERIENCE
            </a>
          </div>
        </div>

        {/* RIGHT: Visual Composition */}
        <div className="w-full lg:w-[55%] relative flex justify-end order-1 lg:order-2 h-[60vh] lg:h-[80vh]">
          {/* Main Hero Image */}
          <div 
            ref={imageWrapperRef} 
            className="w-full md:w-[85%] h-full relative overflow-hidden bg-noir-dark"
          >
            <img 
              ref={imageRef}
              src="/assets/noir/sippin-bag/sippin-bag-hero.jpg" 
              alt="Noir Sippin' Bag Signature Experience" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Overlapping Detail Image */}
          <div 
            ref={detailImageWrapperRef}
            className="hidden md:block absolute -bottom-10 left-0 w-[45%] lg:w-[40%] aspect-[4/5] border-8 border-noir-cream overflow-hidden z-20 shadow-2xl"
          >
            <img 
              src="/assets/noir/sippin-bag/sippin-bag-lifestyle.jpg" 
              alt="Sippin' Bag Lifestyle" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default SippinBag;
