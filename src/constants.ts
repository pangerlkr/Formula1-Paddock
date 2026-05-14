/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, Team, Race, NewsItem } from './types.ts';

export const DRIVERS: Driver[] = [
  { 
    id: 'ant', pos: 1, name: 'K. Antonelli', code: 'ANT', team: 'Mercedes', country: 'ITA', pts: 84, gap: 0, color: '#27F4D2', isFav: true,
    bio: "The 19-year-old sensation has become the youngest-ever Formula 1 championship leader. Back-to-back wins in Shanghai and Suzuka, plus a P3 in Miami, have extended his commanding lead. Kimi is the undisputed frontrunner of the 2026 season.",
    careerStats: { wins: 2, podiums: 4, titles: 0, races: 4 },
    image: '/Driver-photo/Antonelli.png'
  },
  { 
    id: 'rus', pos: 2, name: 'G. Russell', code: 'RUS', team: 'Mercedes', country: 'GBR', pts: 68, gap: -16, color: '#27F4D2',
    bio: "George remains a core title contender. After leading a Mercedes 1-2 in the season opener and securing P2 in China, a P4 in Miami keeps him firmly in championship contention behind his record-breaking teammate.",
    careerStats: { wins: 5, podiums: 24, titles: 0, races: 147 },
    image: '/Driver-photo/Russel.jpg'
  },
  { 
    id: 'lec', pos: 3, name: 'C. Leclerc', code: 'LEC', team: 'Ferrari', country: 'MON', pts: 50, gap: -34, color: '#E8002D',
    bio: "Charles continues to be Ferrari's leading light. His P3 finish at Suzuka and P6 in Miami proved his technical management of the hybrid systems is second to none — but Red Bull's surge threatens his podium position.",
    careerStats: { wins: 12, podiums: 45, titles: 0, races: 155 },
    image: '/Driver-photo/Leclerc.png'
  },
  { 
    id: 'ver', pos: 4, name: 'M. Verstappen', code: 'VER', team: 'Red Bull', country: 'NED', pts: 49, gap: -35, color: '#EF0107',
    bio: "The Red Bull Ford upgrade delivered. Max Verstappen dominated the Miami Grand Prix, converting pole to victory and announcing the Austrian squad's return to winning form. The 5-time champion is now a serious title threat.",
    careerStats: { wins: 65, podiums: 113, titles: 5, races: 216 },
    image: '/Driver-photo/Verstappen.jpg'
  },
  { 
    id: 'nor', pos: 5, name: 'L. Norris', code: 'NOR', team: 'McLaren', country: 'GBR', pts: 48, gap: -36, color: '#FF8000',
    bio: "Lando delivered McLaren's best result of the season with P2 in Miami, capitalizing on his tire management and a stunning late overtake on Russell. The Woking squad is now a genuine threat for the constructors' podium.",
    careerStats: { wins: 5, podiums: 30, titles: 0, races: 133 },
    image: '/Driver-photo/Norris.png'
  },
  { 
    id: 'ham', pos: 6, name: 'L. Hamilton', code: 'HAM', team: 'Ferrari', country: 'GBR', pts: 39, gap: -45, color: '#E8002D',
    bio: "The 7-time champion showed vintage form in China but had a difficult strategic run in Japan and Miami. Lewis is still the master of energy deployment in the scarlet Ferrari, but the gap to the top is growing.",
    careerStats: { wins: 105, podiums: 202, titles: 7, races: 363 },
    image: '/Driver-photo/Hamilton.png'
  },
  { 
    id: 'pia', pos: 7, name: 'O. Piastri', code: 'PIA', team: 'McLaren', country: 'AUS', pts: 28, gap: -56, color: '#FF8000',
    bio: "Oscar delivered a spectacular P2 at Suzuka, capitalizing on a late safety car. A P7 in Miami was a quieter outing, but the 'Ice Man' of 2026 is proving he can challenge for wins when the technical window opens.",
    careerStats: { wins: 3, podiums: 13, titles: 0, races: 86 },
    image: '/Driver-photo/Piastri.jpg'
  },
  { 
    id: 'bea', pos: 9, name: 'O. Bearman', code: 'BEA', team: 'Haas', country: 'GBR', pts: 12, gap: -72, color: '#B6BABD',
    bio: "The young Brit confirmed his potential in 2024 and is now a regular point-scorer at Haas. His ability to handle high-G loads and varying weather conditions has made him a fan favorite.",
    careerStats: { wins: 0, podiums: 0, titles: 0, races: 32 },
    image: '/Driver-photo/Bearman.png'
  },
  { 
    id: 'gas', pos: 10, name: 'P. Gasly', code: 'GAS', team: 'Alpine', country: 'FRA', pts: 8, gap: -67, color: '#0093CC',
    bio: "Pierre remains the heart of the Alpine project. Fighting through a difficult transition period, his resilience and feedback are driving the Enstone team's rapid 2026 development cycle.",
    careerStats: { wins: 1, podiums: 4, titles: 0, races: 168 },
    image: '/Driver-photo/Gasly.png'
  },
];

export const TEAMS: Team[] = [
  { id: 'merc', pos: 1, name: 'Mercedes-AMG', engine: 'Mercedes PU', country: 'DEU', pts: 152, color: '#27F4D2', isFav: true },
  { id: 'ferr', pos: 2, name: 'Scuderia Ferrari', engine: 'Ferrari PU', country: 'ITA', pts: 89, color: '#E8002D' },
  { id: 'mcla', pos: 3, name: 'McLaren', engine: 'Mercedes PU', country: 'GBR', pts: 76, color: '#FF8000' },
  { id: 'redb', pos: 4, name: 'Red Bull Racing', engine: 'Red Bull Ford', country: 'AUT', pts: 61, color: '#EF0107' },
  { id: 'rbul', pos: 5, name: 'Racing Bulls', engine: 'Red Bull Ford', country: 'ITA', pts: 42, color: '#6692FF', isFav: true },
  { id: 'haas', pos: 6, name: 'Haas F1', engine: 'Ferrari PU', country: 'USA', pts: 18, color: '#B6BABD' },
  { id: 'alpi', pos: 7, name: 'Alpine', engine: 'Mercedes PU', country: 'FRA', pts: 10, color: '#0093CC' },
  { id: 'will', pos: 8, name: 'Williams', engine: 'Mercedes PU', country: 'GBR', pts: 4, color: '#64C4FF' },
  { id: 'asto', pos: 9, name: 'Aston Martin', engine: 'Honda PU', country: 'GBR', pts: 2, color: '#229971' },
  { id: 'audi', pos: 10, name: 'Audi', engine: 'Audi PU', country: 'DEU', pts: 0, color: '#00877C' },
];

export const CALENDAR: Race[] = [
  { 
    round: 'SHK', country: 'United Kingdom', flag: '🇬🇧', circuit: 'Silverstone Shakedown', date: 'Jan 15–20', isDone: true,
    location: 'Silverstone Circuit · Northamptonshire', laps: 15, distance: '88.365 km',
    podium: ['Mercedes W17', 'Ferrari F2026', 'McLaren MCL61'], leadingTeam: { name: 'Mercedes', pts: 0, color: '#27F4D2' }
  },
  { 
    round: 'LCH', country: 'Global', flag: '🌐', circuit: 'Car Reveal Season', date: 'Feb 05–15', isDone: true,
    location: 'Official Team Headquarters · Remote Uplink', laps: 0, distance: '0.000 km',
    podium: ['Ferrari', 'Mercedes', 'Red Bull'], leadingTeam: { name: 'Ferrari (Hype)', pts: 0, color: '#E8002D' }
  },
  { 
    round: 'TST', country: 'Bahrain', flag: '🇧🇭', circuit: 'Pre-Season Testing', date: 'Feb 21–23', isDone: true,
    location: 'Bahrain International Circuit · Sakhir', laps: 240, distance: '1298.880 km',
    podium: ['M. Verstappen', 'G. Russell', 'C. Leclerc'], leadingTeam: { name: 'Red Bull', pts: 0, color: '#EF0107' }
  },
  { 
    round: 1, country: 'Australia', flag: '🇦🇺', circuit: 'Albert Park', date: 'Mar 08', winner: 'G. Russell', isDone: true,
    location: 'Albert Park Circuit · Melbourne', laps: 58, distance: '306.124 km',
    podiumDetailed: [
      { driver: 'G. Russell', team: 'Mercedes', gap: 'WINNER' },
      { driver: 'K. Antonelli', team: 'Mercedes', gap: '+2.442' },
      { driver: 'C. Leclerc', team: 'Ferrari', gap: '+8.901' }
    ],
    fastestLap: { driver: 'G. Russell', time: '1:19.813' },
    strategy: 'S-M-H · VSC Advantage', weather: 'Sunny · 24°C',
    leadingTeam: { name: 'Mercedes-AMG', pts: 43, color: '#27F4D2' }
  },
  { 
    round: 2, country: 'China', flag: '🇨🇳', circuit: 'Shanghai', date: 'Mar 15', winner: 'K. Antonelli', isDone: true,
    location: 'Shanghai International Circuit · Jiading', laps: 56, distance: '305.066 km',
    podiumDetailed: [
      { driver: 'K. Antonelli', team: 'Mercedes', gap: '1:33:15.607' },
      { driver: 'G. Russell', team: 'Mercedes', gap: '+5.515s' },
      { driver: 'L. Hamilton', team: 'Ferrari', gap: '+25.267s' }
    ],
    fastestLap: { driver: 'K. Antonelli', time: '1:34.908' },
    strategy: 'M-H · Pole Start', weather: 'Cloudy · 19°C',
    leadingTeam: { name: 'Mercedes-AMG', pts: 43, color: '#27F4D2' }
  },
  { 
    round: 3, country: 'Japan', flag: '🇯🇵', circuit: 'Suzuka', date: 'Mar 29', winner: 'K. Antonelli', isDone: true,
    location: 'Suzuka International Racing Course · Mie Prefecture', laps: 53, distance: '307.471 km',
    podiumDetailed: [
      { driver: 'K. Antonelli', team: 'Mercedes', gap: 'WINNER' },
      { driver: 'O. Piastri', team: 'McLaren', gap: '+4.112s' },
      { driver: 'C. Leclerc', team: 'Ferrari', gap: '+6.267s' }
    ],
    fastestLap: { driver: 'K. Antonelli', time: '1:28.411' },
    strategy: 'M-H · Recovery Win', weather: 'Clear · 18°C',
    leadingTeam: { name: 'Mercedes-AMG', pts: 85, color: '#27F4D2' }
  },
  { 
    round: 4, country: 'Bahrain', flag: '🇧🇭', circuit: 'Sakhir', date: 'Apr 11–13', isCancelled: true,
    location: 'Bahrain International Circuit · Sakhir', laps: 57, distance: '308.238 km'
  },
  { 
    round: 5, country: 'Saudi Arabia', flag: '🇸🇦', circuit: 'Jeddah', date: 'Apr 18–20', isCancelled: true,
    location: 'Jeddah Corniche Circuit · Jeddah', laps: 50, distance: '308.450 km'
  },
  { 
    round: 6, country: 'USA', flag: '🇺🇸', circuit: 'Miami', date: 'May 04', winner: 'M. Verstappen', isDone: true,
    location: 'Miami International Autodrome · Hard Rock Stadium', laps: 57, distance: '308.326 km',
    podiumDetailed: [
      { driver: 'M. Verstappen', team: 'Red Bull', gap: 'WINNER' },
      { driver: 'L. Norris', team: 'McLaren', gap: '+4.721s' },
      { driver: 'K. Antonelli', team: 'Mercedes', gap: '+9.338s' }
    ],
    fastestLap: { driver: 'M. Verstappen', time: '1:28.842' },
    strategy: 'M-H · Upgrade Delivers', weather: 'Sunny · 32°C',
    leadingTeam: { name: 'Mercedes-AMG', pts: 152, color: '#27F4D2' }
  },
  { round: 7, country: 'Emilia-Romagna', flag: '🇮🇹', circuit: 'Imola', date: 'May 16–18', isNext: true, location: 'Autodromo Enzo e Dino Ferrari · Emilia-Romagna', laps: 63, distance: '309.049 km' },
  { round: 8, country: 'Monaco', flag: '🇲🇨', circuit: 'Monte Carlo', date: 'May 23–25', location: 'Circuit de Monaco · Monte Carlo', laps: 78, distance: '260.286 km' },
  { round: 9, country: 'Spain', flag: '🇪🇸', circuit: 'Barcelona', date: 'May 30–Jun 01', location: 'Circuit de Barcelona-Catalunya · Montmeló', laps: 66, distance: '307.236 km' },
  { round: 10, country: 'Canada', flag: '🇨🇦', circuit: 'Montreal', date: 'Jun 13–15', location: 'Circuit Gilles Villeneuve · Montreal', laps: 70, distance: '305.270 km' },
  { round: 11, country: 'Austria', flag: '🇦🇹', circuit: 'Spielberg', date: 'Jun 27–29', location: 'Red Bull Ring · Styria', laps: 71, distance: '306.452 km' },
  { round: 12, country: 'UK', flag: '🇬🇧', circuit: 'Silverstone', date: 'Jul 04–06', location: 'Silverstone Circuit · Northamptonshire', laps: 52, distance: '306.198 km' },
  { round: 13, country: 'Belgium', flag: '🇧🇪', circuit: 'Spa-Francorchamps', date: 'Jul 25–27', location: 'Circuit de Spa-Francorchamps · Stavelot', laps: 44, distance: '308.052 km' },
  { round: 14, country: 'Hungary', flag: '🇭🇺', circuit: 'Hungaroring', date: 'Aug 01–03', location: 'Hungaroring · Mogyoród', laps: 70, distance: '306.630 km' },
  { round: 15, country: 'Netherlands', flag: '🇳🇱', circuit: 'Zandvoort', date: 'Aug 29–31', location: 'Circuit Zandvoort · North Holland', laps: 72, distance: '306.587 km' },
  { round: 16, country: 'Italy', flag: '🇮🇹', circuit: 'Monza', date: 'Sep 05–07', location: 'Autodromo Nazionale Monza · Monza', laps: 53, distance: '306.720 km' },
  { round: 17, country: 'Azerbaijan', flag: '🇦🇿', circuit: 'Baku', date: 'Sep 19–21', location: 'Baku City Circuit · Baku', laps: 51, distance: '306.049 km' },
  { round: 18, country: 'Singapore', flag: '🇸🇬', circuit: 'Marina Bay', date: 'Oct 03–05', location: 'Marina Bay Street Circuit · Singapore', laps: 62, distance: '306.143 km' },
  { round: 19, country: 'USA', flag: '🇺🇸', circuit: 'COTA Austin', date: 'Oct 17–19', location: 'Circuit of the Americas · Austin', laps: 56, distance: '308.405 km' },
  { round: 20, country: 'Mexico', flag: '🇲🇽', circuit: 'Mexico City', date: 'Oct 24–26', location: 'Autódromo Hermanos Rodríguez · Mexico City', laps: 71, distance: '305.354 km' },
  { round: 21, country: 'Brazil', flag: '🇧🇷', circuit: 'Interlagos', date: 'Nov 07–09', location: 'Autódromo José Carlos Pace · São Paulo', laps: 71, distance: '305.879 km' },
  { round: 22, country: 'USA', flag: '🇺🇸', circuit: 'Las Vegas', date: 'Nov 20–22', location: 'Las Vegas Strip Circuit · Las Vegas', laps: 50, distance: '310.050 km' },
  { round: 23, country: 'Qatar', flag: '🇶🇦', circuit: 'Lusail', date: 'Nov 28–30', location: 'Lusail International Circuit · Lusail', laps: 57, distance: '308.611 km' },
  { round: 24, country: 'UAE', flag: '🇦🇪', circuit: 'Yas Marina', date: 'Dec 05–07', location: 'Yas Marina Circuit · Abu Dhabi', laps: 58, distance: '306.183 km' },
];

export const NEWS: NewsItem[] = [
  { 
    id: 1, kicker: 'The Story', type: 'lead',
    headline: "Antonelli's rookie surge rewrites Mercedes' championship math", 
    body: "Three rounds into the 2026 regulations, 19-year-old Kimi Antonelli has shattered all rookie expectations. With back-to-back wins in Shanghai and Suzuka, the Italian prodigy has forced Toto Wolff to reconsider the team's hierarchy. Telemetry shows Antonelli is finding 0.2s more than Russell in high-speed compression zones, particularly through Suzuka's Degner sequences. The 'W17' chassis appears perfectly balanced for his aggressive input style."
  },
  { 
    id: 2, kicker: 'Engine Wars', 
    headline: "Red Bull Ford PU upgrade delivers: Verstappen dominates Miami", 
    body: "The 'significant' software patch for the Red Bull Ford Energy Management System lived up to its billing at the Miami Grand Prix. Max Verstappen led every lap from pole to take a dominant victory, his first win of the 2026 season. Paddock sources confirm the EMS fix eliminated the 350kW MGU-K deployment clipping that had cost nearly 0.4s per lap in Japan. Red Bull's upgrade has reset the championship picture heading into the European leg."
  },
  { 
    id: 3, kicker: 'Aero Update', 
    headline: "FIA monitors 'Z-Mode' jitter as active aero controversy heats up", 
    body: "The 2026 active aerodynamics—X-Mode for corners and Z-Mode for straights—is under the microscope. Several drivers, including Lewis Hamilton, have reported a 'distressing' aerodynamic shift during the transition phase. The flap adjustment, which reduces drag by nearly 30%, is causing mid-corner high-speed instability for teams struggling with sensor synchronization. Ferrari's 'Vela' system appears the most stable currently."
  },
  { 
    id: 4, kicker: 'Paddock Rumor', 
    headline: "Newey's Aston Martin 'Stage 2' floor targets European leg boom", 
    body: "Adrian Newey's first full influence on the Aston Martin AMR26 is reportedly nearing its next evolution. The 'Stage 2' floor, utilizing specialized vortex generators designed to stabilize the 2026-spec smaller diffuser, is rumored to provide a massive jump in low-speed traction. Fernando Alonso has hinted that the team is only at 60% of its potential wind tunnel correlation."
  },
  { 
    id: 5, kicker: 'Expansion', 
    headline: "Cadillac (Andretti) focus shifts to 2028 in-house PU development", 
    body: "While currently using Ferrari customer units, the Cadillac/GM engineering hub in Charlotte is already testing its 2028 prototype V6. General Motors executive Eric Warren stated that the data gathered from the 'Caddy-1' chassis in these opening rounds is being fed directly into their dyno simulations. The goal is to parity with the big three manufacturers by their third season."
  },
  { 
    id: 6, kicker: 'Audi Watch', 
    headline: "Binotto's Audi restructuring targets 2027 for first podium push", 
    body: "The Audi works project, currently operating under the Sauber name in Neuburg and Hinwil, has adopted a 'long-game' strategy. Mattia Binotto has reportedly overhauled the turbocompressor assembly line after recurring thermal efficiency issues in pre-season testing. The German manufacturer is prioritizing reliability over one-lap pace for the first half of the 2026 campaign."
  }
];

export const TICKER_ITEMS = [
  { sym: 'WDC', val: 'ANTONELLI ⭐', pts: '84 pts' },
  { sym: 'GAP', val: 'RUSSELL', pts: '-16 pts' },
  { sym: 'WCC', val: 'MERCEDES ⭐', pts: '152 pts' },
  { sym: 'NEXT', val: 'IMOLA GP', pts: 'MAY 16' },
  { sym: 'RECORD', val: 'ANTONELLI', pts: '19y LEADER' },
  { sym: 'WIN', val: 'VERSTAPPEN', pts: 'MIAMI WIN' },
];
