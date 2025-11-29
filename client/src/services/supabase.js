import { createClient } from '@supabase/supabase-js';

// Get environment variables (Vite uses import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Debug logging for environment variables
console.log('🔍 [Supabase Config]', '=== SUPABASE CLIENT INITIALIZATION ===');
console.log('🔍 [Supabase Config]', 'URL length:', supabaseUrl?.length);
console.log('🔍 [Supabase Config]', 'URL preview:', supabaseUrl?.substring(0, 30) + '...');
console.log('🔍 [Supabase Config]', 'Key length:', supabaseAnonKey?.length);
console.log('🔍 [Supabase Config]', 'Key preview:', supabaseAnonKey?.substring(0, 30) + '...');

// Check for non-ASCII characters in URL
const urlHasNonASCII = /[^\x00-\x7F]/.test(supabaseUrl);
console.log('🔍 [Supabase Config]', 'URL contains non-ASCII:', urlHasNonASCII);

// Check for non-ASCII characters in key
const keyHasNonASCII = /[^\x00-\x7F]/.test(supabaseAnonKey);
console.log('🔍 [Supabase Config]', 'Key contains non-ASCII:', keyHasNonASCII);

// Validate URL format
try {
  new URL(supabaseUrl);
  console.log('🔍 [Supabase Config]', '✅ URL is valid');
} catch (e) {
  console.error('🔍 [Supabase Config]', '❌ URL is invalid:', e.message);
}

// Create and export Supabase client with explicit options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

console.log('🔍 [Supabase Config]', '✅ Supabase client created successfully');

