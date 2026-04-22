/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NEWS } from '../constants.ts';
import { ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import { fetchLivePaddockIntel } from '../services/geminiService.ts';
import { NewsItem } from '../types.ts';

export function PaddockIntel({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [news, setNews] = useState<NewsItem[]>(NEWS);
  const [loading, setLoading] = useState(false);

  const teamBase = theme === 'dark' ? 'Milton Keynes' : 'Brackley';
  const teamIntelLabel = theme === 'dark' ? 'Bull Insight' : 'Brackley Intel';

  const getLiveIntel = async () => {
    setLoading(true);
    try {
      const liveNews = await fetchLivePaddockIntel();
      if (liveNews && liveNews.length > 0) {
        setNews(liveNews);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: Auto fetch on mount. Let's keep it manual or auto? 
    // User asked to "fetch actual real-time", so let's do it on mount.
    getLiveIntel();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="p-5.5 md:p-6 border-b-2 border-ink bg-paper sticky top-0 z-20">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-mono text-[9px] text-ink-3 tracking-[0.18em] mb-1.5 font-medium">§ 03</div>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-ink leading-none">
              Paddock <span className="italic text-racing font-medium">Intel</span>
            </h3>
          </div>
          <button 
            onClick={getLiveIntel}
            disabled={loading}
            className="p-2 hover:bg-paper-3 transition-colors border border-ink/10 rounded-sm disabled:opacity-50"
            title="Fetch Live Updates"
          >
            {loading ? <Loader2 size={14} className="animate-spin text-racing" /> : <RefreshCw size={14} className="text-ink-3" />}
          </button>
        </div>
        <div className="font-mono text-[9px] tracking-widest uppercase text-ink-3 mt-2.5 flex items-center gap-2">
          {loading ? 'Decrypting Live Signal...' : 'Live Feed · Sync Active'}
          {!loading && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
        </div>
      </div>

      {/* Podium Result */}
      <div className="p-5.5 md:p-6 border-b border-ink/10">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-3 mb-4 font-medium">Japanese GP · Suzuka · Result</div>
        <div className="flex flex-col gap-1.5">
          {[
            { p: 'P1', name: 'Kimi Antonelli', team: 'Mercedes · #12 · ⭐ P1 Back-to-Back', time: '1:28:14.802', color: '#27F4D2' },
            { p: 'P2', name: 'Lando Norris', team: 'McLaren · #4', time: '+6.441', color: '#FF8000' },
            { p: 'P3', name: 'Charles Leclerc', team: 'Ferrari · #16', time: '+12.127', color: '#E8002D' },
          ].map((pod, i) => (
            <div key={i} 
              className={`
                grid grid-cols-[40px_1fr_auto] items-center gap-3 px-6 py-3.5 transition-transform hover:translate-x-1
                ${i === 0 ? 'bg-racing/10' : i === 1 ? 'bg-mclaren/10' : 'bg-black/5'}
              `}
            >
              <div className="font-mono text-[11px] font-bold text-center py-1.5 text-white tracking-widest" style={{ backgroundColor: pod.color }}>
                {pod.p}
              </div>
              <div>
                <div className="font-serif text-[15px] font-medium text-ink tracking-tight leading-none">{pod.name}</div>
                <div className="text-[10px] text-ink-2 mt-1 font-medium">{pod.team}</div>
              </div>
              <div className="font-mono text-[11px] text-ink font-bold tabular-nums">{pod.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News Articles */}
      <div className="flex flex-col">
        {news.map((item) => (
          <article key={item.id} 
            className="px-6 py-4 border-b border-ink/10 relative transition-all group hover:bg-paper-2 overflow-hidden last:border-none cursor-pointer"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-0 bg-racing transition-all duration-300 group-hover:w-1" />
            <div className="flex items-center justify-between mb-2.5">
              <span className={`font-mono text-[8px] tracking-widest uppercase px-2 py-1 font-bold ${item.type === 'lead' ? 'bg-racing text-white' : 'bg-ink text-paper'}`}>
                {item.kicker}
              </span>
              <span className="font-mono text-[9px] text-ink-3 font-medium">0{item.id}</span>
            </div>
            <h3 className={`font-serif text-ink tracking-tight leading-snug mb-2 ${item.type === 'lead' ? 'text-lg font-bold' : 'text-base font-medium'}`}>
              {item.headline}
            </h3>
            
            <div className="relative">
              <p className={`text-[12px] leading-relaxed text-ink-2 transition-all duration-300 ${expandedId === item.id ? '' : 'line-clamp-3'}`}>
                {item.body}
              </p>
              
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-ink/5"
                  >
                    <div className="font-mono text-[9px] text-mercedes font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      {teamBase} · Technical Intel
                    </div>
                    <div className="text-[11px] text-ink-2 italic leading-relaxed bg-paper-3 p-3 border-l-2 border-racing">
                      "Aerodynamic simulations suggest the {item.kicker.toLowerCase()} variables are operating within the peak performance envelope. Sector 2 gains projected at {item.id > 3 ? '0.04s' : '0.12s'}."
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-3 flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-mercedes tracking-widest group-hover:gap-2 transition-all">
                {expandedId === item.id ? 'Close Uplink' : 'Decrypt Uplink'}
                {expandedId === item.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
