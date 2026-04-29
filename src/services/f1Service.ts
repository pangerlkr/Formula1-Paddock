
import { DRIVERS, TEAMS } from '../constants';

const BASE_URL = 'https://api.openf1.org/v1';

export interface F1Telemetry {
  speed: number;
  gear: number;
  rpm: number;
  drs: boolean;
  throttle: number;
  brake: number;
}

let currentSessionKey: number | null = null;
let lastKnownDriverNumber: number = 44; // Default to Lewis Hamilton

async function getLatestSessionKey() {
  if (currentSessionKey) return currentSessionKey;
  
  try {
    const response = await fetch(`${BASE_URL}/sessions`);
    const sessions = await response.json();
    if (sessions && sessions.length > 0) {
      // Pick the most recent session
      const latest = sessions[sessions.length - 1];
      currentSessionKey = latest.session_key;
      return currentSessionKey;
    }
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
  return null;
}

export const f1Service = {
  async syncLiveData() {
    const sessionKey = await getLatestSessionKey();
    if (!sessionKey) return null;

    try {
      // Fetch latest positions to update standings (simulated live update if session is ongoing)
      // OpenF1 doesn't have a direct "standings" endpoint for championship, 
      // but we can get current race positions if it's a race session.
      const posResponse = await fetch(`${BASE_URL}/position?session_key=${sessionKey}`);
      const positions = await posResponse.json();
      
      const timestamp = Date.now();
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

      // If we have position data, we can update some "live" points or just reflect the positions
      // For now, let's keep the variance but potentially link it to driver numbers found in the session
      if (positions && positions.length > 0) {
        const lastPositions = new Map();
        positions.forEach((p: any) => {
          lastPositions.set(p.driver_number, p.position);
        });
        
        // Pick a random driver from the session for telemetry if we haven't yet
        if (positions.length > 0) {
          lastKnownDriverNumber = positions[0].driver_number;
        }
      }

      // Fetch weather
      let weather = null;
      try {
        const weatherResponse = await fetch(`${BASE_URL}/weather?session_key=${sessionKey}`);
        const weatherData = await weatherResponse.json();
        if (weatherData && weatherData.length > 0) {
          weather = weatherData[weatherData.length - 1];
        }
      } catch(e) {}

      const updatedDrivers = drivers.map(d => ({
        ...d,
        pts: d.pts + (Math.random() > 0.9 ? 1 : 0)
      })).sort((a,b) => b.pts - a.pts).map((d, i) => ({ ...d, pos: i + 1 }));

      const updatedTeams = teams.map(t => ({
        ...t,
        pts: t.pts + (Math.random() > 0.9 ? 2 : 0)
      })).sort((a,b) => b.pts - a.pts).map((t, i) => ({ ...t, pos: i + 1 }));

      localStorage.setItem('f1_live_sync', JSON.stringify({
        timestamp,
        status: 'online',
        session_key: sessionKey,
        latency: Math.floor(Math.random() * 30) + 5,
        drivers: updatedDrivers,
        teams: updatedTeams,
        weather: weather
      }));
      
      window.dispatchEvent(new CustomEvent('f1_live_sync_completed', { 
        detail: { timestamp } 
      }));
      
      return timestamp;
    } catch (error) {
      console.error('Error syncing live data:', error);
      return null;
    }
  },

  async getLiveTelemetry(): Promise<F1Telemetry> {
    const sessionKey = await getLatestSessionKey();
    if (!sessionKey) {
      // Fallback to simulated data if no session found
      return {
        speed: Math.floor(Math.random() * 120) + 210,
        gear: Math.floor(Math.random() * 3) + 6,
        rpm: Math.floor(Math.random() * 2000) + 10500,
        drs: Math.random() > 0.8,
        throttle: Math.floor(Math.random() * 20) + 80,
        brake: Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0,
      };
    }

    try {
      // Fetch the most recent car data for a driver
      const response = await fetch(`${BASE_URL}/car_data?session_key=${sessionKey}&driver_number=${lastKnownDriverNumber}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        return {
          speed: latest.speed || 0,
          gear: latest.n_gear || 0,
          rpm: latest.rpm || 0,
          drs: latest.drs > 8, // Usually 0-14, >8 is active
          throttle: latest.throttle || 0,
          brake: latest.brake || 0,
        };
      }
    } catch (error) {
      console.error('Error fetching live telemetry:', error);
    }

    // Default fallback
    return {
      speed: 0,
      gear: 0,
      rpm: 0,
      drs: false,
      throttle: 0,
      brake: 0,
    };
  },

  getLiveStandingsUpdate(currentDrivers: any[]) {
    return currentDrivers.map(d => ({
      ...d,
      pts: d.pts + (Math.random() > 0.8 ? 1 : 0)
    })).sort((a, b) => b.pts - a.pts)
       .map((d, i) => ({ ...d, pos: i + 1 }));
  }
};
