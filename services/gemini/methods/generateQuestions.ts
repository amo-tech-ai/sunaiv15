
import { streamRequest } from "../client";
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion } from "../../../types";

export const generateQuestions = async (
  analysis: BusinessAnalysis, 
  profile: BusinessProfile,
  onChunk?: (text: string) => void
): Promise<BottleneckQuestion[]> => {
  try {
    return await streamRequest<BottleneckQuestion[]>(
      'generate-questions',
      {
        analysis,
        profile
      },
      onChunk
    );
  } catch (e) {
    console.warn("Backend unavailable, using local intelligence (Demo Mode)");
    
    // Fallback Mock Data
    return [
      {
        id: "q1",
        category: "Business Focus",
        text: "What is your primary barrier to scaling revenue right now?",
        rationale: "Identifying the root cause of growth stagnation.",
        type: "single",
        options: [
          { text: "Lead Quality", system_hint: "lead_scoring" },
          { text: "Sales Capacity", system_hint: "sales_automation" },
          { text: "Customer Retention", system_hint: "retention_ai" },
          { text: "Market Reach", system_hint: "outreach_scale" }
        ]
      },
      {
        id: "q2",
        category: "Operational Friction",
        text: "Where does your team spend the most manual effort?",
        rationale: "Pinpointing automation opportunities.",
        type: "multi",
        options: [
          { text: "Data Entry", system_hint: "ops_data_entry" },
          { text: "Customer Support", system_hint: "support_bot" },
          { text: "Reporting & Analytics", system_hint: "reporting_dash" },
          { text: "Inventory Management", system_hint: "inventory_ai" }
        ]
      },
      {
        id: "q3",
        category: "Speed to Execution",
        text: "How long does it take to launch a new campaign or product?",
        rationale: "Assessing agility and workflow bottlenecks.",
        type: "single",
        options: [
          { text: "< 1 Week", system_hint: "speed_high" },
          { text: "1-4 Weeks", system_hint: "speed_med" },
          { text: "1-3 Months", system_hint: "speed_low" },
          { text: "3+ Months", system_hint: "speed_blocked" }
        ]
      },
      {
        id: "q4",
        category: "Priority",
        text: "If you could fix one thing immediately, what would it be?",
        rationale: "Establishing the 'North Star' for this project.",
        type: "single",
        options: [
          { text: "Automate Repetitive Tasks", system_hint: "automation_core" },
          { text: "Centralize Data", system_hint: "data_warehouse" },
          { text: "Improve Customer Experience", system_hint: "cx_ai" },
          { text: "Reduce OpEx", system_hint: "cost_reduction" }
        ]
      }
    ];
  }
};
