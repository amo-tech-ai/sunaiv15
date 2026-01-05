import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { BusinessProfile, StrategyPhase } from "../../../types";

const MOCK_STRATEGY: StrategyPhase[] = [
  { phase: 1, name: "Foundation", description: "Establish data integrity and core automations.", timelineWeeks: "2-4", deliverables: ["CRM Setup", "Data Warehouse", "Basic Automations"] },
  { phase: 2, name: "Growth Engine", description: "Scale acquisition and customer retention.", timelineWeeks: "4-8", deliverables: ["Ad Optimization AI", "Personalized Email Flows"] },
  { phase: 3, name: "Optimization", description: "Refine models and maximize LTV.", timelineWeeks: "8+", deliverables: ["Predictive LTV Model", "Dynamic Pricing"] }
];

export const generateStrategy = async (profile: BusinessProfile, systems: string[]): Promise<StrategyPhase[]> => {
    if (!checkApiKey()) return new Promise(resolve => setTimeout(() => resolve(MOCK_STRATEGY), 1500));

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                phase: { type: Type.INTEGER },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                timelineWeeks: { type: Type.STRING },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Create a 3-phase implementation strategy for ${profile.companyName} implementing ${systems.join(', ')}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return MOCK_STRATEGY;
    }
}
