import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykrhvnvhwxjvbhbgbkzr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrcmh2bnZod3hqdmJoYmdia3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTI4NzcsImV4cCI6MjAyMzQyODg3N30.qqGm3WgKhHVT8zNV_QVqC-kR9PKXJGjgN5NydKVGjZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    }
  }
});