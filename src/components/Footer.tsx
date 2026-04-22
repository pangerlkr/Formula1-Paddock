/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Facebook, Linkedin, Twitter, Globe, Copyright } from 'lucide-react';

export function Footer({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const socials = [
    { icon: Instagram, url: 'https://instagram.com/panger__lkr', label: 'INSTAGRAM' },
    { icon: Facebook, url: 'https://facebook.com/lkr.panger', label: 'FACEBOOK' },
    { icon: Linkedin, url: 'https://linkedin.com/in/pangerlkr', label: 'LINKEDIN' },
    { icon: Twitter, url: 'https://x.com/panger__lkr', label: 'X (TWITTER)' },
  ];

  const teamBase = theme === 'dark' ? 'Milton Keynes' : 'Brackley';
  const teamTitle = theme === 'dark' ? 'Bull Pen' : 'Silver Arrows';
  const teamMotto = theme === 'dark' ? 'Designed for the charge.' : 'Engineered for dominance.';
  const teamAuth = theme === 'dark' ? 'Red Bull Auth' : 'Petronas Auth';
  const teamPower = theme === 'dark' ? 'Bull Powered' : 'Star Powered';
  const teamVersion = theme === 'dark' ? 'RBR-v1.0.4' : 'MGP-v1.0.4';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.9, 0.25, 1] } }
  };

  return (
    <footer className="max-w-7xl mx-auto px-9 pb-16 mt-16 group transition-colors duration-500 relative">
      {/* Dynamic Scan Line Animation */}
      <div className="absolute top-0 inset-x-9 h-[1px] overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`h-full w-40 bg-linear-to-r from-transparent ${theme === 'dark' ? 'via-racing' : 'via-mercedes'} to-transparent`}
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t-2 border-ink mb-8"
      >
        {/* Branding Sector */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="font-mono text-[9px] text-mercedes tracking-[0.2em] font-bold uppercase mb-2">Sector {teamBase} · Comms</div>
          <div className="font-serif text-3xl italic text-ink leading-none">
            The <span className="text-racing font-bold">{teamTitle}</span>
          </div>
          <div className="font-mono text-[10px] text-ink-3 leading-relaxed tracking-wider">
            High-performance telemetry and aerodynamic intelligence. {teamMotto}
          </div>
        </motion.div>

        {/* Direct Contact */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="font-mono text-[9px] text-ink-3 tracking-[0.2em] font-bold uppercase mb-2">Direct Link</div>
          <a href="mailto:contact@pangerlkr.link" className="flex items-center gap-3 group/link cursor-pointer">
            <div className="p-2 bg-ink text-paper group-hover/link:bg-racing transition-colors duration-300 relative overflow-hidden">
              <motion.div 
                whileHover={{ y: ['0%', '100%'] }}
                className="absolute inset-0 bg-white/20 pointer-events-none"
              />
              <Mail size={14} className="relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-ink-3 font-semibold uppercase">Uplink</span>
              <span className="text-xs font-bold text-ink group-hover/link:text-racing transition-colors tracking-tight">contact@pangerlkr.link</span>
            </div>
          </a>
          <a href="tel:+918132872135" className="flex items-center gap-3 group/link cursor-pointer">
            <div className="p-2 bg-ink text-paper group-hover/link:bg-mercedes transition-colors duration-300 relative overflow-hidden">
              <motion.div 
                whileHover={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="absolute inset-0 bg-white/10 pointer-events-none"
              />
              <Phone size={14} className="relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-ink-3 font-semibold uppercase">Team Radio</span>
              <span className="text-xs font-bold text-ink group-hover/link:text-mercedes transition-colors tracking-tight">+91 8132872135</span>
            </div>
          </a>
        </motion.div>

        {/* Social Intel */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="font-mono text-[9px] text-ink-3 tracking-[0.15em] font-bold uppercase mb-2">Paddock Socials</div>
          <div className="grid grid-cols-2 gap-3">
            {socials.map((soc, i) => (
              <motion.a 
                whileHover={{ x: 3 }}
                key={i} 
                href={soc.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2 border border-ink/10 hover:border-racing hover:bg-paper-2 transition-all group/soc"
              >
                <soc.icon size={12} className="text-ink-3 group-hover/soc:text-racing" />
                <span className="font-mono text-[8px] font-bold text-ink-3 group-hover/soc:text-ink">{soc.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* System Status / Copyright */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="font-mono text-[9px] text-ink-3 tracking-[0.2em] font-bold uppercase mb-2">{teamAuth}</div>
          <div className="bg-paper-2 p-4 border-l-4 border-mercedes transition-colors duration-500 overflow-hidden relative">
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 pointer-events-none checker-bg"
            />
            <div className="flex items-center gap-2 mb-2 text-ink relative z-10">
              <Copyright size={12} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Panger Lkr</span>
            </div>
            <div className="font-mono text-[8px] text-ink-3 tracking-widest uppercase relative z-10">
              {teamPower} · MMXXVI
            </div>
            <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-ink-3 relative z-10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {theme === 'dark' ? 'Honda HRC' : 'Mercedes HPP'} Data Verified
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Extreme Bottom Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-ink-3 uppercase tracking-[0.18em]"
      >
        <div className="flex items-center">
          For Pangerkumzuk · eyes only
          <span className={`w-1 h-1 rounded-full mx-2 transition-colors duration-500 ${theme === 'dark' ? 'bg-racing' : 'bg-mercedes'}`} />
          Full Push · {theme === 'dark' ? 'Leave them behind' : 'The best or nothing'}
        </div>
        <div className="flex items-center gap-2">
          <span>{teamVersion}</span>
          <span className="text-racing">◆</span>
          <span>Bld: 2026.04.22</span>
        </div>
      </motion.div>
    </footer>
  );
}
