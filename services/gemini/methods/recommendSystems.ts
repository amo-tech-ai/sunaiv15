
import { getFunctionUrl, getAuthHeaders } from "../client";
import { SystemRecommendation } from "../../../types";

export const recommendSystems = async (industry: string, bottlenecks: any): Promise<SystemRecommendation[]> => {
  try {
    const response = await fetch(getFunctionUrl('recommend-systems'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        industry,
        bottlenecks
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
        id: "sys_growth_engine",
        title: "Growth & Lead Engine",
        benefit: "Automates lead capture, qualification, and initial outreach to scale revenue without headcount.",
        isRecommended: true,
        category: "Growth"
      },
      {
        id: "sys_ops_auto",
        title: "Operational Autopilot",
        benefit: "Connects disparate data sources to eliminate manual entry and reduce error rates by 90%.",
        isRecommended: true,
        category: "Operations"
      },
      {
        id: "sys_intel_dash",
        title: "Executive Intelligence",
        benefit: "Real-time dashboards that consolidate marketing, sales, and finance data into a single truth source.",
        isRecommended: false,
        category: "Intelligence"
      },
      {
        id: "sys_support_ai",
        title: "Customer Success AI",
        benefit: "24/7 instant resolution for common queries, escalating only complex issues to humans.",
        isRecommended: false,
        category: "Operations"
      },
      {
        id: "sys_content_scale",
        title: "Content Scale System",
        benefit: "Generates on-brand marketing assets at scale for multiple channels.",
        isRecommended: false,
        category: "Growth"
      }
    ];
  }
};
