import { useRef } from 'react';
import gsap from 'gsap';
import { useGsap } from '../../hooks/useGsap';
import { ADDRESS, HOURS, MAPS_EMBED_URL, MAPS_URL, PHONE_DISPLAY, WHATSAPP_URL } from '../../data/contact';
import OpenBadge from '../ui/OpenBadge';

const VisitNoir = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useGsap(({ isMobile }) => {
    // 1. Entrance Animations for Content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    // Staggered reveal for text elements
    tl.fromTo('.visit-reveal',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );

    // 2. Scroll-Driven Image/Map Animation

    const scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'center center',
        scrub: 1.5
      }
    });

    // Subtle clip-path reveal for the map container
    scrubTl.fromTo(imageWrapperRef.current,
      { clipPath: isMobile ? 'inset(0% 0% 0% 0%)' : 'inset(10% 0% 10% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
      0
    );
  }, sectionRef);

  return (
    <section 
      ref={sectionRef} 
      id="visit"
      className="surface-brand relative min-h-[90vh] w-full flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-green text-noir-cream overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        
        {/* LEFT: Typography & Contact Info */}
        <div ref={contentRef} className="w-full lg:w-[45%] flex flex-col z-10 pt-10 lg:pt-0">
          
          <div className="overflow-hidden mb-6 visit-reveal">
            <span className="block label-text text-noir-cream/60 tracking-[0.2em] text-sm uppercase">VISIT NOIR</span>
          </div>
          
          <h2 className="text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-12 visit-reveal">
            COME FIND US.
          </h2>

          <div className="flex flex-col gap-10">
            {/* Location & Address */}
            <div className="flex flex-col gap-2 visit-reveal">
              <h3 className="text-sm tracking-[0.2em] uppercase text-noir-cream/60 mb-1">LOCATION</h3>
              <p className="text-xl md:text-2xl font-light">{ADDRESS.street}</p>
              <p className="text-base md:text-lg font-light text-noir-cream/80 max-w-[280px]">
                {ADDRESS.plot}, {ADDRESS.city}, {ADDRESS.country}
              </p>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-2 visit-reveal">
              <h3 className="text-sm tracking-[0.2em] uppercase text-noir-cream/60 mb-1">HOURS</h3>
              <p className="text-xl md:text-2xl font-light">{HOURS.time}</p>
              <p className="text-base md:text-lg font-light text-noir-cream/80">{HOURS.days}</p>
              <OpenBadge className="text-noir-cream/70 mt-2" />
            </div>

            {/* Phone / WhatsApp */}
            <div className="flex flex-col gap-2 visit-reveal">
              <h3 className="text-sm tracking-[0.2em] uppercase text-noir-cream/60 mb-1">PHONE / WHATSAPP</h3>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-light hover:text-white transition-colors duration-300">
                {PHONE_DISPLAY}
              </a>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 mt-6 visit-reveal">
              <a 
                href={MAPS_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-noir-cream px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-noir-cream hover:text-noir-green transition-colors duration-300"
              >
                GET DIRECTIONS &rarr;
              </a>
              <a 
                href={WHATSAPP_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border-b border-transparent hover:border-noir-cream px-4 py-4 text-sm tracking-[0.2em] uppercase font-medium text-noir-cream/80 hover:text-noir-cream transition-colors duration-300"
              >
                ORDER / WHATSAPP
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Map Visual Composition */}
        <div className="w-full lg:w-[50%] relative flex justify-end h-[50vh] md:h-[60vh] lg:h-[85vh] min-h-[500px]">
          <div 
            ref={imageWrapperRef} 
            className="w-full h-full relative overflow-hidden bg-noir-dark filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700"
          >
            <iframe 
              src={MAPS_EMBED_URL}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Noir Cafe Location Map"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VisitNoir;
