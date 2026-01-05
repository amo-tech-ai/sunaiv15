
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
    throw e;
  }
};
