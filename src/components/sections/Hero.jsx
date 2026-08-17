import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    // Initial Load Choreography
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // 1. Image reveal mask
      tl.fromTo(imageWrapperRef.current, 
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' }
      )
      // Subtle image scale
      .fromTo(imageRef.current,
        { scale: 1.1 },
        { scale: 1, duration: 2, ease: 'power2.out' },
        '-=1.5'
      )
      // 2. Headline stagger
      .fromTo('.hero-title-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.15 },
        '-=1.0'
      )
      // 3. Supporting text reveal
      .fromTo(descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      )
      // 4. Scroll indicator
      .fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.4'
      );

      // Subtle bobbing animation for scroll indicator
      gsap.to(scrollIndicatorRef.current.querySelector('svg'), {
        y: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 1.5,
        delay: 2
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[100svh] w-full flex flex-col lg:flex-row items-center justify-between"
    >
      {/* Left Col: Typography */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center z-10 px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:py-0">
        <h1 ref={titleRef} className="text-[4.5rem] md:text-[6rem] lg:text-[8rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-8">
          <div className="overflow-hidden pb-2">
            <span className="block hero-title-line">NOIR</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="block hero-title-line text-noir-green">CAFE &</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="block hero-title-line">PIZZERIA</span>
          </div>
        </h1>
        
        <div className="overflow-hidden max-w-md">
          <p ref={descRef} className="text-lg md:text-xl font-light text-noir-muted leading-relaxed">
            Handcrafted coffee. Slow-made pasta. Wood-fired pizza. 
            A curated culinary experience.
          </p>
        </div>
      </div>

      {/* Right Col: Image */}
      <div className="w-full lg:w-[45%] h-[50vh] lg:h-[100svh] relative">
        <div 
          ref={imageWrapperRef} 
          className="w-full h-full overflow-hidden relative bg-noir-dark"
          style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        >
          <img 
            ref={imageRef}
            src="/assets/noir/hero/hero-interior.webp" 
            alt="Noir Cafe & Pizzeria Atmosphere" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-6 md:bottom-12 left-6 md:left-12 lg:left-20 flex items-center gap-3 opacity-0 z-10"
      >
        <span className="label-text">DISCOVER</span>
        <ArrowDown size={16} strokeWidth={1.5} className="text-noir-black lg:text-current" />
      </div>
    </section>
  );
};

export default Hero;
