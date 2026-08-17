import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SpaceExperience = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Typography entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo('.space-heading-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      )
      .fromTo([textRef.current, ctaRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        '-=0.6'
      );

      // 2. Individual Gallery Image Scrub Animations
      const isMobile = window.innerWidth < 768;
      const startScale = isMobile ? 1.05 : 1.12;
      const startClip = isMobile ? 'inset(0% 0% 0% 0%)' : 'inset(8% 0% 8% 0%)';

      const wrappers = gsap.utils.toArray('.gallery-item-wrapper');
      const images = gsap.utils.toArray('.gallery-item-image');

      wrappers.forEach((wrapper, i) => {
        const img = images[i];

        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom', // Start as soon as the image enters the viewport
            end: 'center center', // Finish when the image is centered
            scrub: 1.2
          }
        });

        // Subtle clip-path reveal
        scrubTl.fromTo(wrapper,
          { clipPath: startClip },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
          0
        )
        // Zoom and slight parallax
        .fromTo(img,
          { scale: startScale, yPercent: isMobile ? 0 : 3 },
          { scale: 1, yPercent: 0, ease: 'none' },
          0
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="space"
      className="relative w-full flex flex-col py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-cream text-noir-black overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col">
        
        {/* HEADER AREA */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <div className="overflow-hidden mb-6">
              <span className="block label-text text-noir-muted space-heading-line">THE SPACE</span>
            </div>
            
            <h2 ref={headingRef} className="text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] font-display font-medium leading-[0.85] tracking-tight uppercase">
              <div className="overflow-hidden pb-2">
                <span className="block space-heading-line">MORE THAN</span>
              </div>
              <div className="overflow-hidden pb-2">
                <span className="block space-heading-line text-noir-green">JUST A CAFE.</span>
              </div>
            </h2>
          </div>

          <div className="max-w-md pb-2">
            <p ref={textRef} className="text-lg md:text-xl font-light text-noir-muted leading-relaxed mb-8">
              A premium yet relaxed atmosphere. Whether you are grabbing a quick coffee or spending the afternoon by the courts, Noir is designed as a space to stay awhile.
            </p>
            
            <div ref={ctaRef}>
              <a 
                href="#visit" 
                className="inline-flex items-center gap-3 border-b border-noir-black pb-1 text-sm tracking-[0.2em] uppercase font-medium hover:text-noir-muted hover:border-noir-muted transition-colors duration-300"
              >
                FIND US &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* EDITORIAL MASONRY GALLERY */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-12 md:mt-16">

          {/* Image 1: Large Interior (Left) */}
          <div className="gallery-item-wrapper md:col-span-8 md:row-span-2 relative aspect-[4/3] md:aspect-auto h-auto md:h-[600px] overflow-hidden bg-noir-dark">
            <img className="gallery-item-image w-full h-full object-cover object-center" src="/assets/noir/ambience/interior.webp" alt="Noir Interior" />
          </div>

          {/* Image 2: Counter (Top Right) */}
          <div className="gallery-item-wrapper md:col-span-4 relative aspect-[3/4] md:aspect-auto h-auto md:h-[288px] overflow-hidden bg-noir-dark">
            <img className="gallery-item-image w-full h-full object-cover object-center" src="/assets/noir/ambience/counter.webp" alt="Noir Coffee Counter" />
          </div>

          {/* Image 3: Lifestyle (Middle Right) */}
          <div className="gallery-item-wrapper md:col-span-4 relative aspect-square md:aspect-auto h-auto md:h-[288px] overflow-hidden bg-noir-dark">
            <img className="gallery-item-image w-full h-full object-cover object-center" src="/assets/noir/ambience/lifestyle.webp" alt="Noir Lifestyle" />
          </div>

          {/* Image 4: Lifestyle02 (Bottom Left - Portrait) */}
          <div className="gallery-item-wrapper md:col-span-5 relative aspect-[4/5] md:aspect-auto h-auto md:h-[500px] overflow-hidden bg-noir-dark">
            <img className="gallery-item-image w-full h-full object-cover object-center" src="/assets/noir/ambience/lifestyle02.webp" alt="Noir Lifestyle Detail" />
          </div>

          {/* Image 5: Exterior (Bottom Right - Landscape) */}
          <div className="gallery-item-wrapper md:col-span-7 relative aspect-[16/9] md:aspect-auto h-auto md:h-[500px] overflow-hidden bg-noir-dark">
            <img className="gallery-item-image w-full h-full object-cover object-center" src="/assets/noir/hero/night.webp" alt="Noir Exterior" />
          </div>

        </div>

      </div>
    </section>
  );
};

export default SpaceExperience;
