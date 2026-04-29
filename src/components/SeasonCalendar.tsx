/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Zap, Flag } from 'lucide-react';
import { CALENDAR } from '../constants.ts';

export function SeasonCalendar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [fetchingRounds, setFetchingRounds] = useState<Record<number | string, boolean>>({});
  const [fetchedData, setFetchedData] = useState<Record<number | string, { strategy: string, weather: string }>>({});

  const teamIntelLabel = theme === 'dark' ? 'Bull Insight' : 'Brackley Intel';
  const teamAccentColor = theme === 'dark' ? 'var(--color-racing)' : 'var(--color-mercedes)';

  const handleFetchData = (round: number | string) => {
    setFetchingRounds(prev => ({ ...prev, [round]: true }));
    
    // Simulate a network delay for the "telemetry uplink"
    setTimeout(() => {
      setFetchedData(prev => ({
        ...prev,
        [round]: {
          strategy: Math.random() > 0.5 ? 'S-M-M · Optimized Attack' : 'M-H · Endurance Load',
          weather: Math.random() > 0.7 ? 'Overcast · 22°C' : 'Clear Skies · 28°C'
        }
      }));
      setFetchingRounds(prev => ({ ...prev, [round]: false }));
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      // Find the next race or the current selected one
      const nextRace = scrollRef.current.querySelector('.race-next') as HTMLElement;
      if (nextRace) {
        scrollRef.current.scrollTo({ left: nextRace.offsetLeft - 60, behavior: 'smooth' });
      }
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-9 mt-12 mb-16">
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink">
            Season <span className="italic text-racing font-bold">Calendar</span>
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={() => scroll('left')}
              className="p-1.5 hover:bg-paper-3 rounded-full transition-colors border border-ink/10 cursor-pointer"
              title="Scroll Back"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1.5 hover:bg-paper-3 rounded-full transition-colors border border-ink/10 cursor-pointer"
              title="Scroll Ahead"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-ink-3 font-medium">Click a round for track intel</div>
      </div>

      <div className="relative border-2 border-ink bg-paper-2 shadow-xl shadow-ink/5 overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-black/10 z-20">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.23 }}
            transition={{ duration: 1.6, ease: [0.3, 0.9, 0.3, 1], delay: 1 }}
            className="h-full origin-left bg-racing"
          />
        </div>

        {/* Mobile Scroll Gradient Indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:hidden bg-linear-to-r from-paper-2 to-transparent z-10 pointer-events-none opacity-60" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:hidden bg-linear-to-l from-paper-2 to-transparent z-10 pointer-events-none opacity-60" />
        
        <div 
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] md:auto-cols-[minmax(280px,1fr)] overflow-x-auto scrollbar-none md:scrollbar-thin scrollbar-track-paper-2 scrollbar-thumb-ink/20"
        >
          {CALENDAR.map((race, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedRound(selectedRound === race.round ? null : race.round)}
              className={`
                p-6 border-r border-ink/10 relative transition-all duration-300 min-h-[300px] flex flex-col cursor-pointer group
                ${race.isDone ? 'bg-paper-2' : 'bg-paper hover:bg-paper-3'}
                ${selectedRound === race.round ? `ring-2 ring-inset bg-paper-3 ${theme === 'dark' ? 'ring-racing' : 'ring-mercedes'}` : ''}
              `}
            >
              {/* Glow effect for the upcoming race */}
              {race.isNext && (
                <motion.div 
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-0 z-0 pointer-events-none blur-xl ${theme === 'dark' ? 'bg-racing/20' : 'bg-mercedes/20'}`}
                />
              )}
              {race.isNext && (
                <motion.div 
                  animate={{ boxShadow: [`0 0 0px ${teamAccentColor}`, `0 0 20px ${teamAccentColor}`, `0 0 0px ${teamAccentColor}`] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 z-0 border-2 pointer-events-none"
                  style={{ borderColor: teamAccentColor }}
                />
              )}

              <div className="font-mono text-[10px] tracking-widest mb-4 font-semibold flex items-center justify-between relative z-10">
                <span className={race.isNext ? 'text-racing font-bold' : race.isCancelled ? 'text-ink-3/40' : 'text-ink-3'}>
                  R{String(race.round).padStart(2, '0')}{race.isNext ? ' · UP NEXT' : race.isCancelled ? ' · CANCELLED' : ''}
                </span>
                <span className={`w-2 h-2 rounded-full ${race.isNext ? 'bg-mercedes animate-pulse' : race.isCancelled ? 'bg-racing/20 border border-racing/40' : race.isDone ? 'bg-ink/30' : 'bg-transparent border border-ink/20'}`} />
              </div>
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className={`text-3xl filter drop-shadow-sm ${race.isCancelled ? 'opacity-30 grayscale' : ''}`}>{race.flag}</div>
                <div className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity text-ink-3`}>
                  <Info size={14} />
                </div>
              </div>

              <div className={`font-mono text-[9px] tracking-widest uppercase mb-1.5 font-bold relative z-10 ${race.isCancelled ? 'text-ink-3/30' : 'text-ink-3'}`}>
                {race.country}
              </div>
              
              <div className={`font-serif text-xl font-bold tracking-tight leading-tight mb-2 relative z-10 ${race.isCancelled ? 'text-ink-2/40 line-through' : 'text-ink'}`}>
                {race.circuit}
              </div>

              <div className={`font-mono text-xs font-medium tracking-tight mt-auto relative z-10 ${race.isCancelled ? 'text-ink-3/30' : 'text-ink-2'}`}>
                {race.date}
              </div>

              {/* Track Details Section */}
              <div className="mt-2 pt-2 border-t border-ink/5 relative z-10">
                <div className="font-sans text-[10px] text-ink-3 leading-tight mb-1 line-clamp-1">
                  {race.location}
                </div>
                <div className="font-mono text-[9px] text-racing font-bold uppercase tracking-wider">
                  {race.laps > 0 ? `${race.laps} LAPS · ${race.distance}` : 'Technical Data Sync'}
                </div>
              </div>

              {race.winner && (
                <div className={`font-mono text-[11px] font-bold mt-2 flex items-center gap-2 relative z-10 ${race.isRBRWin ? 'text-mercedes' : 'text-racing'}`}>
                  <Flag size={10} />
                  {race.winner}
                </div>
              )}

              {/* Expansion Panel (Track Intel / Results) */}
              <AnimatePresence>
                {selectedRound === race.round && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute inset-[4px] bg-paper-3 z-50 shadow-2xl flex flex-col border-2 border-ink rounded-xs overflow-hidden"
                  >
                    <div className="flex-1 p-5 overflow-y-auto scrollbar-none">
                      {race.isDone && race.podiumDetailed ? (
                        <>
                          <div className="font-mono text-[10px] tracking-widest uppercase text-racing font-bold mb-5 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Flag size={12} fill="currentColor" />
                              Official Result
                            </span>
                            <span className="text-ink-3 font-medium opacity-50">#{race.round}</span>
                          </div>

                          <div className="flex flex-col gap-5">
                            {/* Podium visualization */}
                            <div className="flex flex-col gap-2">
                              {race.podiumDetailed.map((p, idx) => (
                                <div key={idx} className="relative bg-paper border border-ink/5 p-3 flex items-center gap-4 group/podium">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-black
                                    ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600' : 
                                      idx === 1 ? 'bg-slate-400/10 border-slate-400 text-slate-500' : 
                                      'bg-amber-700/10 border-amber-800 text-amber-900'}
                                  `}>
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-serif text-[15px] font-bold text-ink leading-none">{p.driver}</div>
                                    <div className="font-mono text-[8.5px] text-ink-3 uppercase mt-1 tracking-wider">{p.team}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-mono text-[10px] font-bold text-ink tabular-nums">{p.gap}</div>
                                    <div className="font-mono text-[7px] text-ink-3 uppercase opacity-60">Interval</div>
                                  </div>
                                  {/* Team Color Stripe */}
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 w-1 opacity-60"
                                    style={{ backgroundColor: idx === 0 ? 'var(--color-racing)' : idx === 1 ? 'var(--color-mercedes)' : 'var(--color-ferrari)' }}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink/10">
                              <div className="col-span-2 bg-paper/30 p-3 border border-ink/5">
                                <div className="text-[10px] text-ink-3 uppercase font-mono mb-2 flex items-center gap-2">
                                  <Zap size={10} className="text-racing" />
                                  Fastest Lap
                                </div>
                                {race.fastestLap && (
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <div className="text-xs font-bold text-ink">{race.fastestLap.driver}</div>
                                      <div className="text-[8px] text-ink-3 font-mono">Lap 52/56</div>
                                    </div>
                                    <div className="text-[14px] font-mono font-bold text-racing tabular-nums">
                                      {race.fastestLap.time}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="bg-paper/30 p-3 border border-ink/5">
                                <div className="text-[10px] text-ink-3 uppercase font-mono mb-2">Strategy</div>
                                <div className="flex items-center gap-2 mb-2">
                                  {race.strategy?.split(' · ')[0].split('-').map((tyre, idx) => (
                                    <div key={idx} className={`w-3 h-3 rounded-full border-2 flex items-center justify-center text-[5px] font-bold
                                      ${tyre === 'S' ? 'border-racing bg-racing/20 text-racing' : 
                                        tyre === 'M' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-600' : 
                                        'border-ink-3 bg-ink-3/20 text-ink-3'}
                                    `}>
                                      {tyre}
                                    </div>
                                  ))}
                                </div>
                                <div className="text-[10px] font-bold text-ink leading-tight">{race.strategy?.split(' · ')[1] || race.strategy}</div>
                              </div>

                              <div className="bg-paper/30 p-3 border border-ink/5">
                                <div className="text-[10px] text-ink-3 uppercase font-mono mb-2">Atmosphere</div>
                                <div className="text-[10px] font-bold text-ink leading-tight">{race.weather}</div>
                                <div className="text-[8px] text-ink-3 font-mono mt-1 italic">Track Info: DRY</div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-mono text-[10px] tracking-widest uppercase text-racing font-bold mb-5 flex items-center gap-2">
                            <Zap size={12} fill="currentColor" />
                            {teamIntelLabel}
                          </div>
                          <div className="space-y-6">
                            <div className="flex gap-3">
                              <div className="flex-1 bg-paper/30 p-3 border border-ink/5">
                                <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">Downforce</div>
                                <div className="text-xs font-bold text-ink">{i % 3 === 0 ? 'High' : 'Med-Low'}</div>
                              </div>
                              <div className="flex-1 bg-paper/30 p-3 border border-ink/5">
                                <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">Grip Level</div>
                                <div className="text-xs font-bold text-ink">4.2 / 5.0</div>
                              </div>
                            </div>

                            {/* Live Data / Strategy Section */}
                            <div className="mt-4 pt-4 border-t border-ink/10">
                              {(race.strategy || fetchedData[race.round]) ? (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-paper/30 p-3 border border-ink/5">
                                    <div className="text-[9px] text-ink-3 uppercase font-mono mb-2">Strategy Breakdown</div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      {(race.strategy || fetchedData[race.round]?.strategy)?.split(' · ')[0].split('-').map((tyre, idx) => (
                                        <div key={idx} className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[6px] font-black
                                          ${tyre === 'S' ? 'border-racing bg-racing/10 text-racing' : 
                                            tyre === 'M' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 
                                            'border-ink-2 bg-ink-2/10 text-ink-3'}
                                        `}>
                                          {tyre}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-[10px] font-bold text-ink leading-tight uppercase tabular-nums">
                                      { (race.strategy || fetchedData[race.round]?.strategy)?.split(' · ')[1] || (race.strategy || fetchedData[race.round]?.strategy) }
                                    </div>
                                  </div>
                                  <div className="bg-paper/30 p-3 border border-ink/5">
                                    <div className="text-[9px] text-ink-3 uppercase font-mono mb-2">Atmosphere Link</div>
                                    <div className="text-[10px] font-bold text-ink leading-tight">
                                      {race.weather || fetchedData[race.round]?.weather}
                                    </div>
                                    <div className="text-[8px] text-racing font-mono mt-1 flex items-center gap-1">
                                      <span className="w-1 h-1 bg-racing rounded-full animate-pulse" />
                                      LIVE SYNC
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-ink/5 border border-dashed border-ink/20 p-5 flex flex-col items-center text-center">
                                  <div className="text-[9px] text-ink font-mono uppercase tracking-widest mb-3 opacity-60">
                                    Strategic Telemetry Unavailable
                                  </div>
                                  <button 
                                    onClick={() => handleFetchData(race.round)}
                                    disabled={fetchingRounds[race.round]}
                                    className="px-6 py-2 bg-ink text-paper font-mono text-[9px] font-black uppercase tracking-[0.2em] hover:bg-racing transition-colors disabled:opacity-50 disabled:bg-ink-3"
                                  >
                                    {fetchingRounds[race.round] ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 border-t-2 border-paper rounded-full animate-spin" />
                                        Linking...
                                      </div>
                                    ) : (
                                      'Establish Uplink'
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="p-4 bg-ink/5 border-l-2 border-racing">
                              <div className="text-[9px] text-racing uppercase font-mono font-bold mb-2">Technical Insight</div>
                              <div className="text-[11px] italic font-serif leading-relaxed text-ink-2">
                                {race.isNext ? "Tight sequences, low margin for error. Chassis focus: Mechanical grip. Expect tire degradation on front-left through sector 2." : "High raked sensitive zone. Aerodynamic efficiency is paramount on the main straight."}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="p-4 bg-paper-2 border-t border-ink/10 flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedRound(null); }}
                        className="flex-1 py-2.5 bg-ink text-white text-[10px] font-mono hover:bg-ink-2 transition-colors uppercase tracking-widest active:scale-95 cursor-pointer font-black"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

