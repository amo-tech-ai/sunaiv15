/**
 * Checks if the API key is present.
 * Always returns true as we use backend Edge Functions for API calls.
 */
export const checkApiKey = (): boolean => {
  return true;
};