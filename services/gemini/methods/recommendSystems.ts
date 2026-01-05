
import { getFunctionUrl } from "../client";
import { SystemRecommendation } from "../../../types";

export const recommendSystems = async (industry: string, bottlenecks: any): Promise<SystemRecommendation[]> => {
  try {
    const response = await fetch(getFunctionUrl('recommend-systems'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        industry,
        bottlenecks
      })
    });

    if (!response.ok) {
      throw new Error(`System recommendation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling recommend-systems:", e);
    throw e;
  }
};
