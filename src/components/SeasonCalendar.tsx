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

  const teamIntelLabel = theme === 'dark' ? 'Bull Insight' : 'Brackley Intel';
  const teamAccentColor = theme === 'dark' ? 'var(--color-racing)' : 'var(--color-mercedes)';

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
            className="h-full bg-linear-to-r from-racing to-mercedes origin-left"
            style={{ backgroundImage: `linear-to-r from-${theme === 'dark' ? 'racing' : 'mercedes'} to-${theme === 'dark' ? 'mercedes' : 'racing'}` }}
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
                p-6 border-r border-ink/10 relative transition-all duration-300 min-h-[280px] flex flex-col cursor-pointer group
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={(e) => e.stopPropagation()} // Prevent clicking details from closing it
                    className="absolute inset-0 bg-paper-3 z-50 shadow-2xl flex flex-col border-2 border-ink"
                  >
                    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-ink/20 scrollbar-track-transparent">
                      {race.isDone && race.podiumDetailed ? (
                        <>
                          <div className="font-mono text-[9px] tracking-widest uppercase text-mercedes mb-5 flex items-center gap-2">
                            <Flag size={10} fill="currentColor" />
                            Official Race Result
                          </div>
                          <div className="flex flex-col gap-4">
                            {/* podium list */}
                            <div className="flex flex-col gap-3">
                              {race.podiumDetailed.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-[24px_1fr_auto] gap-3 items-center">
                                  <span className={`font-mono text-xs font-bold ${idx === 0 ? (theme === 'dark' ? 'text-racing' : 'text-mercedes') : idx === 1 ? 'text-ink-2' : 'text-ink-3'}`}>
                                    P{idx + 1}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-bold font-serif leading-none text-ink">{p.driver}</span>
                                    <span className="text-[9px] text-ink-3 uppercase font-mono">{p.team}</span>
                                  </div>
                                  <span className="font-mono text-[10px] text-ink-2 tabular-nums">{p.gap}</span>
                                </div>
                              ))}
                            </div>

                            {/* technical stats */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-ink/10">
                              {race.fastestLap && (
                                <div className="col-span-2">
                                  <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">Fastest Lap</div>
                                  <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-racing">{race.fastestLap.driver}</span>
                                    <span className="text-[10px] font-mono text-ink-2">{race.fastestLap.time}</span>
                                  </div>
                                </div>
                              )}
                              <div>
                                  <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">Strategy</div>
                                  <div className="text-[11px] font-bold tracking-widest text-ink">{race.strategy}</div>
                              </div>
                              <div>
                                  <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">Weather</div>
                                  <div className="text-[11px] font-bold text-ink">{race.weather}</div>
                              </div>
                            </div>
                            
                            {race.leadingTeam && (
                              <div className="mt-1 pt-3 border-t border-ink/10">
                                <div className="text-[9px] text-ink-3 uppercase font-mono mb-1">WCC Leader</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold" style={{ color: race.leadingTeam.color }}>{race.leadingTeam.name}</span>
                                  <span className="text-[10px] font-mono font-bold text-ink-3">{race.leadingTeam.pts} PTS</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-mono text-[9px] tracking-widest uppercase text-mercedes mb-5 flex items-center gap-2">
                            <Zap size={10} fill="currentColor" />
                            {teamIntelLabel}
                          </div>
                          <div className="grid gap-5">
                            <div>
                              <div className="text-[10px] text-ink-3 uppercase font-mono mb-1">Grip Level</div>
                              <div className="text-[13px] font-bold text-ink">{i % 2 === 0 ? 'High / Abrasive' : 'Medium / Technical'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-ink-3 uppercase font-mono mb-1">Downforce</div>
                              <div className="text-[13px] font-bold text-ink">{i % 3 === 0 ? 'High' : 'Medium-Low'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-ink-3 uppercase font-mono mb-1">Characteristic</div>
                              <div className="text-[13px] italic font-serif leading-relaxed text-ink-2">
                                {race.isNext ? "Tight sequences, low margin for error. RB22 setup focus: Mechanical grip." : "Historical technical sector. High rake sensitive zone."}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="p-4 bg-paper-2 border-t border-ink/10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedRound(null); }}
                        className="w-full py-2.5 border border-ink/30 text-[10px] font-mono hover:bg-paper-3 transition-colors uppercase tracking-widest text-ink active:scale-95 cursor-pointer font-bold"
                      >
                        Close Details
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

