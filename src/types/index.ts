export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  tool_count?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  full_description?: string;
  icon: string;
  thumbnail?: string;
  website_url: string;
  apk_url?: string;
  category_id: string;
  featured: boolean;
  popular: boolean;
  new: boolean;
  status: 'published' | 'draft';
  seo_title?: string;
  seo_description?: string;
  keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  website_name: string;
  logo: string;
  favicon: string;
  tagline: string;
  footer_text: string;
  social_links: {
    twitter?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
  };
  analytics_id: string;
  supabase_url?: string;
  supabase_anon_key?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  token?: string;
}

export interface AdminStats {
  totalTools: number;
  totalCategories: number;
  featuredTools: number;
  newestTools: number;
  popularTools: number;
}

export interface SeedOption {
  includeDemoData: boolean;
}
