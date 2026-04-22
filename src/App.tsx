/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticker } from './components/Ticker.tsx';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Hero } from './components/Hero.tsx';
import { UpcomingRace } from './components/UpcomingRace.tsx';
import { SeasonCalendar } from './components/SeasonCalendar.tsx';
import { DriversStandings } from './components/DriversStandings.tsx';
import { ConstructorsStandings } from './components/ConstructorsStandings.tsx';
import { PaddockIntel } from './components/PaddockIntel.tsx';
import { StatsRibbon } from './components/StatsRibbon.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';

import { Footer } from './components/Footer.tsx';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className={`min-h-screen paper-grain transition-colors duration-500 pb-24 md:pb-0`}>
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

        <StatsRibbon theme={theme} />
      </main>

      <Footer theme={theme} />
    </div>
  );
}

