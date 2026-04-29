/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { DRIVERS } from '../constants.ts';
import { DriverProfile } from './DriverProfile.tsx';
import { DriverComparison } from './DriverComparison.tsx';
import { Driver } from '../types.ts';
import { GitCompare, ChevronRight, X, RefreshCw, Loader2 } from 'lucide-react';
import { fetchFullLiveSync } from '../services/geminiService.ts';
import { f1Service } from '../services/f1Service.ts';

const getFlag = (countryCode: string) => {
  const flags: Record<string, string> = {
    'ITA': '🇮🇹',
    'GBR': '🇬🇧',
    'MON': '🇲🇨',
    'AUS': '🇦🇺',
    'NED': '🇳🇱',
    'FRA': '🇫🇷',
    'ESP': '🇪🇸',
    'MEX': '🇲🇽',
    'CAN': '🇨🇦',
    'JPN': '🇯🇵',
    'USA': '🇺🇸',
    'DEU': '🇩🇪',
    'AUT': '🇦🇹',
    'FIN': '🇫🇮',
    'THA': '🇹🇭',
    'BRA': '🇧🇷',
    'CHN': '🇨🇳',
    'DNK': '🇩🇰',
  };
  return flags[countryCode] || '';
};

export function DriversStandings({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveDrivers, setLiveDrivers] = useState<Partial<Driver>[]>([]);

  const [selectedNationality, setSelectedNationality] = useState<string | null>(null);

  useEffect(() => {
    const savedSync = localStorage.getItem('f1_live_sync');
    if (savedSync) {
      try {
        const data = JSON.parse(savedSync);
        if (data.drivers) setLiveDrivers(data.drivers);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const nationalities = Array.from(new Set(DRIVERS.map(d => d.country))).sort();

  const filteredDrivers = DRIVERS.filter(d => 
    !selectedNationality || d.country === selectedNationality
  );

  const mergedDrivers = filteredDrivers.map(d => {
    const live = liveDrivers.find(ld => ld.id === d.id);
    if (!live) return d;
    
    return { 
      ...d, 
      pts: (live.pts as number) || d.pts,
      pos: (live.pos as number) || d.pos,
      gap: (live.gap as number | string) || d.gap,
      bio: live.bio || d.bio 
    };
  }).sort((a, b) => a.pos - b.pos);

  const highlightColor = theme === 'dark' ? '#EF0107' : '#00A19C';
  const highlightTeam = theme === 'dark' ? 'Red Bull' : 'Mercedes';

  const handleLiveSync = async () => {
    setIsSyncing(true);
    
    // Start both syncs in parallel
    const [geminiData, f1Timestamp] = await Promise.all([
      fetchFullLiveSync(),
      f1Service.syncLiveData()
    ]);

    if (geminiData && f1Timestamp) {
      // Data is already saved by f1Service.syncLiveData into 'f1_live_sync'
      // We need to merge Gemini data into it if we want to keep it consistent
      const existing = localStorage.getItem('f1_live_sync');
      if (existing) {
        const merged = {
          ...JSON.parse(existing),
          ...geminiData,
          timestamp: f1Timestamp // Use the latest timestamp
        };
        localStorage.setItem('f1_live_sync', JSON.stringify(merged));
      }
      
      window.dispatchEvent(new CustomEvent('f1_live_sync_completed', { 
        detail: { timestamp: f1Timestamp } 
      }));
      window.location.reload();
    }
    setIsSyncing(false);
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 2 ? [...prev, id] : [id]
    );
  };

  const selectedForCompare = mergedDrivers.filter(d => compareIds.includes(d.id));

  return (
    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink/10 relative">
      <div className="p-5.5 md:p-6 border-b-2 border-ink bg-paper sticky top-0 z-20">
        <div className="flex justify-between items-start mb-1.5">
          <div className="font-mono text-[9px] text-ink-3 tracking-[0.18em] font-medium">§ 01</div>
          <div className="flex gap-2">
            <button 
              onClick={handleLiveSync}
              disabled={isSyncing}
              className={`
                flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all 
                border-2 relative overflow-hidden group
                ${isSyncing 
                  ? 'bg-racing/20 border-racing text-racing' 
                  : 'bg-paper text-ink border-ink hover:border-racing hover:text-racing hover:shadow-[0_0_15px_rgba(239,1,7,0.3)] shadow-sm'
                }
                disabled:opacity-50
              `}
              title="Sync with Live Pit Wall Data"
            >
              {/* Scanline effect on hover */}
              <div className="absolute inset-0 w-full h-full bg-linear-to-b from-transparent via-racing/5 to-transparent -translate-y-full group-hover:animate-[scan_1.5s_linear_infinite]" />
              
              {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />}
              {isSyncing ? 'Syncing...' : 'Pit Wall Sync'}
            </button>
            <button 
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareIds([]);
              }}
              className={`
                flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all 
                border-2 relative group
                ${compareMode 
                  ? 'bg-racing text-white border-racing shadow-[0_0_20px_rgba(239,1,7,0.4)]' 
                  : 'bg-paper text-ink border-ink hover:border-racing hover:text-racing hover:shadow-[0_0_15px_rgba(239,1,7,0.3)] shadow-sm'
                }
              `}
            >
              <GitCompare size={12} className={compareMode ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {compareMode ? 'Comparing' : 'Compare Mode'}
            </button>
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold tracking-tight text-ink leading-none">
          Drivers' <span className="italic text-racing font-medium">Championship</span>
        </h3>
        <div className="font-mono text-[9px] tracking-widest uppercase text-ink-3 mt-2.5 flex items-center justify-between">
          <span>Top 10 · {theme === 'dark' ? 'Milton Keynes' : 'Brackley'} Sync · ⭐</span>
          {selectedNationality && (
            <button 
              onClick={() => setSelectedNationality(null)}
              className="text-racing hover:underline cursor-pointer font-bold"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Nationality Filter */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-ink/5">
          <button 
            onClick={() => setSelectedNationality(null)}
            className={`
              px-2 py-1 font-mono text-[8px] font-bold uppercase transition-all border
              ${!selectedNationality 
                ? 'bg-ink text-paper border-ink' 
                : 'bg-paper text-ink border-ink/10 hover:border-ink/30 hover:bg-paper-2'
              }
            `}
          >
            All
          </button>
          {nationalities.map(nat => (
            <button 
              key={nat}
              onClick={() => setSelectedNationality(nat)}
              className={`
                px-2 py-1 font-mono text-[8px] font-bold uppercase transition-all border flex items-center gap-1
                ${selectedNationality === nat 
                  ? 'bg-ink text-paper border-ink shadow-[0_2px_8px_rgba(0,0,0,0.1)] scale-105 z-10' 
                  : 'bg-paper text-ink border-ink/10 hover:border-ink/30 hover:bg-paper-2'
                }
              `}
            >
              <span className="text-[10px]">{getFlag(nat)}</span>
              {nat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-ink/10">
        {mergedDrivers.map((driver, i) => {
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
                  <span className="font-serif text-base font-medium text-ink tracking-tight leading-none flex items-center gap-1.5">
                    <span className="text-xs opacity-70 group-hover:scale-125 transition-transform">{getFlag(driver.country)}</span>
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
                <div className="text-[11px] text-ink-3 font-normal mt-0.5 flex items-center gap-1">
                  {driver.team} · {getFlag(driver.country)} {driver.country} 
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

              {/* Relative Performance Gauge */}
              <div className="col-start-2 col-span-2 -mt-1 pb-1">
                <div className="h-1 bg-ink/5 relative overflow-hidden">
                   <motion.div 
                      key={`${driver.id}-${driver.pts}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: driver.pts / mergedDrivers[0].pts }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: (i * 0.05) }}
                      className="absolute inset-0 origin-left opacity-70"
                      style={{ backgroundColor: driver.color }}
                   />
                </div>
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

