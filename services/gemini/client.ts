
// Configuration for Supabase Edge Functions

const getSupabaseUrl = () => {
  try {
    // Check if import.meta.env.VITE_SUPABASE_URL is available
    // We access it statically so bundlers can replace it
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
      // @ts-ignore
      return import.meta.env.VITE_SUPABASE_URL;
    }
  } catch (e) {
    // Ignore errors
  }
  // Fallback to hardcoded URL if env var is missing
  return 'https://necxcwhuzylsumlkkmlk.supabase.co';
};

export const SUPABASE_URL = getSupabaseUrl();
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const getFunctionUrl = (name: string) => `${FUNCTIONS_URL}/${name}`;
