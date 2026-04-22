/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { CALENDAR } from '../constants.ts';

export function UpcomingRace({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const nextRace = CALENDAR.find(r => r.isNext) || CALENDAR[0];

  useEffect(() => {
    // Target date from the calendar or default
    const targetDateStr = nextRace.round === 6 ? '2026-05-02T19:00:00Z' : '2026-05-02T19:00:00Z';
    const target = new Date(targetDateStr).getTime();
    const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setTimeLeft({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-6 md:px-9 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-carbon text-white p-8 md:p-12 mt-4 relative overflow-hidden border-t-5 border-mercedes"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.022] pointer-events-none checker-bg" />
        <div className="absolute top-0 right-0 w-72 h-14 checker-bg opacity-10" />

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-3.5 mb-4">
              <span className="font-mono text-[10px] md:text-[11px] font-semibold tracking-widest uppercase text-mercedes px-2.5 py-1.5 border border-mercedes/50 bg-mercedes/10">
                ◆ Round {String(nextRace.round).padStart(2, '0')} · Up Next
              </span>
              <span className="text-2xl md:text-3xl">{nextRace.flag}</span>
            </div>
            <h2 className="font-serif text-[clamp(42px,6vw,76px)] font-bold leading-none tracking-tight mb-4">
              {nextRace.country} <span className="italic text-mercedes font-medium text-[0.8em]">{nextRace.circuit === 'Miami' ? 'Grand Prix' : 'Race'}</span>
            </h2>
            <div className="font-sans text-xs md:text-sm text-white/70 mb-1.5 tracking-wide">
              <strong className="text-white font-medium">{nextRace.location}</strong>
            </div>
            <div className="font-sans text-[11px] md:text-sm text-white/70">
              Round {nextRace.round} of 24 · {nextRace.laps} laps · {nextRace.distance}
            </div>

            <div className="flex flex-wrap gap-6 md:gap-9 mt-6 pt-5.5 border-t border-white/15">
              {[
                { label: 'Lap Record', val: '1:29.708' },
                { label: 'Pole 2025', val: theme === 'dark' ? 'M. Verstappen' : 'K. Antonelli' },
                { label: 'Dates', val: nextRace.date },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-mono text-[8px] md:text-[9px] tracking-widest uppercase text-white/50 mb-1.5">{stat.label}</span>
                  <span className="font-mono text-xs md:text-sm font-medium">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-mono text-[9px] md:text-[10px] tracking-[0.26em] uppercase text-white/55 mb-5 flex items-center gap-2.5">
              <span className="w-2 h-2 bg-mercedes rounded-full animate-pulse shadow-[0_0_8px_var(--color-mercedes)]" />
              Lights Out In
            </div>
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {[
                { val: timeLeft.d, label: 'Days' },
                { val: timeLeft.h, label: 'Hours' },
                { val: timeLeft.m, label: 'Mins' },
                { val: timeLeft.s, label: 'Secs' },
              ].map((unit, i) => (
                <div key={i} className="bg-black/35 p-3 md:p-4 text-center border border-mercedes/20">
                  <motion.div 
                    key={unit.val}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-mono text-[clamp(20px,4.2vw,48px)] font-bold text-white leading-none tracking-tighter tabular-nums"
                  >
                    {unit.val}
                  </motion.div>
                  <div className="font-mono text-[7px] md:text-[9px] tracking-widest uppercase text-mercedes mt-2 md:mt-3">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
