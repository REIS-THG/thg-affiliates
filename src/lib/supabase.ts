
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = 'https://vypjeqzatumvciiwdmga.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cGplcXphdHVtdmNpaXdkbWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNTkzNDksImV4cCI6MjA1MzgzNTM0OX0.GTCY8MYRcgA8R_UCOI-wCgIbNJSqNUd_VZBDIyvYVpA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }
});
