
import { streamRequest } from "../client";
import { BusinessProfile, BusinessAnalysis } from "../../../types";

export const analyzeBusiness = async (
  profile: BusinessProfile, 
  onChunk?: (text: string) => void
): Promise<BusinessAnalysis> => {
  try {
    return await streamRequest<BusinessAnalysis>(
      'analyze-business',
      {
        company_name: profile.companyName,
        website_url: profile.website,
        industry_hint: profile.industry,
        description: profile.description
      },
      onChunk
    );
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
