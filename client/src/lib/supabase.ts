import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

const initSupabase = async () => {
  if (supabase) return supabase;

  try {
    const response = await fetch('/api/config');
    const { supabaseUrl, supabaseAnonKey } = await response.json();

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
};

export const getSupabase = async () => {
  if (!supabase) {
    await initSupabase();
  }
  return supabase;
};

// For backward compatibility
initSupabase().catch(console.error);
