/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function Hero({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(`${g}, Pangerkumzuk`);

    const D = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const M = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    setDateStr(`${D[now.getDay()]} · ${String(now.getDate()).padStart(2,'0')} ${M[now.getMonth()]} · ${now.getFullYear()}`);
  }, []);

  const teamName = theme === 'dark' ? 'RBR' : 'MERC';
  const teamBase = theme === 'dark' ? 'Milton Keynes' : 'Brackley';
  const teamSlogan = theme === 'dark' ? 'Gives You Wings' : 'Power of the Arrows';

  return (
    <section className="bg-paper p-6 md:p-9 md:px-9 md:py-14 max-w-7xl mx-auto relative overflow-hidden transition-colors duration-500">
      {/* Enhanced Asphalt Speed lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[10, 18, 30, 42, 55, 68, 85].map((top, i) => (
          <motion.div
            key={i}
            initial={{ x: -400, opacity: 0 }}
            animate={{ 
              x: ['-20vw', '120vw'], 
              opacity: theme === 'dark' ? [0, 0.4, 0.8, 0.4, 0] : [0, 0.1, 0.2, 0.1, 0],
              scaleY: [1, 1.5, 1] 
            }}
            transition={{ 
              duration: 0.8 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "linear"
            }}
            className={`absolute h-[1px] md:h-[2px] w-[200px] md:w-[300px] bg-linear-to-r from-transparent ${i % 2 === 0 ? 'via-mercedes' : 'via-racing'} to-transparent blur-[1px]`}
            style={{ top: `${top}%` }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-7 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-3 md:gap-4 font-mono text-[9px] md:text-[11px] font-semibold tracking-[0.24em] uppercase text-ink mb-6 md:mb-0"
        >
          <motion.div 
            animate={{ skewX: [-5, 5, -5] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className={`w-8 h-5 md:w-10 md:h-6 checker-bg rounded-xs shadow-lg ${theme === 'dark' ? 'bg-black' : 'bg-mercedes/20'}`} 
          />
          <span className="blur-[0.2px]">Personal Edition · {teamName} 2026</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-left md:text-right"
        >
          <div className="font-serif italic text-sm md:text-base text-ink-2 mb-1">{greeting}</div>
          <div className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-ink-3">{dateStr}</div>
        </motion.div>
      </div>

      <div className="relative mb-6 md:mb-7 pb-5 md:pb-6 group">
        <h1 className="font-serif font-extrabold leading-[1] md:leading-[1.05] tracking-tight text-ink relative">
          {/* Kinetic vibration mask */}
          <span className="block overflow-hidden pb-1 relative">
            <motion.span 
              initial={{ y: '100%', skewX: -20 }}
              animate={{ y: 0, skewX: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.25, 1], delay: 0.4 }}
              className="block text-[clamp(36px,8.5vw,110px)] relative"
            >
              {/* Speed Trailing Ghosts (The "Track Effect") */}
              <motion.span 
                animate={{ x: [-2, 2, -2], opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.05, repeat: Infinity }}
                className="absolute inset-0 text-mercedes/30 translate-x-[-4px] blur-[2px] pointer-events-none"
              >
                Pangerkumzuk's
              </motion.span>
              <motion.span 
                animate={{ x: [2, -2, 2], opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.05, repeat: Infinity, delay: 0.025 }}
                className="absolute inset-0 text-racing/30 translate-x-[4px] blur-[2px] pointer-events-none"
              >
                Pangerkumzuk's
              </motion.span>
              
              <motion.span
                animate={{ 
                  x: [0, -0.5, 0.5, 0],
                  y: [0, 0.5, -0.5, 0]
                }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="relative block"
              >
                Pangerkumzuk's
              </motion.span>
            </motion.span>
          </span>

          <span className="block overflow-hidden pb-1">
            <motion.span 
              initial={{ y: '100%', filter: 'blur(10px)' }}
              animate={{ y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.25, 1], delay: 0.6 }}
              className="block text-[clamp(48px,10vw,126px)] italic bg-linear-to-r from-mercedes via-racing to-mercedes bg-clip-text text-transparent transform-gpu"
            >
              {theme === 'dark' ? 'Bull Pen.' : 'HQ Wall.'}
            </motion.span>
          </span>
        </h1>
        
        {/* Underline with kinetic energy */}
        <div className="absolute left-0 bottom-0 h-1 md:h-1.5 w-full bg-linear-to-r from-mercedes via-racing to-mercedes origin-left overflow-hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.3, 0.9, 0.3, 1], delay: 1 }}
            className="h-full w-full bg-white/10 absolute inset-0 mix-blend-overlay"
          />
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-20 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-ink-2 pt-5 border-t border-ink/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-racing text-white font-bold relative overflow-hidden group">
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            />
            <span className="w-2 h-2 bg-mercedes rounded-full animate-pulse" />
            {theme === 'dark' ? 'Oracle Cloud Sync' : 'Petronas Data Link'}
          </span>
          <div className="flex flex-col">
            <span className="text-[9px] text-mercedes font-bold leading-none mb-1 uppercase tracking-tighter">Status: {teamSlogan}</span>
            <span className="text-[10px] text-ink font-bold leading-none tracking-widest flex items-center gap-1.5">
              <div className="w-1 h-1 bg-racing rounded-full" />
              Direct {teamBase} Link
            </span>
          </div>
        </div>
        <div className="flex flex-col md:items-end text-left md:text-right">
          <span className="opacity-60 italic text-[9px] md:text-[11px] mb-1 text-ink-3">Telemetry: Peak Force · Aero-Efficiency: 0.024 Cd</span>
          <span className="text-[10px] font-bold text-mercedes/70 tracking-[0.3em] uppercase">{theme === 'dark' ? 'Titanium-Reinforced Logic' : 'Silver-Standard Precision'}</span>
        </div>
      </motion.div>
    </section>
  );
}

