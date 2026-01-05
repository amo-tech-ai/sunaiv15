
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
      const errorText = await response.text();
      throw new Error(`Analysis failed (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error calling analyze-business:", e);
    throw e;
  }
};
