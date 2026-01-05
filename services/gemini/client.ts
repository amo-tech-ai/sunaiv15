
// Configuration for Supabase Edge Functions

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
  // Fallback to local Supabase instance for development
  // This prevents DNS errors from invalid placeholder domains
  return 'http://localhost:54321';
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
  return '';
};

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const getFunctionUrl = (name: string) => `${FUNCTIONS_URL}/${name}`;

export const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (SUPABASE_ANON_KEY) {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  
  return headers;
};
