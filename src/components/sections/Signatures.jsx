import { useRef } from 'react';
import gsap from 'gsap';
import { useGsap } from '../../hooks/useGsap';
import { useCart } from '../../state/cart';
import { ITEMS_BY_ID, SIGNATURE_DISHES } from '../../data/menu';
import { formatPrice } from '../../lib/format';
import AddToOrder from '../ui/AddToOrder';

// Pinned horizontal strip on desktop; a native swipe row on mobile and under reduced motion
const Signatures = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const { add } = useCart();

  useGsap(({ isMobile }) => {
    // Heading reveal
    gsap.fromTo('.sig-heading-line',
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
      }
    );

    if (isMobile) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    const distance = () => track.scrollWidth - viewport.clientWidth;

    // Hand horizontal movement to the scroll-linked tween instead of native overflow
    gsap.set(viewport, { overflowX: 'visible' });

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        pinSpacing: true, // must be explicit: ScrollTrigger disables it when the parent (<main>) is flex
        scrub: 1,
        invalidateOnRefresh: true,
      }
    })
    .to(track, { x: () => -distance(), ease: 'none' }, 0)
    .fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="signatures"
      className="relative w-full md:h-screen flex flex-col justify-center py-24 md:pt-36 md:pb-6 bg-noir-cream text-noir-black overflow-hidden border-t border-noir-border/30"
    >
      {/* Header */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-8">
        <div>
          <div className="overflow-hidden mb-4">
            <span className="block label-text sig-heading-line">SIGNATURES</span>
          </div>
          <h2 className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-display font-medium leading-[0.85] tracking-tight uppercase">
            <span className="block overflow-hidden pb-2">
              <span className="block sig-heading-line">THE ONES</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block sig-heading-line text-noir-green">WE'RE KNOWN FOR.</span>
            </span>
          </h2>
        </div>
        <p className="max-w-xs text-base font-light text-noir-muted">
          Tap a dish to add it to your order. We'll confirm everything on WhatsApp.
        </p>
      </div>

      {/* Track */}
      <div ref={viewportRef} className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-6 md:snap-none">
        <ol ref={trackRef} className="flex w-max gap-5 md:gap-8 px-6 md:px-12 lg:px-20">
          {SIGNATURE_DISHES.map((dish, i) => {
            const item = ITEMS_BY_ID[dish.id];
            return (
              <li key={dish.id} className="snap-start shrink-0 w-[75vw] sm:w-[320px] md:w-[calc((100vh-620px)*0.8)] md:min-w-[192px] flex flex-col">
                <button
                  type="button"
                  onClick={() => add(dish.id)}
                  data-cursor="+ ADD"
                  aria-label={`Add ${item.orderName} to order`}
                  className="relative block w-full aspect-[4/5] md:aspect-auto md:h-[calc(100vh-620px)] md:min-h-[240px] overflow-hidden bg-noir-dark group"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={dish.image}
                    alt=""
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 text-xs tracking-[0.2em] font-medium text-white mix-blend-difference tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>

                {/* Stacked so the stepper never competes with the dish name for width */}
                <div className="pt-5 flex flex-col flex-grow">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="label-text">{dish.tag}</p>
                    <span className="text-base font-medium tabular-nums whitespace-nowrap">{formatPrice(item.price)}</span>
                  </div>
                  <h3 className="text-2xl font-display uppercase leading-tight mt-1 break-words">{item.orderName}</h3>
                  <p className="text-sm font-light text-noir-muted mt-2 line-clamp-2">{dish.blurb}</p>
                  <div className="mt-auto pt-4">
                    <AddToOrder id={dish.id} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Progress */}
      <div className="hidden md:block w-full max-w-[1440px] mx-auto px-12 lg:px-20 mt-8">
        <div className="h-px w-full bg-noir-border">
          <div ref={progressRef} className="h-px w-full bg-noir-black origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </section>
  );
};

export default Signatures;
