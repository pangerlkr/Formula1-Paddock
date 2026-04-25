/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { TEAMS } from '../constants.ts';
import { Team } from '../types.ts';

export function ConstructorsStandings({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [liveTeams, setLiveTeams] = useState<Team[]>(TEAMS);

  useEffect(() => {
    const checkSync = () => {
      const saved = localStorage.getItem('f1_live_sync');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.teams) setLiveTeams(data.teams);
        } catch (e) { console.error(e); }
      }
    };
    checkSync();
    window.addEventListener('f1_live_sync_completed', checkSync);
    return () => window.removeEventListener('f1_live_sync_completed', checkSync);
  }, []);

  const maxPts = liveTeams.length > 0 ? Math.max(...liveTeams.map(t => t.pts)) : 0;
  const highlightTeam = theme === 'dark' ? 'Red Bull' : 'Mercedes';

  return (
    <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-ink/10 group">
      <div className="p-5.5 md:p-6 border-b-2 border-ink bg-paper sticky top-0 z-20">
        <div className="font-mono text-[9px] text-ink-3 tracking-[0.18em] mb-1.5 font-medium">§ 02</div>
        <h3 className="font-serif text-2xl font-bold tracking-tight text-ink leading-none">
          Constructors' <span className="italic text-racing font-medium">Cup</span>
        </h3>
        <div className="font-mono text-[9px] tracking-widest uppercase text-ink-3 mt-2.5">2026 Standings · {theme === 'dark' ? 'Milton Keynes' : 'Brackley'} Sync</div>
      </div>

      <div className="flex flex-col">
        {liveTeams.map((team, i) => {
          const isCoreTeam = team.name.includes(highlightTeam);
          return (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 + i * 0.08 }}
              className={`
                px-6 py-3.5 border-b border-ink/10 relative transition-all group overflow-hidden hover:bg-paper-2
                ${isCoreTeam ? 'bg-racing/5' : ''}
              `}
            >
              <div className={`absolute left-0 top-0 bottom-0 ${isCoreTeam ? 'w-2' : 'w-1'}`} style={{ backgroundColor: team.color }} />
              
              <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 mb-2.5">
                <div className="font-mono text-xs font-bold text-ink-2 tabular-nums">{String(team.pos).padStart(2, '0')}</div>
                <div className="flex flex-col">
                  <div className="font-serif text-[15px] font-medium text-ink tracking-tight">
                    {team.name} {isCoreTeam && '⭐'}
                  </div>
                  <div className="text-[10px] text-ink-2 mt-0.5 font-medium">{team.engine} · {team.country}</div>
                </div>
                <div className="font-mono text-lg font-bold text-ink tabular-nums leading-none tracking-tight">{team.pts}</div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="font-mono text-[8px] text-ink-3 uppercase tracking-[0.2em] font-bold">Relative Performance</div>
                  <div className="font-mono text-[9px] text-ink font-bold tabular-nums italic">{(team.pts / maxPts * 100).toFixed(1)}%</div>
                </div>
                <div className="h-2 bg-ink/5 relative overflow-hidden ring-1 ring-ink/5">
                   <motion.div 
                      key={`${team.id}-${team.pts}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: maxPts > 0 ? team.pts / maxPts : 0 }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: (i * 0.1) }}
                      className="absolute inset-0 origin-left"
                      style={{ backgroundColor: team.color }}
                   />
                   {/* Scanning mask effect */}
                   <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                      className="absolute inset-y-0 w-20 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                   />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
