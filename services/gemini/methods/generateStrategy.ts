
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
      const errorText = await response.text();
      throw new Error(`Strategy generation failed (${response.status}): ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling generate-strategy:", e);
    throw e;
  }
};
