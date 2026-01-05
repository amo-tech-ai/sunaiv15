
import { getFunctionUrl } from "../client";
import { BusinessProfile, BusinessAnalysis } from "../../../types";

export const analyzeBusiness = async (profile: BusinessProfile): Promise<BusinessAnalysis> => {
  try {
    const response = await fetch(getFunctionUrl('analyze-business'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: profile.companyName,
        website_url: profile.website,
        industry_hint: profile.industry,
        description: profile.description
      })
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error calling analyze-business:", e);
    throw e;
  }
};
