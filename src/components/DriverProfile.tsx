/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Award, Flag, BarChart3, Activity } from 'lucide-react';
import { Driver } from '../types';

interface DriverProfileProps {
  driver: Driver | null;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export function DriverProfile({ driver, onClose, theme }: DriverProfileProps) {
  if (!driver) return null;

  return (
    <AnimatePresence>
      {driver && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-carbon/90 backdrop-blur-md"
          />

          {/* Profile Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-paper border-2 border-ink w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-ink text-paper hover:bg-racing transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Column: Visuals & Name */}
            <div className={`w-full md:w-2/5 relative overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-carbon-2' : 'bg-paper-2'}`}>
              {/* Dynamic Number Anchor */}
              <div className="absolute -left-4 -top-8 font-serif text-[180px] font-black text-ink/5 italic select-none pointer-events-none">
                {String(driver.pos).padStart(2, '0')}
              </div>

              <div className="relative z-10 p-8 flex-1 flex flex-col justify-end">
                <div className="aspect-square w-full bg-ink/5 border-2 border-ink mb-6 overflow-hidden relative group flex items-center justify-center">
                  {driver.image ? (
                    <img 
                      src={driver.image}
                      alt={driver.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('bg-carbon-2');
                        // Optional: trigger fallback UI if needed, but for now we just show background
                      }}
                    />
                  ) : null}
                  {/* Watermark removed as per user request */}
                  <div className="absolute inset-0 bg-linear-to-t from-paper via-transparent to-transparent opacity-60 z-20" />
                </div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="font-mono text-xs text-racing font-bold uppercase tracking-[0.3em] mb-2">{driver.team}</div>
                  <h2 className="font-serif text-4xl font-extrabold text-ink leading-none mb-4">{driver.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm px-2 py-1 bg-ink text-paper font-bold">{driver.code}</span>
                    <span className="text-2xl">{driver.country === 'NED' ? '🇳🇱' : driver.country === 'GBR' ? '🇬🇧' : driver.country === 'MON' ? '🇲🇨' : driver.country === 'ITA' ? '🇮🇹' : '🏁'}</span>
                  </div>
                </motion.div>
              </div>

              {/* Theme-colored Stripe */}
              <div className="h-2 w-full bg-linear-to-r from-racing to-mercedes" />
            </div>

            {/* Right Column: Stats & Bio */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Career Wins', val: driver.careerStats?.wins || 0, icon: Trophy },
                    { label: 'Podiums', val: driver.careerStats?.podiums || 0, icon: Award },
                    { label: 'World Titles', val: driver.careerStats?.titles || 0, icon: Flag },
                    { label: 'GP Starts', val: driver.careerStats?.races || 0, icon: Activity },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 border border-ink/10 bg-paper-2 flex flex-col items-center justify-center text-center group hover:border-racing/30 transition-all"
                    >
                      <stat.icon size={16} className="text-ink-3 mb-2 group-hover:text-racing transition-colors" />
                      <div className="font-mono text-xs text-ink-3 uppercase tracking-tighter mb-1">{stat.label}</div>
                      <div className="font-serif text-2xl font-bold text-ink">{stat.val}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Biography */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="font-mono text-[10px] text-racing font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="h-[1px] w-8 bg-racing" />
                    Paddock Dossier
                  </div>
                  <p className="font-sans text-sm text-ink-2 leading-relaxed">
                    {driver.bio || "Detailed telemetry data and career biography are currently being synchronized from the team mainframe. Initial 2026 performance indicators show high technical adaptation."}
                  </p>
                </motion.div>

                {/* Performance Graph Placeholder */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-6 border-t border-ink/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-mono text-[10px] text-ink-3 font-bold uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 size={12} />
                      Current Standings Logic
                    </div>
                    <div className="font-mono text-[10px] text-racing font-bold">{driver.pts} PTS</div>
                  </div>
                  <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(driver.pts / 100) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                      className="h-full bg-linear-to-r from-racing to-mercedes"
                    />
                  </div>
                  <div className="flex justify-between mt-2 font-mono text-[8px] text-ink-3 uppercase">
                    <span>Alpha Phase</span>
                    <span>Peak Optimization</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
