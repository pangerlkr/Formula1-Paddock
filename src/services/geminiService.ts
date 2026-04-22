/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Simple rate limit cooldown tracking
let newsCooldown = 0;
let tickerCooldown = 0;
const COOLDOWN_TIME = 60000; // 1 minute cooldown on 429

export async function fetchLivePaddockIntel(): Promise<NewsItem[]> {
  if (!ai) {
    console.warn("Gemini API Key missing. Skipping live fetch.");
    return [];
  }
  if (Date.now() < newsCooldown) {
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for the latest Formula 1 news, team updates, and technical developments. For each news item, strictly format it for the year 2026. If it's a real 2024/2025 news, adapt it to the 2026 context (e.g. Lewis is at Ferrari, Antonelli at Mercedes, etc.). Provide at least 5 news items.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              kicker: { type: Type.STRING },
              type: { type: Type.STRING },
              headline: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ["id", "kicker", "headline", "body"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error: any) {
    const errorStr = JSON.stringify(error);
    if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
      newsCooldown = Date.now() + COOLDOWN_TIME;
      console.warn("Gemini Quota Exceeded (429). Paddock news into cooldown.");
    } else {
      console.error("Failed to fetch live F1 news:", error);
    }
    return [];
  }
}

export async function fetchLiveTickerUpdates(): Promise<{ sym: string; val: string; pts: string }[]> {
  if (!ai) return [];
  if (Date.now() < tickerCooldown) {
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide 10 short, technical F1 ticker updates for 2026. Format each as a JSON object with 'sym' (a 3-letter uppercase category code like LAP, ENG, TTY, PIT), 'val' (the main value/driver/status), and 'pts' (a technical flag or delta).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sym: { type: Type.STRING },
              val: { type: Type.STRING },
              pts: { type: Type.STRING },
            },
            required: ["sym", "val", "pts"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error: any) {
    const errorStr = JSON.stringify(error);
    if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
      tickerCooldown = Date.now() + COOLDOWN_TIME;
      console.warn("Gemini Quota Exceeded (429). Ticker into cooldown.");
    } else {
      console.error("Failed to fetch live ticker:", error);
    }
    return [];
  }
}
