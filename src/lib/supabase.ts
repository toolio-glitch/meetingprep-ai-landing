import { createClient } from '@supabase/supabase-js';

// Lazy initialization to prevent build-time errors
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not set');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Export a getter for backwards compatibility
export const supabase = getSupabaseClient();

