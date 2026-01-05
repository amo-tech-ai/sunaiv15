import { apiKey } from './client';

/**
 * Checks if the API key is present.
 * Logs a warning if missing to indicate mock mode.
 */
export const checkApiKey = (): boolean => {
  if (!apiKey) {
    console.warn("No API Key provided. Mocking response for demo.");
    return false;
  }
  return true;
};
