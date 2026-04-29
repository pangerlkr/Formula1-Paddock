/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Award, Flag, Activity, GitCompare } from 'lucide-react';
import { Driver } from '../types';

interface DriverComparisonProps {
  isOpen: boolean;
  drivers: Driver[];
  onClose: () => void;
  theme: 'dark' | 'light';
}

export function DriverComparison({ isOpen, drivers, onClose, theme }: DriverComparisonProps) {
  return (
    <AnimatePresence>
      {isOpen && drivers.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-carbon/95 backdrop-blur-xl"
          />

          {/* Comparison Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="bg-paper border-2 border-ink w-full max-w-6xl max-h-[95vh] overflow-hidden relative z-10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-ink/10 flex justify-between items-center bg-paper-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-racing text-white rounded-xs">
                  <GitCompare size={18} />
                </div>
                <div>
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-ink leading-none">Telemetry <span className="italic text-racing">Comparison</span></h2>
                  <p className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mt-1">Side-by-Side Data Analysis · Session 2026</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-racing hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drivers Comparison Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative ${drivers.length > 1 ? 'divide-y md:divide-y-0 md:divide-x divide-ink/10' : ''}`}>
                
                {drivers.map((driver, idx) => (
                  <motion.div 
                    key={driver.id}
                    initial={{ x: idx === 0 ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`flex flex-col gap-8 ${idx === 1 ? 'md:pl-12 pt-8 md:pt-0' : ''}`}
                  >
                    {/* Visual Card */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-ink relative shrink-0 overflow-hidden bg-ink/5 flex items-center justify-center">
                        {driver.image ? (
                          <img 
                            src={driver.image}
                            alt={driver.name}
                            className="w-full h-full object-cover grayscale"
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-ink text-paper flex items-center justify-center font-mono text-xs font-bold border border-ink shadow-lg">
                          #{driver.pos}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-racing font-bold uppercase tracking-widest mb-1">{driver.team}</div>
                        <h3 className="font-serif text-3xl font-extrabold text-ink leading-none mb-2">{driver.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-1.5 py-0.5 bg-ink text-paper font-bold">{driver.code}</span>
                          <span className={`h-1 w-12 ${idx === 0 ? 'bg-racing' : 'bg-mercedes'}`} />
                        </div>
                      </div>
                    </div>

                    {/* Comparative Stats List */}
                    <div className="space-y-4">
                      {[
                        { label: 'Points', val: driver.pts, icon: Activity, suffix: 'PTS' },
                        { label: 'World Titles', val: driver.careerStats?.titles || 0, icon: Flag, suffix: 'WDC' },
                        { label: 'Race Wins', val: driver.careerStats?.wins || 0, icon: Trophy, suffix: 'W' },
                        { label: 'Podiums', val: driver.careerStats?.podiums || 0, icon: Award, suffix: 'P' },
                      ].map((stat, i) => {
                        // Compare values
                        const otherDriver = drivers[idx === 0 ? 1 : 0];
                        const isWinner = otherDriver && (stat.val as number) > ((idx === 0 ? otherDriver.careerStats?.wins : otherDriver.careerStats?.wins) || 0);
                        // Simplified winner logic for points
                        const isPointsWinner = otherDriver && stat.label === 'Points' && (stat.val as number) > otherDriver.pts;

                        return (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-2 font-mono text-[9px] text-ink-3 uppercase tracking-tighter">
                                <stat.icon size={10} />
                                {stat.label}
                              </div>
                              <div className={`font-mono text-lg font-bold ${isPointsWinner || isWinner ? 'text-racing' : 'text-ink'}`}>
                                {stat.val} <span className="text-[10px] text-ink-3 font-normal ml-0.5">{stat.suffix}</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-ink/5 relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (stat.val as number / (stat.label === 'Points' ? 100 : 100)) * 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${idx === 0 ? 'bg-racing' : 'bg-mercedes'}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bio Snippet */}
                    <div className="bg-paper-2 p-4 border-l-2 border-ink/20 italic">
                      <p className="font-sans text-xs text-ink-2 leading-relaxed">
                        {driver.bio?.substring(0, 150)}...
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Head-to-Head Section */}
                {drivers.length === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 md:col-span-2 pt-8 border-t-2 border-ink"
                  >
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-[1px] flex-1 bg-ink/20" />
                       <div className="flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-[0.4em] text-racing">
                         <div className="flex -space-x-1">
                           <div className="w-1.5 h-1.5 bg-racing" />
                           <div className="w-1.5 h-1.5 bg-ink" />
                         </div>
                         Direct Combat Data
                       </div>
                       <div className="h-[1px] flex-1 bg-ink/20" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-12 pb-8">
                      {/* Win Ratio */}
                      <div className="flex flex-col items-center">
                        <div className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mb-6">Career Win Duel</div>
                        <div className="flex items-center gap-4 w-full">
                          <div className="font-serif text-3xl font-black text-racing">{drivers[0].careerStats?.wins || 0}</div>
                          <div className="flex-1 h-3 flex gap-1 items-center px-1 border border-ink/10 bg-ink/5">
                            <div 
                              className="h-1 bg-racing transition-all duration-1000" 
                              style={{ width: `${(drivers[0].careerStats?.wins || 0) / ((drivers[0].careerStats?.wins || 0) + (drivers[1].careerStats?.wins || 1)) * 100}%` }}
                            />
                            <div className="w-[1px] h-2 bg-ink/20" />
                            <div 
                              className="h-1 bg-mercedes transition-all duration-1000" 
                              style={{ width: `${(drivers[1].careerStats?.wins || 0) / ((drivers[0].careerStats?.wins || 0) + (drivers[1].careerStats?.wins || 1)) * 100}%` }}
                            />
                          </div>
                          <div className="font-serif text-3xl font-black text-mercedes">{drivers[1].careerStats?.wins || 0}</div>
                        </div>
                        <div className="mt-4 flex justify-between w-full font-mono text-[8px] text-ink-3 font-bold uppercase tracking-tighter">
                          <span>{drivers[0].code} Wins</span>
                          <span>{drivers[1].code} Wins</span>
                        </div>
                      </div>

                      {/* Points Gap */}
                      <div className="flex flex-col items-center">
                        <div className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mb-6">Current Standing Gap</div>
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-12 h-[1px] bg-ink/20" />
                          <div className="font-serif text-5xl font-black text-ink italic leading-none">
                            {Math.abs(drivers[0].pts - drivers[1].pts)}
                          </div>
                          <div className="w-12 h-[1px] bg-ink/20" />
                        </div>
                        <div className="mt-4 font-mono text-[8px] text-ink-3 font-bold uppercase tracking-widest bg-ink/5 px-3 py-1">
                          POINTS DIFFERENTIAL
                        </div>
                      </div>

                      {/* Performance Index */}
                      <div className="flex flex-col items-center">
                        <div className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mb-6">Finish Bias (Last 5)</div>
                        <div className="flex items-center gap-4 w-full">
                           <div className="flex flex-col items-center gap-1">
                             <div className="font-mono text-xl font-bold text-ink">{(100 / drivers[0].pos).toFixed(1)}</div>
                             <div className="w-8 h-1 bg-racing" />
                           </div>
                           <div className="flex-1 flex gap-0.5 justify-center items-end h-10 pb-1">
                              {[0.4, 0.7, 0.5, 0.8, 0.6].map((h, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h * 100}%` }}
                                  transition={{ delay: 0.6 + i * 0.05 }}
                                  className={`w-2 ${i % 2 === 0 ? 'bg-racing/40' : 'bg-mercedes/40'}`}
                                />
                              ))}
                           </div>
                           <div className="flex flex-col items-center gap-1">
                             <div className="font-mono text-xl font-bold text-ink">{(100 / drivers[1].pos).toFixed(1)}</div>
                             <div className="w-8 h-1 bg-mercedes" />
                           </div>
                        </div>
                        <div className="mt-4 flex justify-between w-full font-mono text-[8px] text-ink-3 font-bold uppercase tracking-tighter">
                          <span>{drivers[0].code} INDEX</span>
                          <span>{drivers[1].code} INDEX</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {drivers.length === 1 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-ink/10 md:ml-12 min-h-[300px]">
                    <div className="w-12 h-12 bg-ink/5 rounded-full flex items-center justify-center mb-4 text-ink-3">
                      <Activity size={24} />
                    </div>
                    <p className="font-mono text-[10px] text-ink-3 uppercase tracking-widest">Awaiting Side-by-Side Data</p>
                    <p className="font-sans text-xs text-ink-2 mt-2">Select another driver from the standings to initiate comparative analysis.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="p-4 bg-paper-3 border-t border-ink flex justify-center">
              <div className="flex items-center gap-2 font-mono text-[10px] text-ink-3 font-bold uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-mercedes rounded-full animate-pulse" />
                Comparative Model: RBR-COMP-026.4
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
