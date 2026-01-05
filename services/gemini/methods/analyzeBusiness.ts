
import { getFunctionUrl, getAuthHeaders } from "../client";
import { BusinessProfile, BusinessAnalysis } from "../../../types";

export const analyzeBusiness = async (profile: BusinessProfile): Promise<BusinessAnalysis> => {
  try {
    const response = await fetch(getFunctionUrl('analyze-business'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        company_name: profile.companyName,
        website_url: profile.website,
        industry_hint: profile.industry,
        description: profile.description
      })
    });

    if (!response.ok) {
      // Throw quietly to trigger fallback
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    // Log as warning only - this is expected behavior in demo/offline mode
    console.warn("Backend unavailable, using local intelligence (Demo Mode)");
    
    // Fallback Mock Data
    return {
      detectedIndustry: profile.industry || "Technology",
      businessModel: "B2B",
      digitalReadiness: "Medium",
      observations: [
        "Digital footprint suggests established market presence.",
        "Website structure indicates a focus on lead generation.",
        "Social signals point to high customer engagement."
      ]
    };
  }
};
