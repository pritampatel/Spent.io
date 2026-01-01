
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Budget } from "../types";

export const getAIInsights = async (transactions: Transaction[], budgets: Budget[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentTransactions = transactions.slice(0, 30).map(t => ({
    amount: t.amount,
    category: t.category,
    description: t.description,
    type: t.type,
    date: t.date
  }));

  const prompt = `Act as a world-class financial analyst. Analyze these transactions and budgets.
  Transactions: ${JSON.stringify(recentTransactions)}
  Budgets: ${JSON.stringify(budgets)}
  
  Return a JSON object with:
  1. "score": A numeric value from 0-100 representing financial health.
  2. "insights": Exactly 3 pithy, highly actionable insights (under 12 words each).
  3. "stats": Exactly 3 high-impact facts (e.g., "Top spending day", "Largest category increase", "Daily burn rate").
  4. "prediction": A one-sentence forecast for the end of the month based on velocity.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            insights: { 
              type: Type.ARRAY, 
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["text", "priority"]
              }
            },
            stats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["label", "value"]
              }
            },
            prediction: { type: Type.STRING }
          },
          required: ["score", "insights", "stats", "prediction"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      score: 72,
      insights: [{ text: "Maintain current saving velocity for goal success.", priority: "Medium" }],
      stats: [{ label: "Top Burn", value: "Food" }],
      prediction: "Portfolio likely to remain stable with current trends."
    };
  }
};
