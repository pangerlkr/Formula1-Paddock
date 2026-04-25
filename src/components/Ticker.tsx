/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TICKER_ITEMS } from '../constants.ts';
import { fetchLiveTickerUpdates } from '../services/geminiService.ts';

export function Ticker({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const defaultItems = theme === 'dark' ? TICKER_ITEMS : [
    { sym: 'WDC', val: 'ANTONELLI ⭐', pts: '72 pts' },
    { sym: 'WCC', val: 'MERCEDES ⭐', pts: '135 pts' },
    { sym: 'NEXT', val: 'MIAMI GP', pts: 'MAY 3' },
    { sym: 'WINNER', val: 'ANTONELLI', pts: 'JAPAN' },
    { sym: 'FL', val: 'RUSSELL', pts: '1:28.411' },
    { sym: 'FAST PIT', val: 'MERCEDES', pts: '1.92s' },
    { sym: 'MERC', val: 'DOMINANT', pts: 'FORCE' },
    { sym: 'POWER', val: 'HPP V6', pts: 'E-PERF' },
  ];
  const [items, setItems] = useState<{ sym: string; val: string; pts: string }[]>(defaultItems);

  useEffect(() => {
    // Check for global live sync data first
    const savedSync = localStorage.getItem('f1_live_sync');
    if (savedSync) {
      try {
        const data = JSON.parse(savedSync);
        if (data.ticker && data.ticker.length > 0) {
          setItems(data.ticker);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback to theme defaults
    setItems(defaultItems);
    
    const getLiveTicker = async () => {
      try {
        const liveItems = await fetchLiveTickerUpdates();
        if (liveItems && liveItems.length > 0) {
          setItems(liveItems);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getLiveTicker();
    
    // Poll every 10 minutes for fresh "live" data to preserve quota
    const interval = setInterval(getLiveTicker, 600000);
    return () => clearInterval(interval);
  }, [theme]);

  const displayItems = [...items, ...items]; // Duplicate for infinite scroll

  return (
    <div className="bg-carbon h-10 md:h-11 overflow-hidden flex items-center border-b-2 border-mercedes relative z-50">
      <div className="flex whitespace-nowrap animate-ticker will-change-transform">
        {displayItems.map((it, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="tick px-4 md:px-6 flex items-center gap-1.5 md:gap-2 font-mono text-[10px] md:text-[11px] font-medium tracking-widest text-white/65 uppercase">
              <span className="text-mercedes font-semibold tracking-[0.14em]">{it.sym}</span>
              <span className="text-white font-semibold">{it.val}</span>
              <span className="text-mercedes font-medium">{it.pts}</span>
            </span>
            <span className="text-white/20 px-1 text-[8px] md:text-[9px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
