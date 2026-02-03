
import { GoogleGenAI, Type } from "@google/genai";
import { ForexAnalysis, TimeFrame } from "../types";

export const getForexAnalysis = async (pair: string, timeframe: TimeFrame): Promise<ForexAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Tafadhali hakikisha API key imewekwa.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Tunatumia gemini-3-flash-preview kwa sababu ina uwezo mkubwa wa Search na ni haraka
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `SEARCH THE INTERNET FIRST for the CURRENT LIVE PRICE of ${pair} on the ${timeframe} timeframe.
      
      Your task is to provide a precision technical analysis based on the ACTUAL current market data you find.
      
      CRITICAL REQUIREMENTS:
      1. REAL PRICES: The 'entryPrice' in your signal MUST be within 5-10 pips of the current real-time market price of ${pair}. 
      2. REAL HISTORY: Generate the 'mockChartData' based on the ACTUAL recent price action (last 20 candles) of ${pair} for the ${timeframe} timeframe as found in your search. 
      3. TIMEFRAME CONSISTENCY: Do not give 4H levels if I asked for 15M. Focus only on ${timeframe} price action.
      4. MARKET STATE: Identify if the market is currently Trending (Bullish/Bearish) or Ranging (Consolidating) based on LIVE data.
      
      Respond with a valid JSON object matching this schema.`,
      config: {
        tools: [{ googleSearch: {} }], 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["pair", "timeframe", "marketStructure", "supportResistance", "trendDirection", "trendStrength", "supplyDemandZones", "liquidityClusters", "primarySignal", "alternativeScenario", "summary", "mockChartData"],
          properties: {
            pair: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            marketStructure: { type: Type.STRING },
            supportResistance: { type: Type.ARRAY, items: { type: Type.STRING } },
            trendDirection: { type: Type.STRING },
            trendStrength: { type: Type.STRING },
            supplyDemandZones: { type: Type.ARRAY, items: { type: Type.STRING } },
            liquidityClusters: { type: Type.ARRAY, items: { type: Type.STRING } },
            primarySignal: {
              type: Type.OBJECT,
              required: ["type", "entryPrice", "stopLoss", "takeProfit", "riskReward", "reasoning", "confirmation"],
              properties: {
                type: { type: Type.STRING, enum: ["Buy", "Sell"] },
                entryPrice: { type: Type.STRING },
                stopLoss: { type: Type.STRING },
                takeProfit: { type: Type.STRING },
                riskReward: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                confirmation: { type: Type.STRING }
              }
            },
            alternativeScenario: { type: Type.STRING },
            summary: { type: Type.STRING },
            mockChartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["time", "open", "high", "low", "close"],
                properties: {
                  time: { type: Type.STRING },
                  open: { type: Type.NUMBER },
                  high: { type: Type.NUMBER },
                  low: { type: Type.NUMBER },
                  close: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Samahani, model haijatuma jibu lolote.");
    }

    const analysis = JSON.parse(resultText) as ForexAnalysis;
    
    // Extract grounding sources to show transparency of data source
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      analysis.groundingSources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }

    return analysis;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API Key error au Model haipatikani. Hakikisha umechagua key sahihi.");
    }
    throw error;
  }
};
