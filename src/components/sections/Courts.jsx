import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGsap } from '../../hooks/useGsap';
import { useKarachiMinutes } from '../../hooks/useKarachiMinutes';
import { CLOSE_AT, OPEN_AT } from '../../data/contact';
import { TIME_ZONE, formatSlot } from '../../lib/time';
import { openWhatsApp } from '../../lib/whatsapp';

const DAY_MS = 24 * 60 * 60 * 1000;
const LAST_CALL = CLOSE_AT + 24 * 60; // closing time on the session's timeline (4 AM = 28:00)
const SLOTS = Array.from({ length: (LAST_CALL - OPEN_AT) / 60 }, (_, i) => OPEN_AT + i * 60);
const DURATIONS = [60, 90];
const PLAYERS = [2, 4];

const shortDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, weekday: 'short', day: 'numeric' });
const fullDay = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short' });

// A "session" runs 5 PM to 4 AM, so 1 AM still belongs to last night's session
const getSessions = (minutes) => {
  const start = Date.now() - (minutes < CLOSE_AT ? DAY_MS : 0);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start + i * DAY_MS);
    return {
      label: i === 0 ? 'Tonight' : i === 1 ? 'Tomorrow' : shortDay.format(date),
      date: fullDay.format(date),
    };
  });
};

const chipClass = (selected, disabled) => {
  if (disabled) return 'border-noir-cream/10 text-noir-cream/25 line-through cursor-not-allowed';
  return selected
    ? 'border-noir-cream bg-noir-cream text-noir-black'
    : 'border-noir-cream/25 hover:border-noir-cream';
};

const Courts = () => {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const detailRef = useRef(null);
  const minutes = useKarachiMinutes();

  const [sessionIndex, setSessionIndex] = useState(0);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [players, setPlayers] = useState(PLAYERS[1]);

  const sessions = getSessions(minutes);
  const nowOnTimeline = minutes < CLOSE_AT ? minutes + 24 * 60 : minutes;
  const isAvailable = (start) =>
    start + duration <= LAST_CALL && (sessionIndex > 0 || start > nowOnTimeline);
  const availableSlots = SLOTS.filter(isAvailable);
  const selectedSlot = slot !== null && isAvailable(slot) ? slot : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSlot === null) return;
    const session = sessions[sessionIndex];
    openWhatsApp([
      'Hi NOIR! I would like to book a padel court.',
      '',
      `Date: ${session.label} (${session.date})`,
      `Time: ${formatSlot(selectedSlot)}`,
      `Duration: ${duration} min`,
      `Players: ${players}`,
      '',
      'Please confirm availability.',
    ].join('\n'));
  };

  useGsap(({ isMobile }) => {
    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
    })
    .fromTo('.courts-heading-line',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
    )
    .fromTo('.courts-reveal',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      '-=0.6'
    );

    const scrubTl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'center center', scrub: 1.5 }
    });

    scrubTl.fromTo(imageWrapperRef.current,
      { clipPath: isMobile ? 'inset(0% 0% 0% 0%)' : 'inset(12% 0% 12% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
      0
    )
    .fromTo(imageWrapperRef.current.querySelector('img'),
      { scale: isMobile ? 1.05 : 1.15 },
      { scale: 1, ease: 'none' },
      0
    );

    if (!isMobile) {
      scrubTl.fromTo(detailRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power1.out' }, 0.1);
    }
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="courts"
      className="surface-brand relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-noir-black text-noir-cream overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

        {/* LEFT: Visual Composition */}
        <div className="w-full lg:w-[48%] relative h-[60vh] lg:h-[85vh] min-h-[480px]">
          <div ref={imageWrapperRef} className="w-full md:w-[85%] h-full overflow-hidden bg-noir-dark">
            <img loading="lazy" decoding="async" src="/assets/noir/hero/hero-paddle.webp" alt="Floodlit padel court beside the Noir terrace" className="w-full h-full object-cover object-center" />
          </div>
          <div ref={detailRef} className="hidden md:block absolute -bottom-10 right-0 w-[45%] aspect-[4/5] border-8 border-noir-black overflow-hidden shadow-2xl">
            <img loading="lazy" decoding="async" src="/assets/noir/hero/hero-paddle02.webp" alt="Café seating looking out onto the courts" className="w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* RIGHT: Copy & Booking */}
        <div className="w-full lg:w-[46%] flex flex-col">
          <div className="overflow-hidden mb-6">
            <span className="block text-xs uppercase tracking-widest font-medium text-noir-cream/60 courts-heading-line">THE COURTS</span>
          </div>
          <h2 className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-display font-medium leading-[0.85] tracking-tight uppercase mb-8">
            <span className="block overflow-hidden pb-2">
              <span className="block courts-heading-line">PLAY.</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block courts-heading-line text-white/60">THEN SIP.</span>
            </span>
          </h2>
          <p className="courts-reveal max-w-md text-lg font-light text-noir-cream/70 leading-relaxed mb-12">
            Floodlit padel courts right beside the café, open until late. Book a match, then settle in for wood-fired pizza and a Sippin' Bag.
          </p>

          <form onSubmit={handleSubmit} className="courts-reveal flex flex-col gap-8">
            {/* Day */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest text-noir-cream/60 mb-3">Day</legend>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap">
                {sessions.map((session, i) => (
                  <button key={session.date} type="button" onClick={() => setSessionIndex(i)} aria-pressed={sessionIndex === i}
                    className={`shrink-0 border px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${chipClass(sessionIndex === i, false)}`}>
                    {session.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Time */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest text-noir-cream/60 mb-3">Start time</legend>
              {availableSlots.length === 0 ? (
                <p className="text-sm font-light text-noir-cream/60">No slots left tonight. Pick another day.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {SLOTS.map((start) => {
                    const disabled = !isAvailable(start);
                    return (
                      <button key={start} type="button" disabled={disabled} onClick={() => setSlot(start)} aria-pressed={selectedSlot === start}
                        className={`border py-2.5 text-xs tracking-[0.1em] uppercase tabular-nums transition-colors duration-300 ${chipClass(selectedSlot === start, disabled)}`}>
                        {formatSlot(start)}
                      </button>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {/* Duration & players */}
            <div className="grid grid-cols-2 gap-6">
              <fieldset>
                <legend className="text-xs uppercase tracking-widest text-noir-cream/60 mb-3">Duration</legend>
                <div className="flex gap-2">
                  {DURATIONS.map((value) => (
                    <button key={value} type="button" onClick={() => setDuration(value)} aria-pressed={duration === value}
                      className={`flex-1 border py-2.5 text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${chipClass(duration === value, false)}`}>
                      {value} min
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-xs uppercase tracking-widest text-noir-cream/60 mb-3">Players</legend>
                <div className="flex gap-2">
                  {PLAYERS.map((value) => (
                    <button key={value} type="button" onClick={() => setPlayers(value)} aria-pressed={players === value}
                      className={`flex-1 border py-2.5 text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${chipClass(players === value, false)}`}>
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button type="submit" disabled={selectedSlot === null}
                className="inline-flex items-center justify-center gap-3 border border-noir-cream px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-noir-cream hover:text-noir-black transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none">
                REQUEST ON WHATSAPP &rarr;
              </button>
              <p className="text-xs font-light text-noir-cream/50">
                {selectedSlot === null ? 'Pick a start time to continue.' : `${sessions[sessionIndex].label}, ${formatSlot(selectedSlot)} · ${duration} min · ${players} players`}
              </p>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Courts;
