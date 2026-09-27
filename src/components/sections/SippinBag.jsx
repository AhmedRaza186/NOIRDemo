import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGsap } from '../../hooks/useGsap';
import { useCart } from '../../state/cart';
import { SIPPIN_FLAVORS } from '../../data/menu';
import { formatPrice } from '../../lib/format';
import ErrorBoundary from '../three/ErrorBoundary';

// three.js only downloads when the 360° view is first requested
const load3D = () => import('../three/SippinBag3D');
const SippinBag3D = lazy(load3D);

const PHOTOS = [
  { id: 'hero', src: '/assets/noir/sippin-bag/sippin-bag-hero.jpg', alt: "Three Sippin' Bags on a rooftop ledge" },
  { id: 'variants', src: '/assets/noir/sippin-bag/sippin-bag-variants.jpg', alt: "Matcha, blueberry and strawberry Sippin' Bags" },
  { id: 'detail', src: '/assets/noir/sippin-bag/sippin-bag-detail.jpg', alt: "Close-up of a Sippin' Bag with a glass straw" },
  { id: 'lifestyle', src: '/assets/noir/sippin-bag/sippin-bag-lifestyle.jpg', alt: "Sippin' Bag held by the pool" },
  { id: 'collab', src: '/assets/noir/sippin-bag/sippin-bag-collab.jpg', alt: "Coffee Sippin' Bags on a Noir table mat" },
];

const VIEW_3D = '3d';

const SippinBag = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);

  const { quantities, add } = useCart();
  const [view, setView] = useState(PHOTOS[0].id);
  const [flavor, setFlavor] = useState(SIPPIN_FLAVORS[0]);
  const [has3D, setHas3D] = useState(false);
  const [inView, setInView] = useState(false);
  const qty = quantities[flavor.id] || 0;

  const show3D = () => {
    setHas3D(true);
    setView(VIEW_3D);
  };

  const selectFlavor = (next) => {
    setFlavor(next);
    show3D();
  };

  // Only render the 3D scene while the frame is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(imageWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useGsap(({ isMobile }) => {
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
    // Flavours & CTA fade in
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    // Thumbnail rail
    .fromTo('.sippin-thumb',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
      '-=0.4'
    );

    // --- SCROLL-DRIVEN ENHANCEMENTS ---
    const startScale = isMobile ? 1.05 : 1.18;
    const startY = isMobile ? 0 : 4;
    const startClip = isMobile ? 'inset(0% 0% 0% 0%)' : 'inset(15% 0% 15% 0%)';

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', // Start as soon as the section enters the bottom of the screen
        end: 'center center', // Fully revealed when the section is centered
        scrub: 1.5
      }
    })
    // 1. Frame clip-path reveal
    .fromTo(imageWrapperRef.current,
      { clipPath: startClip },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
      0
    )
    // 2. Photo scale & parallax zoom
    .fromTo(imageRef.current,
      { scale: startScale, yPercent: startY },
      { scale: 1, yPercent: 0, ease: 'none' },
      0
    );
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="sippin-bag"
      className="relative min-h-[90svh] w-full flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-cream text-noir-black overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

        {/* LEFT: Typography & Content */}
        <div className="w-full lg:w-[45%] flex flex-col z-10 pt-10 lg:pt-0 order-2 lg:order-1">
          <div className="overflow-hidden mb-6">
            <span className="block label-text text-noir-muted sippin-heading-line">SIGNATURE EXPERIENCE</span>
          </div>

          <h2 className="text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-8">
            <span className="block overflow-hidden pb-2">
              <span className="block sippin-heading-line">THE</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block sippin-heading-line text-noir-green">SIPPIN' BAG</span>
            </span>
          </h2>

          <div className="max-w-md mb-10">
            <p ref={textRef} className="text-lg md:text-xl font-light text-noir-muted leading-relaxed">
              Elevating the takeaway culture. Our signature Sippin' Bag combines premium craft beverages with an iconic, portable aesthetic designed for the modern lifestyle.
            </p>
          </div>

          <div ref={ctaRef} className="flex flex-col gap-8">
            {/* Flavour picker */}
            <div onPointerEnter={load3D} onFocus={load3D}>
              <p className="label-text mb-4">Choose your pour</p>
              <div className="flex flex-wrap gap-3">
                {SIPPIN_FLAVORS.map((option) => {
                  const selected = option.id === flavor.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectFlavor(option)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2.5 border px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${selected ? 'border-noir-black bg-noir-black text-noir-cream' : 'border-noir-border hover:border-noir-black'}`}
                    >
                      <span className="size-3 rounded-full" style={{ background: `linear-gradient(to top, ${option.syrup} 50%, ${option.milk} 50%)` }} />
                      {option.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                onClick={() => add(flavor.id)}
                className="inline-flex items-center gap-3 bg-noir-green text-noir-cream px-6 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity duration-300"
              >
                ADD {flavor.name} · {formatPrice(flavor.price)}
              </button>
              {qty > 0 && (
                <span className="label-text" aria-live="polite">{qty} in your order</span>
              )}
            </div>

            <a
              href="#space"
              className="self-start inline-flex items-center gap-3 border-b border-noir-black pb-1 text-sm tracking-[0.2em] uppercase font-medium hover:text-noir-muted hover:border-noir-muted transition-colors duration-300"
            >
              EXPLORE THE SPACE &rarr;
            </a>
          </div>
        </div>

        {/* RIGHT: Visual Composition */}
        <div className="w-full lg:w-[55%] flex flex-col items-end gap-4 order-1 lg:order-2">
          {/* Main frame: photos or live 3D */}
          <div
            ref={imageWrapperRef}
            className="w-full md:w-[85%] h-[55vh] lg:h-[68vh] relative overflow-hidden bg-noir-dark"
          >
            <div ref={imageRef} className="absolute inset-0">
              {PHOTOS.map((photo) => (
                <img
                  key={photo.id}
                  loading="lazy"
                  decoding="async"
                  src={photo.src}
                  alt={photo.alt}
                  aria-hidden={view !== photo.id}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${view === photo.id ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>

            {has3D && (
              <div className={`absolute inset-0 bg-gradient-to-b from-noir-border to-noir-cream transition-opacity duration-700 ${view === VIEW_3D ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <ErrorBoundary fallback={<p className="absolute inset-0 flex items-center justify-center label-text">3D preview unavailable on this device</p>}>
                  <Suspense fallback={<p className="absolute inset-0 flex items-center justify-center label-text">Loading 360° view…</p>}>
                    <SippinBag3D flavor={flavor} active={inView && view === VIEW_3D} />
                  </Suspense>
                </ErrorBoundary>
                <span className="absolute bottom-4 left-4 label-text pointer-events-none">Drag to rotate · {flavor.name}</span>
              </div>
            )}
          </div>

          {/* View picker */}
          <div className="w-full md:w-[85%] flex gap-3 overflow-x-auto no-scrollbar" role="group" aria-label="Sippin' Bag views">
            <button
              type="button"
              onClick={show3D}
              onPointerEnter={load3D}
              onFocus={load3D}
              aria-pressed={view === VIEW_3D}
              aria-label="360° view"
              className={`sippin-thumb shrink-0 w-16 h-20 flex items-center justify-center bg-noir-green text-noir-cream text-xs tracking-[0.1em] font-medium transition-opacity duration-300 ${view === VIEW_3D ? 'ring-2 ring-noir-black ring-offset-2 ring-offset-noir-cream' : 'opacity-70 hover:opacity-100'}`}
            >
              360°
            </button>
            {PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setView(photo.id)}
                aria-pressed={view === photo.id}
                aria-label={photo.alt}
                className={`sippin-thumb shrink-0 w-16 h-20 overflow-hidden bg-noir-dark transition-opacity duration-300 ${view === photo.id ? 'ring-2 ring-noir-black ring-offset-2 ring-offset-noir-cream' : 'opacity-60 hover:opacity-100'}`}
              >
                <img loading="lazy" decoding="async" src={photo.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SippinBag;
