/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, Driver } from "../types";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Simple rate limit cooldown tracking
const COOLDOWN_TIME = 60000; // 1 minute cooldown on 429

export interface LiveSyncData {
  drivers: Partial<Driver>[];
  news: NewsItem[];
  ticker: { sym: string; val: string; pts: string }[];
  paddockIntel: string;
}

export async function fetchFullLiveSync(): Promise<LiveSyncData | null> {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a deep sync of the 2026 F1 Season. 
      Search for real-world F1 news (post-2024) and adapt it to this 2026 fiction:
      - Lewis Hamilton is at Ferrari.
      - Kimi Antonelli is at Mercedes.
      - Adrian Newey is at Aston Martin.
      - Audi has entered the sport.
      - The current date is April 25, 2026.
      
      Provide:
      1. Updated Driver narratives/bios for the top 5 (Antonelli, Russell, Leclerc, Norris, Hamilton).
      2. 5 fresh News Articles.
      3. 8 ticker updates.
      4. A 'Paddock Intel' summary (100 words) about the technical state of the 2026 engines.
      
      Format EVERYTHING strictly as a single JSON object.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            drivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  bio: { type: Type.STRING }
                },
                required: ["id", "bio"]
              }
            },
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  kicker: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  body: { type: Type.STRING }
                },
                required: ["id", "kicker", "headline", "body"]
              }
            },
            ticker: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sym: { type: Type.STRING },
                  val: { type: Type.STRING },
                  pts: { type: Type.STRING }
                },
                required: ["sym", "val", "pts"]
              }
            },
            paddockIntel: { type: Type.STRING }
          },
          required: ["drivers", "news", "ticker", "paddockIntel"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Full Live Sync Failed:", error);
    return null;
  }
}

export async function fetchLiveTickerUpdates(): Promise<{ sym: string; val: string; pts: string }[]> {
  const data = await fetchFullLiveSync();
  return data?.ticker || [];
}

export async function fetchLivePaddockIntel(): Promise<NewsItem[]> {
  const data = await fetchFullLiveSync();
  return data?.news || [];
}
