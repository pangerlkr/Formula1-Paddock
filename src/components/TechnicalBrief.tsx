import { motion, AnimatePresence } from 'motion/react';
import { Settings, Zap, Wind, ShieldCheck, Gauge, Cpu, RefreshCw, Lock, Unlock, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { f1Service, type F1Telemetry } from '../services/f1Service';

export function TechnicalBrief({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [activeCoord, setActiveCoord] = useState({ x: 0, y: 0 });
  const [telemetry, setTelemetry] = useState<F1Telemetry | null>(null);

  const specs = [
    {
      id: 'aero',
      title: 'Active Aerodynamics',
      kicker: 'Movable Wings · DRS 2.0',
      description: 'The 2026 MCL61 and SF-26 feature dynamic front and rear wings that adjust in real-time to balance drag and downforce across every sector.',
      icon: <Wind className="text-racing" size={24} />,
      stats: [
        { label: 'Drag Reduction', val: '-30%' },
        { label: 'Response Time', val: '0.12s' }
      ]
    },
    {
      id: 'pu',
      title: 'MGU-K Hybrid+',
      kicker: '50/50 Power Split',
      description: 'Internal combustion and electrical output now share an equal 350kW split. The MGU-H has been retired in favor of high-capacity storage.',
      icon: <Zap className="text-racing" size={24} />,
      stats: [
        { label: 'Elec. Boost', val: '350kW' },
        { label: 'E-Fuel', val: '100%' }
      ]
    },
    {
      id: 'chassis',
      title: 'Smart Chassis',
      kicker: 'Lighter · Agile · Sustainable',
      description: 'A 30kg reduction in minimum weight combined with bio-composite safety cells ensures maximum agility in low-speed urban circuits.',
      icon: <ShieldCheck className="text-racing" size={24} />,
      stats: [
        { label: 'Weight Cut', val: '30kg' },
        { label: 'Bio-Content', val: '45%' }
      ]
    }
  ];

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    
    // Start the real sync in the background
    f1Service.syncLiveData().then(() => {
      // Sync finishes after progress bar completes (timed intentionally)
    });

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsDecrypted(true);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setActiveCoord({ x: e.clientX % 100, y: e.clientY % 100 });
    };
    
    // Live Telemetry Loop
    const telemetryInterval = setInterval(async () => {
      if (isScanning || isDecrypted) {
        const data = await f1Service.getLiveTelemetry();
        setTelemetry(data);
      }
    }, 200);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(telemetryInterval);
    };
  }, [isScanning, isDecrypted]);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-9 mt-24 mb-32 relative">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full border-x border-ink/20 flex divide-x divide-ink/20">
          {[...Array(6)].map((_, i) => <div key={i} className="flex-1" />)}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] text-racing tracking-[0.3em] font-bold uppercase mb-4 flex items-center gap-3"
          >
            <Settings size={14} className="animate-[spin_10s_linear_infinite]" />
            Technical Regulations 2026.V2
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[0.95]"
          >
            The <span className="italic text-racing">Sustainable</span> Speed <br />
            Revolution.
          </motion.h2>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex gap-8 border-l border-ink/10 pl-8 hidden lg:flex"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mb-1">Downforce</span>
            <span className="font-serif italic text-2xl text-ink font-bold">-{isScanning ? Math.floor(Math.random() * 50) : 40}%</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-ink-3 uppercase tracking-widest mb-1">Heat Energy</span>
            <span className="font-serif italic text-2xl text-ink font-bold">+{isScanning ? Math.floor(Math.random() * 20) : 15}%</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-ink bg-paper shadow-(--color-ink)/5 overflow-hidden">
        {specs.map((spec, i) => (
          <motion.div 
            key={spec.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 flex flex-col border-ink/10 ${i !== specs.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''} hover:bg-ink/[0.02] transition-colors group relative`}
          >
            {/* Top Micro-labels */}
            <div className="flex justify-between items-center mb-10">
              <div className="p-2 border border-ink/10 bg-paper">
                {spec.icon}
              </div>
              <div className="font-mono text-[9px] text-ink-3 font-medium uppercase tracking-[0.2em]">0{i + 1} // TECH</div>
            </div>

            <div className="mb-2">
              <span className="font-mono text-[8px] text-racing font-bold uppercase tracking-[0.3em] mb-1 block">
                {spec.kicker}
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink leading-tight group-hover:text-racing transition-colors">
                {spec.title}
              </h3>
            </div>

            <p className="text-ink-2 text-sm leading-relaxed mb-8 font-medium">
              {spec.description}
            </p>

            <div className="mt-auto pt-8 border-t border-ink/5 grid grid-cols-2 gap-4">
              {spec.stats.map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-[8px] text-ink-3 uppercase tracking-wider mb-0.5">{stat.label}</span>
                  <span className="font-mono text-lg text-ink font-bold tabular-nums">{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-racing/0 group-hover:border-racing/30 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-racing/0 group-hover:border-racing/30 transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Blueprint Visual Element */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-12 border-2 border-ink bg-paper bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 border-l border-b border-ink/10 font-mono text-[8px] uppercase tracking-widest text-ink-3 animate-pulse flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-racing rounded-full" />
          Live Data Stream Active
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="font-serif text-3xl font-bold text-ink mb-4 italic">The Master Blueprint</h4>
            <p className="text-ink-2 text-sm leading-relaxed mb-8 max-w-lg font-medium">
              Every curve, every sensor, and every watt is optimized for the grid of 2026. The shift to zero-emissions power units marks the greatest engineering challenge in sporting history.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center group-hover/item:border-racing transition-colors">
                  <Gauge size={16} className="text-ink-3 group-hover/item:text-racing" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-mono text-[10px] text-ink font-bold uppercase tracking-wider">Thermal Efficiency</div>
                    <div className="font-mono text-[9px] text-racing font-bold">{isScanning ? scanProgress : 85}%</div>
                  </div>
                  <div className="w-full h-1.5 bg-ink/5 relative overflow-hidden">
                    <motion.div 
                      key={isScanning ? 'scanning' : 'static'}
                      initial={{ width: 0 }}
                      animate={{ width: `${isScanning ? scanProgress : 85}%` }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="absolute inset-0 bg-racing"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center group-hover/item:border-racing transition-colors">
                  <Cpu size={16} className="text-ink-3 group-hover/item:text-racing" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-mono text-[10px] text-ink font-bold uppercase tracking-wider">AI Processing Delta</div>
                    <div className="font-mono text-[9px] text-racing font-bold">{isScanning ? Math.min(scanProgress + 10, 100) : 92}%</div>
                  </div>
                  <div className="w-full h-1.5 bg-ink/5 relative overflow-hidden">
                    <motion.div 
                      key={isScanning ? 'scanning-cpu' : 'static-cpu'}
                      initial={{ width: 0 }}
                      animate={{ width: `${isScanning ? Math.min(scanProgress + 10, 100) : 92}%` }}
                      transition={{ type: 'spring', damping: 20, delay: 0.1 }}
                      className="absolute inset-0 bg-racing"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleScan}
              disabled={isScanning}
              className={`mt-10 px-6 py-2.5 bg-ink text-paper font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:bg-racing hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'Diagnostic in Progress...' : 'Initialize System Scan'}
            </button>
          </div>
          
          <div className="relative group/canvas w-full">
            <div 
              onClick={() => setIsDecrypted(!isDecrypted)}
              className="w-full min-h-[420px] border-2 border-ink bg-ink/[0.02] rounded-xs p-8 flex items-center justify-center relative overflow-hidden cursor-crosshair transition-all hover:bg-ink/[0.04]"
            >
              {/* Animated Scan Line */}
              {isScanning && (
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-[2px] bg-racing/50 z-20 shadow-[0_0_15px_rgba(239,1,7,0.5)]"
                />
              )}

              {/* Grid Context Overlay */}
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
                <div className="w-full h-full grid grid-cols-10 grid-rows-10 divide-x divide-y divide-ink" />
              </div>

              <Wind size={80} className="text-ink/10 absolute -top-10 -right-10 rotate-12" />
              
              <div className="relative z-10 text-center w-full h-full flex flex-col justify-center">
                <div className="font-mono text-[9px] text-racing font-bold uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-racing animate-ping' : isDecrypted ? 'bg-green-500' : 'bg-ink/30'}`} />
                  {isScanning ? 'System Scanning...' : isDecrypted ? 'MCL-61 CAD ACTIVE' : 'MCL-61 CAD ENCRYPTED'}
                </div>
                
                <div className="w-full flex-1 min-h-[220px] border-2 border-dashed border-ink/20 flex flex-col items-center justify-center relative bg-paper/50 backdrop-blur-[2px] transition-all overflow-hidden mb-6">
                   <AnimatePresence mode="wait">
                     {!isDecrypted && !isScanning ? (
                       <motion.div 
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                       >
                         <Lock size={20} className="text-ink-3" />
                         <span className="font-mono text-[8px] text-ink-3 uppercase italic tracking-widest">[ SECURITY PROTOCOL ACTIVE ]</span>
                         <span className="font-mono text-[7px] text-racing uppercase font-bold animate-pulse">Click to Authenticate</span>
                       </motion.div>
                     ) : (
                       <motion.div 
                        key="active"
                        initial={{ opacity: 1 }}
                        className="w-full h-full p-4 relative flex items-center justify-center"
                       >
                         {/* Dynamic Wireframe Background */}
                         <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.15]">
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            
                            {/* Moving Scan Vectors */}
                            <motion.line 
                              x1="0" y1="50%" x2="100%" y2="50%"
                              stroke="var(--color-racing)"
                              strokeWidth="1"
                              animate={{ y1: ['0%', '100%'], y2: ['0%', '100%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                         </svg>

                         <div className="relative z-10 flex flex-col items-center gap-2">
                           {telemetry && (
                             <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mb-2 flex items-center gap-6"
                             >
                                <div className="flex flex-col items-center">
                                  <span className="font-mono text-[18px] text-racing font-bold tabular-nums">{telemetry.speed}</span>
                                  <span className="font-mono text-[7px] text-ink-3 uppercase">KM/H</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="font-mono text-[18px] text-ink font-bold">{telemetry.gear}</span>
                                  <span className="font-mono text-[7px] text-ink-3 uppercase">GEAR</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="font-mono text-[18px] text-ink font-bold tabular-nums">{(telemetry.rpm / 1000).toFixed(1)}k</span>
                                  <span className="font-mono text-[7px] text-ink-3 uppercase">RPM</span>
                                </div>
                             </motion.div>
                           )}
                           
                           <div className="flex gap-4">
                             {[...Array(3)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ 
                                   height: [10, 30, 15, 25, 10],
                                   opacity: [0.3, 1, 0.5]
                                 }}
                                 transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
                                 className="w-1 bg-racing rounded-full"
                               />
                             ))}
                           </div>
                           <span className="font-mono text-[9px] text-ink font-bold uppercase tracking-widest">
                             {isScanning ? `SECTOR_${Math.floor(scanProgress / 20)}_SYNC` : 'TELEMETRY_LINK_ESTABLISHED'}
                           </span>
                           {telemetry && (
                             <div className="flex gap-4 mt-2">
                               <div className="h-1 w-16 bg-ink/10 relative overflow-hidden rounded-full">
                                  <motion.div 
                                    className="absolute inset-y-0 left-0 bg-racing"
                                    animate={{ width: `${telemetry.throttle}%` }}
                                  />
                               </div>
                               <div className="h-1 w-16 bg-ink/10 relative overflow-hidden rounded-full">
                                  <motion.div 
                                    className="absolute inset-y-0 left-0 bg-blue-500"
                                    animate={{ width: `${telemetry.brake}%` }}
                                  />
                               </div>
                             </div>
                           )}
                         </div>

                         {/* Side Telemetry */}
                         <div className="absolute top-2 left-2 text-left space-y-1">
                            <div className="font-mono text-[7px] text-racing font-bold">X: {activeCoord.x.toFixed(2)}</div>
                            <div className="font-mono text-[7px] text-racing font-bold">Y: {activeCoord.y.toFixed(2)}</div>
                            <div className="font-mono text-[6px] text-ink-3">AERO_LOAD_01</div>
                         </div>
                         <div className="absolute top-2 right-2 text-right">
                            <div className="font-mono text-[7px] text-ink font-bold">MODE: CAD_RECON</div>
                            <div className="font-mono text-[6px] text-ink-3">BUILD_2026.04.25</div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-center gap-8">
                  <div className="flex flex-col items-center bg-paper border border-ink/5 px-4 py-2 min-w-[80px]">
                    <div className="font-mono text-[14px] text-ink font-bold tabular-nums">
                      {isScanning ? (Math.random() * 2).toFixed(2) : '1.42'}s
                    </div>
                    <div className="font-mono text-[7px] text-ink-3 uppercase tracking-tighter">Latent Delay</div>
                  </div>
                  <div className="flex flex-col items-center bg-paper border border-ink/5 px-4 py-2 min-w-[80px]">
                    <div className="font-mono text-[14px] text-ink font-bold">100%</div>
                    <div className="font-mono text-[7px] text-ink-3 uppercase tracking-tighter">Sync Health</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Design Callout */}
            <div className="absolute -bottom-4 -right-4 bg-racing text-white font-mono text-[8px] px-3 py-1 font-bold uppercase tracking-widest shadow-xl border border-white/10 z-30">
              {isDecrypted ? 'Access Level: ALPHA' : 'Auth Required'}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
