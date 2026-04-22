/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Driver {
  id: string;
  pos: number;
  name: string;
  code: string;
  team: string;
  country: string;
  pts: number;
  gap: number | string;
  color: string;
  isFav?: boolean;
  bio?: string;
  careerStats?: {
    wins: number;
    podiums: number;
    titles: number;
    races: number;
  };
  image?: string;
}

export interface Team {
  id: string;
  pos: number;
  name: string;
  engine: string;
  country: string;
  pts: number;
  color: string;
  isFav?: boolean;
}

export interface Race {
  round: number | string;
  country: string;
  flag: string;
  circuit: string;
  date: string;
  winner?: string;
  podium?: string[];
  podiumDetailed?: { driver: string; team: string; gap: string }[];
  fastestLap?: { driver: string; time: string };
  strategy?: string;
  weather?: string;
  location?: string;
  laps?: number;
  distance?: string;
  leadingTeam?: { name: string; pts: number; color: string };
  isDone?: boolean;
  isNext?: boolean;
  isCancelled?: boolean;
  isRBRWin?: boolean;
}

export interface NewsItem {
  id: number;
  kicker: string;
  headline: string;
  body: string;
  type?: 'lead' | 'neutral';
}
