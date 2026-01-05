
import { getFunctionUrl } from "../client";
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion } from "../../../types";

export const generateQuestions = async (analysis: BusinessAnalysis, profile: BusinessProfile): Promise<BottleneckQuestion[]> => {
  try {
    const response = await fetch(getFunctionUrl('generate-questions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis,
        profile
      })
    });

    if (!response.ok) {
      throw new Error(`Question generation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling generate-questions:", e);
    throw e;
  }
};
