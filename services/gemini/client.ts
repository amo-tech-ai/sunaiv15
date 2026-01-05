
// Configuration for Supabase Edge Functions

// Provided credentials for the live environment
const LIVE_SUPABASE_URL = 'https://necxcwhuzylsumlkkmlk.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'sb_publishable_LFstdKVxHEJ5wntLWtmCoA_P-mQ92kS';

const getSupabaseUrl = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
      // @ts-ignore
      return import.meta.env.VITE_SUPABASE_URL;
    }
  } catch (e) {
    // Ignore errors
  }
  return LIVE_SUPABASE_URL;
};

const getSupabaseAnonKey = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
  } catch (e) {
    // Ignore errors
  }
  return LIVE_SUPABASE_ANON_KEY;
};

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const getFunctionUrl = (name: string) => `${FUNCTIONS_URL}/${name}`;

export const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Use the resolved key
  const key = SUPABASE_ANON_KEY;
  
  if (key) {
    headers['Authorization'] = `Bearer ${key}`;
    // The 'apikey' header is required by Supabase API Gateway
    headers['apikey'] = key;
  }
  
  return headers;
};

/**
 * Helper to handle streaming responses from Supabase Edge Functions.
 * Reads the stream chunks, triggers the callback, and returns the parsed JSON at the end.
 */
export const streamRequest = async <T>(
  endpoint: string,
  body: any,
  onChunk?: (chunk: string) => void
): Promise<T> => {
  const response = await fetch(getFunctionUrl(endpoint), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    // If error, try to get text error
    const errText = await response.text();
    throw new Error(`Status ${response.status}: ${errText}`);
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    
    if (onChunk) {
      onChunk(chunk);
    }
  }
  
  // Try to parse the accumulated text as JSON
  try {
    return JSON.parse(fullText) as T;
  } catch (e) {
    console.error("Failed to parse streamed JSON", fullText);
    throw new Error("Invalid JSON response from stream");
  }
};
