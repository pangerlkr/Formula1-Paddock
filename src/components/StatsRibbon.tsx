/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function StatsRibbon({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const rbrStats = [
    { label: 'Championship Stat', big: 'P1', accent: '· Defending', sub: 'Max Verstappen · Dominant', color: 'racing' },
    { label: 'World Record Stop', big: '1.82', accent: 's', sub: 'Red Bull · Qatar GP', color: 'mercedes' },
    { label: 'RB22 Efficiency', big: '+12%', accent: '', sub: 'Downforce gain vs 2025', color: 'racing' },
    { label: 'Wins Since 2022', big: '64', accent: '· Record', sub: 'Milton Keynes Mastery', color: 'mercedes' },
  ];

  const mercStats = [
    { label: 'Era Dominance', big: '8', accent: '· Consecutive', sub: 'Constructors Titles', color: 'racing' },
    { label: 'Win Conversion', big: '42%', accent: '· Rate', sub: 'History of Precision', color: 'mercedes' },
    { label: 'Power Unit Heat', big: '50%', accent: '· Thermal', sub: 'M17 E-Performance Peak', color: 'racing' },
    { label: 'Paddock Legend', big: '125', accent: '· Wins', sub: 'Silver Arrows Heritage', color: 'mercedes' },
  ];

  const stats = theme === 'dark' ? rbrStats : mercStats;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-9 mt-12 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-ink bg-paper transition-colors duration-500">
        {stats.map((stat, i) => (
          <div key={i} 
            className="p-5 md:p-6 border-r border-ink/10 relative overflow-hidden group hover:bg-ink/[0.02] transition-colors last:border-none"
          >
            <div className="font-mono text-[8px] md:text-[9px] tracking-[0.22em] uppercase text-ink-3 mb-3 md:mb-3.5 font-bold">{stat.label}</div>
            <div className="font-serif text-[clamp(24px,3vw,38px)] font-bold text-ink leading-none tracking-tight mb-2 md:mb-2.5">
              {stat.big.split('.').length > 1 ? (
                <>
                  {stat.big.split('.')[0]}.<span className="text-mercedes font-medium italic">{stat.big.split('.')[1]}</span>
                </>
              ) : (
                <>
                  {stat.big} <span className={`italic font-medium ${i % 2 === 0 ? 'text-racing' : 'text-mercedes'}`}>{stat.accent}</span>
                </>
              )}
            </div>
            <div className="font-sans text-xs text-ink-2 font-medium">{stat.sub}</div>
            
            <div className={`absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full ${i % 2 === 0 ? 'bg-racing' : 'bg-mercedes'}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
