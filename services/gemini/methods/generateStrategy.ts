
import { getFunctionUrl, getAuthHeaders } from "../client";
import { BusinessProfile, StrategyPhase } from "../../../types";

export const generateStrategy = async (profile: BusinessProfile, systems: string[]): Promise<StrategyPhase[]> => {
  try {
    const response = await fetch(getFunctionUrl('generate-strategy'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        profile,
        systems
      })
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.warn("Backend unavailable, using local intelligence (Demo Mode)");

    // Fallback Mock Data
    return [
      {
        phase: 1,
        name: "Foundation & Data Structure",
        description: "We focus on cleaning your data and setting up the core infrastructure before adding automation.",
        timelineWeeks: "1-3",
        deliverables: [
          "Data Audit & Cleanup",
          "CRM Schema Definition",
          "Integration Setup (API Connections)",
          "Security & Access Control Review"
        ]
      },
      {
        phase: 2,
        name: "Core System Deployment",
        description: "Launching the selected systems in a controlled environment to ensure stability.",
        timelineWeeks: "4-7",
        deliverables: [
          "Growth Engine Logic Implementation",
          "Operational Workflow Automation",
          "Staff Training Session 1",
          "Live Beta Testing"
        ]
      },
      {
        phase: 3,
        name: "Optimization & Scale",
        description: "Refining the agents based on real-world feedback and expanding their autonomy.",
        timelineWeeks: "8-12",
        deliverables: [
          "Performance Analytics Dashboard",
          "Advanced Logic Rules",
          "Full Autonomy Handoff",
          "Quarterly Strategy Review"
        ]
      }
    ];
  }
};
