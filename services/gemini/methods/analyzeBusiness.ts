import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { BusinessProfile, BusinessAnalysis } from "../../../types";

const MOCK_ANALYSIS: BusinessAnalysis = {
  detectedIndustry: "E-Commerce / Fashion Retail",
  businessModel: "B2C",
  digitalReadiness: "Medium",
  observations: [
    "Likely manages high SKU count with seasonal rotation.",
    "Customer acquisition relies heavily on social channels.",
    "Returns processing may be a significant operational cost."
  ]
};

export const analyzeBusiness = async (profile: BusinessProfile): Promise<BusinessAnalysis> => {
  if (!checkApiKey()) return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYSIS), 2500));

  const schema = {
    type: Type.OBJECT,
    properties: {
      detectedIndustry: { type: Type.STRING },
      businessModel: { type: Type.STRING, enum: ['B2B', 'B2C', 'Services', 'SaaS', 'Hybrid', 'Marketplace', 'Other'] },
      digitalReadiness: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      observations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['detectedIndustry', 'businessModel', 'digitalReadiness', 'observations']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this business:
      Name: ${profile.companyName}
      URL: ${profile.website}
      Self-described Industry: ${profile.industry}
      Description: ${profile.description}
      
      Use Google Search to verify the company if possible. Infer the industry, business model, and digital maturity. Provide 3 key observations about potential bottlenecks or characteristics.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{googleSearch: {}}],
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      console.log("Grounding Chunks:", groundingChunks);
    }

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Gemini Error in analyzeBusiness", e);
    return MOCK_ANALYSIS;
  }
};
