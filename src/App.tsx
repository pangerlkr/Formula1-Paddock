/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticker } from './components/Ticker.tsx';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from './components/Hero.tsx';
import { UpcomingRace } from './components/UpcomingRace.tsx';
import { SeasonCalendar } from './components/SeasonCalendar.tsx';
import { DriversStandings } from './components/DriversStandings.tsx';
import { ConstructorsStandings } from './components/ConstructorsStandings.tsx';
import { PaddockIntel } from './components/PaddockIntel.tsx';
import { TechnicalBrief } from './components/TechnicalBrief.tsx';
import { StatsRibbon } from './components/StatsRibbon.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';
import { RefreshCw } from 'lucide-react';
import { f1Service } from './services/f1Service.ts';

import { Footer } from './components/Footer.tsx';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [syncInfo, setSyncInfo] = useState<{ timestamp: number; latency: number } | null>(null);

  useEffect(() => {
    const checkSync = () => {
      const saved = localStorage.getItem('f1_live_sync');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.timestamp) {
            setSyncInfo({ 
              timestamp: data.timestamp, 
              latency: data.latency || 0 
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    
    checkSync();
    
    // Auto-sync every 30s
    const syncInterval = setInterval(() => {
      f1Service.syncLiveData();
    }, 30000);

    window.addEventListener('f1_live_sync_completed', checkSync);
    return () => {
      window.removeEventListener('f1_live_sync_completed', checkSync);
      clearInterval(syncInterval);
    };
  }, []);

  const formatLastSync = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={`min-h-screen paper-grain transition-colors duration-500 pb-24 md:pb-0 relative`}>
      <ThemeToggle current={theme} onToggle={setTheme} />
      <Ticker theme={theme} />
      
      <main className="space-y-12 md:space-y-0">
        <Hero theme={theme} />
        
        <UpcomingRace theme={theme} />
        
        <SeasonCalendar theme={theme} />

        {/* Main Grid Standings */}
        <section className="max-w-7xl mx-auto px-6 md:px-9 mt-14 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 border-2 border-ink bg-paper shadow-[0_30px_70px_-20px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ring-1 ring-ink/5"
          >
            <DriversStandings theme={theme} />
            <ConstructorsStandings theme={theme} />
            <PaddockIntel theme={theme} />
          </motion.div>
        </section>

        <TechnicalBrief theme={theme} />

        <StatsRibbon theme={theme} />
      </main>

      <Footer theme={theme} />

      {/* Sync Status Indicator */}
      <AnimatePresence>
        {syncInfo && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none hidden md:block"
          >
            <div className="flex items-center gap-4 px-4 py-3 bg-paper border-2 border-ink shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-xs group overflow-hidden relative">
              {/* Background scanning effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-racing/5 to-transparent skew-x-12 translate-x-1/2"
              />
              
              <div className="relative">
                <RefreshCw size={14} className="text-racing animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 bg-racing/20 rounded-full animate-ping scale-150" />
              </div>

              <div className="flex flex-col relative">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[9px] text-ink font-black uppercase tracking-widest bg-ink text-paper px-1.5 py-0.5">
                    Live Link
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${syncInfo.latency < 50 ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                </div>
                <div className="flex items-baseline gap-3">
                   <span className="font-mono text-[10px] text-ink font-bold tabular-nums">
                     {formatLastSync(syncInfo.timestamp)}
                   </span>
                   <span className="font-mono text-[8px] text-ink-3 uppercase font-medium">
                     {syncInfo.latency}ms Latency
                   </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

