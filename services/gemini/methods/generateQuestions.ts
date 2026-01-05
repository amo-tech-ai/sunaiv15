
import { Type } from "@google/genai";
import { ai } from "../client";
import { checkApiKey } from "../utils";
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion } from "../../../types";

const MOCK_QUESTIONS: BottleneckQuestion[] = [
  { 
    id: 'q1', 
    category: 'Business Focus',
    text: "Where is the business losing the most potential revenue right now?", 
    rationale: "Pinpoints the highest value problem to solve first.",
    type: 'single', 
    options: ["Traffic isn't converting into sales", "Customers aren't coming back (retention)", "Average order value is too low", "Marketing costs are too high"] 
  },
  { 
    id: 'q2', 
    category: 'Operational Friction',
    text: "What consumes the most team hours every week?", 
    rationale: "Identifies where automation can buy back time.",
    type: 'single', 
    options: ["Manually updating inventory & spreadsheets", "Answering repetitive customer support tickets", "Creating content for social & ads", "Processing returns and refunds"] 
  },
  { 
    id: 'q3', 
    category: 'Speed to Execution',
    text: "What slows down your ability to launch new initiatives?", 
    rationale: "Uncovers bottlenecks in your production cycle.",
    type: 'single',
    options: ["Creative assets take too long to produce", "Data is scattered across different tools", "Waiting on technical/dev resources", "Approval workflows are too slow"]
  },
  {
    id: 'q4',
    category: 'Priority',
    text: "If you could fix one thing in the next 90 days, what would it be?",
    rationale: "Helps us prioritize your immediate roadmap.",
    type: 'single',
    options: ["Automate customer support", "Scale ad creative production", "Unify customer data", "Predict inventory needs better"]
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
        category: { type: Type.STRING, enum: ['Business Focus', 'Operational Friction', 'Speed to Execution', 'Priority'] },
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
      contents: `You are a Senior Business Consultant. Design a consulting conversation (not a survey) for this client.
      
      Client Context:
      Company: ${profile.companyName}
      Industry: ${analysis.detectedIndustry}
      Model: ${analysis.businessModel}
      Description: ${profile.description}

      Task: Generate exactly 4 questions to identify where AI can increase revenue, reduce costs, or save time.
      
      RULES:
      1. DO NOT use AI jargon (No "agents", "LLMs", "generative").
      2. Speak in plain business language (Revenue, Time, Speed, Cost).
      3. Options MUST be specific to the ${analysis.detectedIndustry} industry.
      
      Structure the 4 questions exactly as follows:
      1. Category: 'Business Focus' -> Identify where revenue or growth is leaking.
      2. Category: 'Operational Friction' -> Identify what wastes time or causes chaos.
      3. Category: 'Speed to Execution' -> Identify what slows down launching ideas.
      4. Category: 'Priority' -> Identify the #1 goal for the next 90 days.

      Provide 4 selectable options for each question.
      Provide a short 1-sentence rationale for why we are asking this.
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
