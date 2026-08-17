import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MenuExperience = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const menuCategoriesRef = useRef([]);
  const imageWrapperRef = useRef(null);
  const detailImageWrapperRef = useRef(null);

  const menuData = [
    {
      title: "PIZZAS",
      items: [
        { name: "Fajita", price: "1150" },
        { name: "BBQ", price: "1150" },
        { name: "Ranch Supreme", price: "1250" }
      ]
    },
    {
      title: "PASTA",
      items: [
        { name: "Fettuccine Alfredo", price: "1890" },
        { name: "Tuscan Tomato", price: "1990" }
      ]
    },
    {
      title: "COFFEE",
      items: [
        { name: "Cappuccino / Latte", price: "600" },
        { name: "Classics", price: "750" },
        { name: "House Special", price: "790" }
      ]
    },
    {
      title: "SIGNATURES",
      items: [
        { name: "Signature Frappe", price: "850" },
        { name: "Purely Iced Matcha", price: "990" }
      ]
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Heading reveal
      tl.fromTo('.menu-heading-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      )
      // Description reveal
      .fromTo('.menu-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      // Menu categories stagger reveal
      .fromTo(menuCategoriesRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.4'
      )
      // CTA reveal
      .fromTo('.menu-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      // Main image clip-path reveal
      .fromTo(imageWrapperRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' },
        '-=1.5'
      )
      // Secondary image clip-path reveal
      .fromTo(detailImageWrapperRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.2, ease: 'power3.inOut' },
        '-=1.0'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="menu"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-cream text-noir-black overflow-hidden border-t border-noir-border/30"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* LEFT: Typography & Menu */}
        <div className="w-full lg:w-[45%] flex flex-col z-10 pt-10 lg:pt-0">
          <div className="overflow-hidden mb-6">
            <span className="block label-text text-noir-muted menu-heading-line">THE MENU</span>
          </div>
          
          <h2 ref={headingRef} className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-8">
            <div className="overflow-hidden pb-2">
              <span className="block menu-heading-line">SOMETHING</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="block menu-heading-line">FOR EVERY</span>
            </div>
            <div className="overflow-hidden pb-2">
              <span className="block menu-heading-line text-noir-green">MOOD.</span>
            </div>
          </h2>
          
          <div className="max-w-md mb-16 overflow-hidden">
            <p className="text-lg md:text-xl font-light text-noir-muted leading-relaxed menu-desc">
              Inspired by comfort and flavor. Every dish is crafted to create moments worth savoring.
            </p>
          </div>

          {/* Curated Menu List */}
          <div className="flex flex-col gap-12 mb-16">
            {menuData.map((category, idx) => (
              <div 
                key={category.title} 
                ref={el => menuCategoriesRef.current[idx] = el}
                className="flex flex-col"
              >
                <h3 className="text-xl font-display uppercase tracking-widest text-noir-green mb-6 border-b border-noir-border/30 pb-2">
                  {category.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {category.items.map(item => (
                    <li key={item.name} className="flex items-end justify-between group cursor-default">
                      <span className="text-lg font-light group-hover:text-noir-green transition-colors duration-300 relative">
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-noir-green group-hover:w-full transition-all duration-300"></span>
                      </span>
                      <div className="flex-grow border-b border-dotted border-noir-border/50 mx-4 mb-2 opacity-50"></div>
                      <span className="text-lg font-medium">Rs. {item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="menu-cta self-start">
            <a 
              href="/NOIR - Final Menu.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-noir-black px-6 py-3 text-sm tracking-[0.2em] uppercase font-medium hover:bg-noir-black hover:text-noir-cream transition-colors duration-300"
            >
              VIEW FULL MENU &rarr;
            </a>
          </div>
        </div>

        {/* RIGHT: Visual Composition */}
        <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="w-full md:w-[80%] lg:w-[90%] relative h-[60vh] lg:h-[100%] min-h-[500px]">
            {/* Main Image */}
            <div 
              ref={imageWrapperRef} 
              className="absolute top-0 right-0 w-full lg:w-[85%] h-[75%] lg:h-[80%] overflow-hidden bg-noir-dark group"
            >
              <img 
                src="/assets/noir/food/pizza.webp" 
                alt="Noir Wood-fired Pizza" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Overlapping Secondary Image */}
            <div 
              ref={detailImageWrapperRef}
              className="absolute bottom-0 left-0 lg:-left-12 w-[60%] lg:w-[55%] aspect-square border-8 border-noir-cream overflow-hidden z-20 shadow-xl group"
            >
              <img 
                src="/assets/noir/food/coffee.jpg" 
                alt="Noir Signature Coffee" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MenuExperience;
