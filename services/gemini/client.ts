
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
