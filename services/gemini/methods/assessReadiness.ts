import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { BusinessProfile, ReadinessAssessment } from "../../../types";

const MOCK_READINESS: ReadinessAssessment = {
  score: 72,
  breakdown: { tech: 60, process: 85, data: 40, team: 90 },
  criticalGaps: ["Data silos between marketing and sales", "No unified customer view"],
  quickWins: ["Automate email follow-ups", "Centralize reporting dashboard"]
};

export const assessReadiness = async (profile: BusinessProfile, systems: string[]): Promise<ReadinessAssessment> => {
    if (!checkApiKey()) return new Promise(resolve => setTimeout(() => resolve(MOCK_READINESS), 1500));
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER },
            breakdown: { 
                type: Type.OBJECT,
                properties: {
                    tech: { type: Type.INTEGER },
                    process: { type: Type.INTEGER },
                    data: { type: Type.INTEGER },
                    team: { type: Type.INTEGER }
                }
            },
            criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            quickWins: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    };

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Assess readiness for implementing ${systems.join(', ')} for ${profile.companyName} (${profile.description}). Be critical but encouraging.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return MOCK_READINESS;
    }
}
