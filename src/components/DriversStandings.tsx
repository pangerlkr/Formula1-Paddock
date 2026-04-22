/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { DRIVERS } from '../constants.ts';
import { DriverProfile } from './DriverProfile.tsx';
import { DriverComparison } from './DriverComparison.tsx';
import { Driver } from '../types.ts';
import { GitCompare, ChevronRight, X } from 'lucide-react';

export function DriversStandings({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const highlightColor = theme === 'dark' ? '#EF0107' : '#00A19C';
  const highlightTeam = theme === 'dark' ? 'Red Bull' : 'Mercedes';

  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 2 ? [...prev, id] : [id]
    );
  };

  const selectedForCompare = DRIVERS.filter(d => compareIds.includes(d.id));

  return (
    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink/10 relative">
      <div className="p-5.5 md:p-6 border-b-2 border-ink bg-paper sticky top-0 z-20">
        <div className="flex justify-between items-start mb-1.5">
          <div className="font-mono text-[9px] text-ink-3 tracking-[0.18em] font-medium">§ 01</div>
          <button 
            onClick={() => {
              setCompareMode(!compareMode);
              setCompareIds([]);
            }}
            className={`flex items-center gap-2 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider transition-all border ${compareMode ? 'bg-racing text-white border-racing' : 'bg-paper text-ink-3 border-ink/10 hover:border-ink hover:text-ink'}`}
          >
            <GitCompare size={10} />
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </button>
        </div>
        <h3 className="font-serif text-2xl font-bold tracking-tight text-ink leading-none">
          Drivers' <span className="italic text-racing font-medium">Championship</span>
        </h3>
        <div className="font-mono text-[9px] tracking-widest uppercase text-ink-3 mt-2.5">Top 10 · {theme === 'dark' ? 'Milton Keynes' : 'Brackley'} Sync · ⭐</div>
      </div>

      <div className="flex flex-col divide-y divide-ink/10">
        {DRIVERS.map((driver, i) => {
          const isCoreTeam = driver.team.includes(highlightTeam);
          const isSelectedForCompare = compareIds.includes(driver.id);

          return (
            <motion.div 
              key={driver.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 + i * 0.08 }}
              onClick={() => compareMode ? toggleCompare(driver.id) : setSelectedDriver(driver)}
              className={`
                grid grid-cols-[40px_1fr_auto] items-center gap-3 px-6 py-3.5 relative transition-all group overflow-hidden cursor-pointer
                ${driver.pos === 1 ? 'bg-linear-to-r from-mercedes/10 to-transparent' : 'hover:bg-paper-2'}
                ${isCoreTeam ? 'bg-linear-to-r from-racing/5' : ''}
                ${isSelectedForCompare ? 'ring-2 ring-inset ring-racing bg-paper-3 z-10' : ''}
              `}
            >
              {/* Status bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 transition-all" style={{ backgroundColor: driver.color }} />
              {isCoreTeam && <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: highlightColor }} />}

              <div className="font-mono text-sm font-bold text-ink-2 tabular-nums">
                {isSelectedForCompare ? (
                  <GitCompare size={14} className="text-racing" />
                ) : (
                  String(driver.pos).padStart(2, '0')
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-medium text-ink tracking-tight leading-none">
                    {driver.name}
                    {isCoreTeam && <span className="ml-1 text-[10px] text-racing opacity-70">⭐</span>}
                  </span>
                  <span 
                    className="font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider" 
                    style={{ 
                      backgroundColor: driver.color, 
                      color: '#fff',
                      filter: theme === 'light' ? 'brightness(0.9)' : 'none'
                    }}
                  >
                    {driver.code}
                  </span>
                </div>
                <div className="text-[11px] text-ink-3 font-normal mt-0.5">
                  {driver.team} · {driver.country} 
                  {driver.gap !== 0 && <span className="ml-2 font-mono text-[10px] font-medium text-ink-2"> {driver.gap}</span>}
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="font-mono text-xl font-bold text-ink tabular-nums leading-none">{driver.pts}</div>
                <div className="font-mono text-[8px] text-ink-3 tracking-widest uppercase mt-0.5">pts</div>
                {!compareMode && (
                  <div className="md:hidden group-hover:block absolute right-6 bottom-1 font-mono text-[6px] text-racing uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">View Profile</div>
                )}
              </div>
              
              {/* Leader badge */}
              {!isSelectedForCompare && driver.pos === 1 && (
                <div className="absolute right-[90px] top-1/2 -translate-y-1/2 font-mono text-[8px] font-bold text-mercedes tracking-widest bg-mercedes/10 px-1.5 py-0.5 border border-mercedes/20">P1</div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating Comparison Drawer Launcher */}
      <AnimatePresence>
        {compareMode && compareIds.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-md bg-paper border-2 border-ink shadow-2xl p-4 flex items-center justify-between"
          >
            <div className="flex gap-2">
              {selectedForCompare.map(d => (
                <div key={d.id} className="font-mono text-[10px] font-bold px-2 py-1 bg-ink text-paper flex items-center gap-2">
                  {d.code}
                  <button onClick={() => toggleCompare(d.id)} className="hover:text-racing"><X size={10} /></button>
                </div>
              ))}
              {compareIds.length < 2 && (
                <div className="font-mono text-[9px] text-ink-3 animate-pulse self-center">Select second driver...</div>
              )}
            </div>
            <button 
              disabled={compareIds.length < 1}
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 px-4 py-2 bg-racing text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-racing/90 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Compare
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <DriverProfile 
        driver={selectedDriver} 
        onClose={() => setSelectedDriver(null)} 
        theme={theme} 
      />

      <DriverComparison 
        isOpen={showComparison}
        drivers={selectedForCompare}
        onClose={() => setShowComparison(false)}
        theme={theme}
      />
      {showComparison && <style>{`body { overflow: hidden; }`}</style>}
    </div>
  );
}

