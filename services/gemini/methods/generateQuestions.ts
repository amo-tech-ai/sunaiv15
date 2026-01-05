import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion } from "../../../types";

const MOCK_QUESTIONS: BottleneckQuestion[] = [
  { 
    id: 'q1', 
    category: 'Business Focus',
    text: "What slows growth the most right now?", 
    rationale: "Faster launches and better planning directly increase margins.",
    type: 'single', 
    options: ["Content creation takes too long", "Inventory planning is inaccurate", "Marketing doesn’t convert", "Too many returns"] 
  },
  { 
    id: 'q2', 
    category: 'Operational Friction',
    text: "What takes the most manual effort today?", 
    rationale: "Automation frees time and reduces costs.",
    type: 'single', 
    options: ["Creating content for every drop", "Planning campaigns", "Managing inventory data", "Responding to customers"] 
  },
  { 
    id: 'q3', 
    category: 'AI Leverage',
    text: "What would make the biggest impact this quarter?", 
    rationale: "Identifying high-leverage AI implementation points.",
    type: 'single',
    options: ["Turn one shoot into many assets", "Predict best-selling styles", "Personalize marketing by style", "Automate campaign planning"]
  }
];

export const generateQuestions = async (analysis: BusinessAnalysis, profile: BusinessProfile): Promise<BottleneckQuestion[]> => {
  if (!checkApiKey()) return new Promise(resolve => setTimeout(() => resolve(MOCK_QUESTIONS), 2500));

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['Business Focus', 'Operational Friction', 'AI Leverage'] },
        text: { type: Type.STRING },
        rationale: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['single'] },
        options: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['id', 'category', 'text', 'rationale', 'type', 'options']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context:
      Company: ${profile.companyName}
      Industry: ${analysis.detectedIndustry}
      Model: ${analysis.businessModel}
      Description: ${profile.description}
      Observations: ${JSON.stringify(analysis.observations)}

      Task: Generate exactly 3 strategic questions to identify AI opportunities.
      1. Business Focus (Revenue/Cost)
      2. Operational Friction (Manual work)
      3. AI Leverage (Impact)

      Each question must be specific to the ${analysis.detectedIndustry} industry.
      Provide 4 options for each question.
      Provide a short rationale ("Why this matters") for each question.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Gemini Error in generateQuestions", e);
    return MOCK_QUESTIONS;
  }
};
