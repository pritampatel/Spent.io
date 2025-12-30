
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Budget } from "../types";

export const getAIInsights = async (transactions: Transaction[], budgets: Budget[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentTransactions = transactions.slice(0, 20).map(t => ({
    amount: t.amount,
    category: t.category,
    description: t.description,
    type: t.type
  }));

  const prompt = `Analyze these recent transactions and budgets for a user.
  Transactions: ${JSON.stringify(recentTransactions)}
  Budgets: ${JSON.stringify(budgets)}
  
  Provide exactly 3 short, actionable financial tips to save money or optimize spending. 
  Each tip should be under 15 words. Keep it professional but friendly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tip: { type: Type.STRING, description: "A short financial advice." },
              priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["tip", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return [{ tip: "Maintain a healthy savings buffer this month.", priority: "Medium" }];
  }
};
