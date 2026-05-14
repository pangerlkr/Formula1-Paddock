import { CALENDAR } from '../constants.ts';
import { Race } from '../types.ts';

const ERGAST_2026_RACES_URL = 'https://api.jolpi.ca/ergast/f1/2026/races/?format=json';
const DEFAULT_RACE_START_TIME = '13:00:00Z';

interface ErgastRace {
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
}

interface ErgastResponse {
  MRData?: {
    RaceTable?: {
      Races?: ErgastRace[];
    };
  };
}

export interface UpcomingRaceData {
  nextRace: Race;
  totalRounds: number;
  source: 'live' | 'fallback';
  countdownTarget: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: '🇦🇺',
  China: '🇨🇳',
  Japan: '🇯🇵',
  Bahrain: '🇧🇭',
  'Saudi Arabia': '🇸🇦',
  USA: '🇺🇸',
  Italy: '🇮🇹',
  Monaco: '🇲🇨',
  Spain: '🇪🇸',
  Canada: '🇨🇦',
  Austria: '🇦🇹',
  UK: '🇬🇧',
  Belgium: '🇧🇪',
  Hungary: '🇭🇺',
  Netherlands: '🇳🇱',
  Azerbaijan: '🇦🇿',
  Singapore: '🇸🇬',
  Mexico: '🇲🇽',
  Brazil: '🇧🇷',
  Qatar: '🇶🇦',
  UAE: '🇦🇪',
};

function formatRaceDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

function getFallbackRace(): UpcomingRaceData {
  const nextRace = CALENDAR.find(r => r.isNext) || CALENDAR.find(r => !r.isDone && !r.isCancelled) || CALENDAR[0];
  return {
    nextRace,
    totalRounds: 24,
    source: 'fallback',
    countdownTarget: '2026-05-18T13:00:00Z',
  };
}

function mapErgastRaceToRace(race: ErgastRace): Race {
  const round = Number(race.round);
  const fallbackRace = CALENDAR.find(r => Number(r.round) === round);
  const country = race.Circuit.Location.country;
  const normalizedCountry = country === 'United States' ? 'USA' : country === 'United Kingdom' ? 'UK' : country;

  return {
    round,
    country: race.raceName.replace(/ Grand Prix$/i, ''),
    flag: fallbackRace?.flag || COUNTRY_FLAGS[normalizedCountry] || '🏁',
    circuit: race.Circuit.circuitName,
    date: formatRaceDate(race.date),
    location: `${race.Circuit.circuitName} · ${race.Circuit.Location.locality}`,
    laps: fallbackRace?.laps,
    distance: fallbackRace?.distance,
    isNext: false,
  };
}

export async function fetchUpcomingRaceData(): Promise<UpcomingRaceData> {
  try {
    const response = await fetch(ERGAST_2026_RACES_URL);
    if (!response.ok) {
      return getFallbackRace();
    }

    const payload = await response.json() as ErgastResponse;
    const races = payload?.MRData?.RaceTable?.Races || [];
    if (!races.length) {
      return getFallbackRace();
    }

    const now = Date.now();
    const nextRaceIndex = races.findIndex(race => {
      const raceStart = new Date(`${race.date}T${race.time || DEFAULT_RACE_START_TIME}`).getTime();
      return raceStart > now;
    });

    const selectedRace = races[nextRaceIndex >= 0 ? nextRaceIndex : races.length - 1];
    const mappedRace = mapErgastRaceToRace(selectedRace);

    return {
      nextRace: { ...mappedRace, isNext: true },
      totalRounds: races.length,
      source: 'live',
      countdownTarget: `${selectedRace.date}T${selectedRace.time || DEFAULT_RACE_START_TIME}`,
    };
  } catch {
    return getFallbackRace();
  }
}
