import { CALENDAR } from '../constants.ts';
import { Race } from '../types.ts';

const ERGAST_2026_RACES_URL = 'https://api.jolpi.ca/ergast/f1/2026/races/?format=json';
const DEFAULT_RACE_START_TIME = '13:00:00Z';
const FALLBACK_SEASON_YEAR = 2026;
const ONE_HOUR_IN_MS = 3600000;
const MONTH_MAP: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

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

function parseFallbackRaceDate(dateLabel: string): { start: Date; end: Date } | null {
  const normalized = dateLabel.replace(/[—−]/g, '–').replace(/\s+/g, ' ').trim();
  const match = normalized.match(/^([A-Za-z]{3})\s+(\d{1,2})(?:[–-]([A-Za-z]{3})?\s?(\d{1,2}))?$/);
  if (!match) return null;

  const [_fullMatch, startMonthLabel, startDayLabel, endMonthLabel, endDayLabel] = match;
  const startMonth = MONTH_MAP[startMonthLabel];
  if (startMonth === undefined) return null;

  const startDay = Number(startDayLabel);
  const endMonth = endMonthLabel ? MONTH_MAP[endMonthLabel] : startMonth;
  const endDay = endDayLabel ? Number(endDayLabel) : startDay;

  if (endMonth === undefined || Number.isNaN(startDay) || Number.isNaN(endDay)) return null;

  const startYear = FALLBACK_SEASON_YEAR;
  const endYear = endMonth < startMonth ? FALLBACK_SEASON_YEAR + 1 : FALLBACK_SEASON_YEAR;
  const start = new Date(Date.UTC(startYear, startMonth, startDay, 0, 0, 0));
  const end = new Date(Date.UTC(endYear, endMonth, endDay, 23, 59, 59));
  if (end.getTime() < start.getTime()) return null;

  return { start, end };
}

function getFallbackRace(): UpcomingRaceData {
  const now = Date.now();
  const futureRace = CALENDAR.find(r => {
    if (r.isDone || r.isCancelled) return false;
    const parsedDate = parseFallbackRaceDate(r.date);
    return parsedDate ? parsedDate.end.getTime() >= now : false;
  });

  const nextRace = futureRace || CALENDAR.find(r => !r.isDone && !r.isCancelled) || CALENDAR[0];
  const parsedNextDate = parseFallbackRaceDate(nextRace.date);
  const fallbackParsedDate = CALENDAR
    .filter(r => !r.isDone && !r.isCancelled)
    .map(r => parseFallbackRaceDate(r.date))
    .find(date => Boolean(date));
  const fallbackCountdownTarget = parsedNextDate
    ? `${parsedNextDate.start.toISOString().split('T')[0]}T${DEFAULT_RACE_START_TIME}`
    : fallbackParsedDate
      ? `${fallbackParsedDate.start.toISOString().split('T')[0]}T${DEFAULT_RACE_START_TIME}`
      : new Date(now + ONE_HOUR_IN_MS).toISOString();

  return {
    nextRace,
    totalRounds: 24,
    source: 'fallback',
    countdownTarget: fallbackCountdownTarget,
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
