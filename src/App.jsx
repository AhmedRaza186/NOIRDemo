import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Intro from './components/layout/Intro';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import SippinBag from './components/sections/SippinBag';
import MenuExperience from './components/sections/MenuExperience';
import SpaceExperience from './components/sections/SpaceExperience';
import VisitNoir from './components/sections/VisitNoir';
import Footer from './components/layout/Footer';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [introMounted, setIntroMounted] = useState(true);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    // Only initialize Lenis after the app content is revealed
    if (!showApp) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Make sure scroll is locked while intro is playing
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, [showApp]);

  // Lock scroll initially
  useEffect(() => {
    if (introMounted) {
      document.body.style.overflow = 'hidden';
    }
  }, [introMounted]);

  return (
    <>
      {showApp && (
        <div className="relative min-h-screen w-full flex flex-col bg-noir-cream text-noir-black overflow-hidden">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Hero />
            <SippinBag />
            <MenuExperience />
            <SpaceExperience />
            <VisitNoir />
          </main>
          <Footer />
        </div>
      )}

      {introMounted && (
        <Intro 
          onReveal={() => setShowApp(true)} 
          onComplete={() => setIntroMounted(false)} 
        />
      )}
    </>
  );
}

export default App;
