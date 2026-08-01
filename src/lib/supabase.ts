import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const metaEnv = (import.meta as any).env || {};
  const supabaseUrl = url || metaEnv.VITE_SUPABASE_URL || localStorage.getItem('toolly_supabase_url');
  const supabaseKey = key || metaEnv.VITE_SUPABASE_ANON_KEY || localStorage.getItem('toolly_supabase_key');

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClient;
}

export const SUPABASE_SQL_SCHEMA = `-- Toolly Platform Supabase Schema

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TOOLS TABLE
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  full_description TEXT,
  icon TEXT NOT NULL,
  thumbnail TEXT,
  website_url TEXT NOT NULL,
  apk_url TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  new BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published',
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  website_name TEXT DEFAULT 'Toolly',
  logo TEXT,
  favicon TEXT,
  tagline TEXT DEFAULT 'Every Tool in One Place.',
  footer_text TEXT,
  social_links JSONB,
  analytics_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read published tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
`;
