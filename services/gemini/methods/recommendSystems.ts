import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { SystemRecommendation } from "../../../types";

const MOCK_SYSTEMS: SystemRecommendation[] = [
  { id: 's1', title: 'Lead Growth System', benefit: 'Capture, qualify, and convert traffic automatically.', isRecommended: true, category: 'Growth' },
  { id: 's2', title: 'Operations Automation', benefit: 'Sync inventory and orders across all channels.', isRecommended: true, category: 'Operations' },
  { id: 's3', title: 'Predictive Analytics', benefit: 'Forecast demand to prevent stockouts.', isRecommended: false, category: 'Intelligence' },
  { id: 's4', title: 'CX Concierge', benefit: 'Automate 60% of support tickets.', isRecommended: false, category: 'Operations' },
  { id: 's5', title: 'Content Engine', benefit: 'Generate product descriptions at scale.', isRecommended: true, category: 'Growth' },
];

export const recommendSystems = async (industry: string, bottlenecks: any): Promise<SystemRecommendation[]> => {
  if (!checkApiKey()) return new Promise(resolve => setTimeout(() => resolve(MOCK_SYSTEMS), 1500));
  
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        benefit: { type: Type.STRING },
        isRecommended: { type: Type.BOOLEAN },
        category: { type: Type.STRING, enum: ['Growth', 'Operations', 'Intelligence'] }
      },
      required: ['id', 'title', 'benefit', 'isRecommended', 'category']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Recommend 5 AI/Business systems for a ${industry} company dealing with: ${JSON.stringify(bottlenecks)}. Mark 2-3 as recommended.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return MOCK_SYSTEMS;
  }
};
