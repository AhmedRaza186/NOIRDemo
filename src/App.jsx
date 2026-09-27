import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from './lib/lenis';
import Intro from './components/layout/Intro';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import SippinBag from './components/sections/SippinBag';
import MenuExperience from './components/sections/MenuExperience';
import SpaceExperience from './components/sections/SpaceExperience';
import Signatures from './components/sections/Signatures';
import Courts from './components/sections/Courts';
import VisitNoir from './components/sections/VisitNoir';
import Footer from './components/layout/Footer';
import CartDrawer from './components/order/CartDrawer';
import CartButton from './components/order/CartButton';
import Cursor from './components/ui/Cursor';

const INTRO_SEEN_KEY = 'noir:intro-seen';

const hasSeenIntro = () => {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

function App() {
  // The intro plays once per browser session
  const [skipIntro] = useState(hasSeenIntro);
  const [showApp, setShowApp] = useState(skipIntro);
  const [introMounted, setIntroMounted] = useState(!skipIntro);

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (!showApp) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Anchor jumps honour each section's scroll-margin-top (index.css) to clear the navbar
      anchors: true,
      respectReducedMotion: true,
      autoRaf: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    if (!skipIntro) window.scrollTo(0, 0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [showApp, skipIntro]);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Storage unavailable (private mode) — intro simply plays again next visit
    }
    setIntroMounted(false);
  };

  return (
    <>
      {showApp && (
        <div className="relative min-h-screen w-full flex flex-col bg-noir-cream text-noir-black overflow-hidden">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Hero />
            <SippinBag />
            <MenuExperience />
            <Signatures />
            <SpaceExperience />
            <Courts />
            <VisitNoir />
          </main>
          <Footer />
          <CartButton />
          <CartDrawer />
        </div>
      )}

      <Cursor />

      {introMounted && (
        <Intro
          onReveal={() => setShowApp(true)}
          onComplete={handleIntroComplete}
        />
      )}
    </>
  );
}

export default App;
