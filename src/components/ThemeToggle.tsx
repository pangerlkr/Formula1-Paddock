/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, ChevronRight } from 'lucide-react';

interface ThemeToggleProps {
  current: 'dark' | 'light';
  onToggle: (theme: 'dark' | 'light') => void;
}

export function ThemeToggle({ current, onToggle }: ThemeToggleProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', current);
  }, [current]);

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-2 md:gap-3 pointer-events-none">
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-paper border-2 border-ink p-1 md:p-1.5 shadow-2xl flex items-center gap-0.5 md:gap-1 pointer-events-auto"
      >
        <button
          onClick={() => onToggle('dark')}
          className={`
            flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all
            ${current === 'dark' ? 'bg-racing text-white shadow-lg' : 'text-ink/40 hover:text-ink'}
          `}
        >
          <Zap size={10} fill={current === 'dark' ? 'currentColor' : 'none'} className="md:w-3 md:h-3" />
          <span className="hidden xs:inline">Red Bull</span>
          <span className="xs:hidden">RBR</span>
        </button>
        <button
          onClick={() => onToggle('light')}
          className={`
            flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all
            ${current === 'light' ? 'bg-mercedes text-ink shadow-lg' : 'text-ink/40 hover:text-ink'}
          `}
        >
          <Shield size={10} fill={current === 'light' ? 'currentColor' : 'none'} className="md:w-3 md:h-3" />
          <span className="hidden xs:inline">Mercedes</span>
          <span className="xs:hidden">MERC</span>
        </button>
      </motion.div>
      
      <div className="font-mono text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-ink-3 bg-paper/80 backdrop-blur-sm px-2 py-0.5 md:py-1 border border-ink/10">
        Sync: {current === 'dark' ? 'RBR' : 'MERC'}
      </div>
    </div>
  );
}
