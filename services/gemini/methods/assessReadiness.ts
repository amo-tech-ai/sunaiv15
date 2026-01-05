
import { getFunctionUrl } from "../client";
import { BusinessProfile, ReadinessAssessment } from "../../../types";

export const assessReadiness = async (profile: BusinessProfile, systems: string[]): Promise<ReadinessAssessment> => {
  try {
    const response = await fetch(getFunctionUrl('assess-readiness'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile,
        systems
      })
    });

    if (!response.ok) {
      throw new Error(`Readiness assessment failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling assess-readiness:", e);
    throw e;
  }
};
