
import { getFunctionUrl, getAuthHeaders } from "../client";
import { SystemRecommendation } from "../../../types";

export const recommendSystems = async (industry: string, bottlenecks: any): Promise<SystemRecommendation[]> => {
  try {
    const response = await fetch(getFunctionUrl('recommend-systems'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        industry,
        bottlenecks
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`System recommendation failed (${response.status}): ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error calling recommend-systems:", e);
    throw e;
  }
};
