
import { getFunctionUrl } from "../client";
import { BusinessProfile, StrategyPhase } from "../../../types";

export const generateStrategy = async (profile: BusinessProfile, systems: string[]): Promise<StrategyPhase[]> => {
  try {
    const response = await fetch(getFunctionUrl('generate-strategy'), {
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
      throw new Error(`Strategy generation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling generate-strategy:", e);
    throw e;
  }
};
