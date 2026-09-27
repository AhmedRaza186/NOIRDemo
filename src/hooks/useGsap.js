import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// gsap.matchMedia only calls the setup while at least one condition matches, so the
// complementary mobile/desktop pair guarantees it always runs.
const CONDITIONS = {
  isMobile: '(max-width: 767px)',
  isDesktop: '(min-width: 768px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
};

// Runs a GSAP setup scoped to `scopeRef`. Selector strings resolve inside the scope,
// everything reverts on unmount, and the setup re-runs when the mobile breakpoint or
// motion preference changes. Skipped entirely under reduced motion unless opted in.
export function useGsap(setup, scopeRef, { allowReducedMotion = false } = {}) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef.current);
    mm.add(CONDITIONS, ({ conditions }) => {
      if (conditions.reduceMotion && !allowReducedMotion) return;
      setup(conditions);
    });
    return () => mm.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
