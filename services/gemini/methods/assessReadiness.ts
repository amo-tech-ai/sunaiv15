
import { getFunctionUrl, getAuthHeaders } from "../client";
import { BusinessProfile, ReadinessAssessment } from "../../../types";

export const assessReadiness = async (profile: BusinessProfile, systems: string[]): Promise<ReadinessAssessment> => {
  try {
    const response = await fetch(getFunctionUrl('assess-readiness'), {
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
    return {
      score: 72,
      breakdown: {
        tech: 65,
        process: 80,
        data: 55,
        team: 90
      },
      criticalGaps: [
        "Data fragmentation across legacy tools may slow down the Intelligence System implementation.",
        "Documentation for current manual workflows is incomplete."
      ],
      quickWins: [
        "Consolidate customer data into a single CSV export.",
        "Map out the top 5 repetitive processes on a whiteboard."
      ]
    };
  }
};
