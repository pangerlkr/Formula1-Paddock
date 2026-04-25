
import { DRIVERS, TEAMS } from '../constants';

export interface F1Telemetry {
  speed: number;
  gear: number;
  rpm: number;
  drs: boolean;
  throttle: number;
  brake: number;
}

export const f1Service = {
  async syncLiveData() {
    // Simulate API network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now();
        
        // Load existing or default
        const saved = localStorage.getItem('f1_live_sync');
        let drivers = DRIVERS;
        let teams = TEAMS;
        
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.drivers) drivers = data.drivers;
            if (data.teams) teams = data.teams;
          } catch(e) {}
        }

        // Apply some "live" variance
        const updatedDrivers = drivers.map(d => ({
          ...d,
          pts: d.pts + (Math.random() > 0.8 ? 1 : 0)
        })).sort((a,b) => b.pts - a.pts).map((d, i) => ({ ...d, pos: i + 1 }));

        const updatedTeams = teams.map(t => ({
          ...t,
          pts: t.pts + (Math.random() > 0.8 ? 2 : 0)
        })).sort((a,b) => b.pts - a.pts).map((t, i) => ({ ...t, pos: i + 1 }));

        localStorage.setItem('f1_live_sync', JSON.stringify({
          timestamp,
          status: 'online',
          latency: Math.floor(Math.random() * 50) + 10,
          drivers: updatedDrivers,
          teams: updatedTeams
        }));
        
        window.dispatchEvent(new CustomEvent('f1_live_sync_completed', { 
          detail: { timestamp } 
        }));
        
        resolve(timestamp);
      }, 1500);
    });
  },

  getLiveTelemetry(): F1Telemetry {
    return {
      speed: Math.floor(Math.random() * 120) + 210,
      gear: Math.floor(Math.random() * 3) + 6,
      rpm: Math.floor(Math.random() * 2000) + 10500,
      drs: Math.random() > 0.8,
      throttle: Math.floor(Math.random() * 20) + 80,
      brake: Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0,
    };
  },

  getLiveStandingsUpdate(currentDrivers: any[]) {
    return currentDrivers.map(d => ({
      ...d,
      pts: d.pts + (Math.random() > 0.7 ? 1 : 0) // Occasionally add a point to simulate live scoring
    })).sort((a, b) => b.pts - a.pts)
       .map((d, i) => ({ ...d, pos: i + 1 }));
  }
};
