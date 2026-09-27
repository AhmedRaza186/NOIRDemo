import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const INTERACTIVE = 'a, button, [role="button"], label, summary';
const NATIVE_CURSOR = 'input, textarea, select, iframe';

// Custom follower cursor for mouse users. Grows over links and buttons, and shows a
// label over elements with `data-cursor="LABEL"`. Off for touch and reduced motion.
const Cursor = () => {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const [enabled] = useState(() =>
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    let placed = false;

    const onMove = (e) => {
      if (!placed) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        placed = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest('[data-cursor]');

      if (target?.closest(NATIVE_CURSOR)) {
        cursor.dataset.state = 'hidden';
      } else if (labelled) {
        labelRef.current.textContent = labelled.dataset.cursor;
        cursor.dataset.state = 'label';
      } else if (target?.closest(INTERACTIVE)) {
        cursor.dataset.state = 'link';
      } else {
        cursor.dataset.state = 'default';
      }
    };

    const onLeave = () => { cursor.dataset.state = 'hidden'; };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      root.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="noir-cursor" data-state="hidden" aria-hidden="true">
      <span ref={labelRef} className="noir-cursor-label" />
    </div>
  );
};

export default Cursor;
