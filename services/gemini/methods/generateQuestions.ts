
import { getFunctionUrl, getAuthHeaders } from "../client";
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion } from "../../../types";

export const generateQuestions = async (analysis: BusinessAnalysis, profile: BusinessProfile): Promise<BottleneckQuestion[]> => {
  try {
    const response = await fetch(getFunctionUrl('generate-questions'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        analysis,
        profile
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Question generation failed (${response.status}): ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling generate-questions:", e);
    console.warn("Falling back to mock questions");
    
    // Fallback Mock Data
    return [
      {
        id: "q1",
        category: "Business Focus",
        text: "What is your primary barrier to scaling revenue right now?",
        rationale: "Identifying the root cause of growth stagnation.",
        type: "single",
        options: ["Lead Quality", "Sales Capacity", "Customer Retention", "Market Reach"]
      },
      {
        id: "q2",
        category: "Operational Friction",
        text: "Where does your team spend the most manual effort?",
        rationale: "Pinpointing automation opportunities.",
        type: "multi",
        options: ["Data Entry", "Customer Support", "Reporting & Analytics", "Inventory Management"]
      },
      {
        id: "q3",
        category: "Speed to Execution",
        text: "How long does it take to launch a new campaign or product?",
        rationale: "Assessing agility and workflow bottlenecks.",
        type: "single",
        options: ["< 1 Week", "1-4 Weeks", "1-3 Months", "3+ Months"]
      },
      {
        id: "q4",
        category: "Priority",
        text: "If you could fix one thing immediately, what would it be?",
        rationale: "Establishing the 'North Star' for this project.",
        type: "single",
        options: ["Automate Repetitive Tasks", "Centralize Data", "Improve Customer Experience", "Reduce OpEx"]
      }
    ];
  }
};
