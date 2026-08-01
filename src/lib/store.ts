import { Category, Settings, Tool, AdminUser, AdminStats } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SETTINGS } from './initialData';

const LOCAL_STORAGE_KEY_TOOLS = 'toolly_v1_tools';
const LOCAL_STORAGE_KEY_CATEGORIES = 'toolly_v1_categories';
const LOCAL_STORAGE_KEY_SETTINGS = 'toolly_v1_settings';
const LOCAL_STORAGE_KEY_ADMIN = 'toolly_v1_admin_user';

type Listener = () => void;

class ToollyStore {
  private tools: Tool[] = [];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private settings: Settings = { ...INITIAL_SETTINGS };
  private adminUser: AdminUser | null = null;
  private listeners: Set<Listener> = new Set();
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private async init() {
    // Try restoring admin user session from localStorage
    try {
      const savedAdmin = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN);
      if (savedAdmin) {
        this.adminUser = JSON.parse(savedAdmin);
      }
    } catch (e) {
      console.warn('Failed restoring admin session from localStorage', e);
    }

    // Try fetching from API server
    try {
      const [toolsRes, catRes, settingsRes] = await Promise.all([
        fetch('/api/tools?status=all').then((r) => r.json()).catch(() => null),
        fetch('/api/categories').then((r) => r.json()).catch(() => null),
        fetch('/api/settings').then((r) => r.json()).catch(() => null),
      ]);

      if (Array.isArray(toolsRes)) {
        this.tools = toolsRes;
      } else {
        const localTools = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
        this.tools = localTools ? JSON.parse(localTools) : [];
      }

      if (Array.isArray(catRes)) {
        this.categories = catRes;
      } else {
        const localCats = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
        this.categories = localCats ? JSON.parse(localCats) : [...INITIAL_CATEGORIES];
      }

      if (settingsRes && typeof settingsRes === 'object') {
        this.settings = { ...INITIAL_SETTINGS, ...settingsRes };
      } else {
        const localSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
        this.settings = localSettings ? JSON.parse(localSettings) : { ...INITIAL_SETTINGS };
      }
    } catch (err) {
      console.warn('Falling back to local storage', err);
      const localTools = localStorage.getItem(LOCAL_STORAGE_KEY_TOOLS);
      this.tools = localTools ? JSON.parse(localTools) : [];
      const localCats = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
      this.categories = localCats ? JSON.parse(localCats) : [...INITIAL_CATEGORIES];
      const localSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      this.settings = localSettings ? JSON.parse(localSettings) : { ...INITIAL_SETTINGS };
    }

    this.isLoaded = true;
    this.notify();
  }

  private saveToLocal() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TOOLS, JSON.stringify(this.tools));
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      if (this.adminUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, JSON.stringify(this.adminUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
      }
    } catch (err) {
      console.warn('Local storage write warning:', err);
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getTools(filterStatus: 'published' | 'draft' | 'all' = 'published'): Tool[] {
    if (filterStatus === 'all') return [...this.tools];
    return this.tools.filter((t) => t.status === filterStatus);
  }

  public getToolBySlug(slug: string): Tool | undefined {
    return this.tools.find((t) => t.slug === slug || t.id === slug);
  }

  public getCategories(): Category[] {
    return this.categories.map((cat) => ({
      ...cat,
      tool_count: this.tools.filter((t) => t.category_id === cat.id && t.status === 'published').length,
    }));
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug);
  }

  public getSettings(): Settings {
    return { ...this.settings };
  }

  public getAdminUser(): AdminUser | null {
    return this.adminUser;
  }

  public getStats(): AdminStats {
    const published = this.getTools('published');
    return {
      totalTools: this.tools.length,
      totalCategories: this.categories.length,
      featuredTools: published.filter((t) => t.featured).length,
      newestTools: published.filter((t) => t.new).length,
      popularTools: published.filter((t) => t.popular).length,
    };
  }

  // Admin Actions
  public async loginAdmin(email: string, pass: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.adminUser = data.user;
        this.saveToLocal();
        this.notify();
        return true;
      }
    } catch (e) {
      console.warn('API login failed, checking offline admin default', e);
    }

    if (email === 'admin@toolly.io' && pass === 'admin123') {
      this.adminUser = { id: 'admin-1', email, token: 'local-session-token' };
      this.saveToLocal();
      this.notify();
      return true;
    }

    return false;
  }

  public logoutAdmin() {
    this.adminUser = null;
    this.saveToLocal();
    this.notify();
  }

  // Tool CRUD
  public async addTool(toolData: Partial<Tool>): Promise<Tool> {
    let newTool: Tool;

    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toolData),
      });
      if (res.ok) {
        newTool = await res.json();
        this.tools.unshift(newTool);
        this.saveToLocal();
        this.notify();
        return newTool;
      }
    } catch (e) {
      console.warn('API post tool error, saving locally:', e);
    }

    // Local fallback
    const slugify = (str: string) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const slug = toolData.slug ? slugify(toolData.slug) : slugify(toolData.name || 'tool');

    newTool = {
      id: `tool-${Date.now()}`,
      name: toolData.name || 'Untitled Tool',
      slug,
      description: toolData.description || '',
      full_description: toolData.full_description || toolData.description || '',
      icon: toolData.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      thumbnail: toolData.thumbnail || '',
      website_url: toolData.website_url || '#',
      apk_url: toolData.apk_url || undefined,
      category_id: toolData.category_id || (this.categories[0]?.id || 'cat-1'),
      featured: Boolean(toolData.featured),
      popular: Boolean(toolData.popular),
      new: toolData.new !== undefined ? Boolean(toolData.new) : true,
      status: toolData.status || 'published',
      seo_title: toolData.seo_title || toolData.name,
      seo_description: toolData.seo_description || toolData.description,
      keywords: toolData.keywords || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tools.unshift(newTool);
    this.saveToLocal();
    this.notify();
    return newTool;
  }

  public async updateTool(id: string, toolData: Partial<Tool>): Promise<Tool | null> {
    const idx = this.tools.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toolData),
      });
      if (res.ok) {
        const updated = await res.json();
        this.tools[idx] = updated;
        this.saveToLocal();
        this.notify();
        return updated;
      }
    } catch (e) {
      console.warn('API update tool error, updating locally:', e);
    }

    const updated: Tool = {
      ...this.tools[idx],
      ...toolData,
      id,
      updated_at: new Date().toISOString(),
    };

    this.tools[idx] = updated;
    this.saveToLocal();
    this.notify();
    return updated;
  }

  public async deleteTool(id: string): Promise<boolean> {
    try {
      await fetch(`/api/tools/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete tool error:', e);
    }

    this.tools = this.tools.filter((t) => t.id !== id);
    this.saveToLocal();
    this.notify();
    return true;
  }

  // Category CRUD
  public async addCategory(name: string, icon?: string, description?: string): Promise<Category> {
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      icon: icon || 'LayoutGrid',
      description: description || '',
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon, description }),
      });
      if (res.ok) {
        const cat = await res.json();
        this.categories.push(cat);
        this.saveToLocal();
        this.notify();
        return cat;
      }
    } catch (e) {
      console.warn('API add category failed, adding locally:', e);
    }

    this.categories.push(newCat);
    this.saveToLocal();
    this.notify();
    return newCat;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete category error:', e);
    }

    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveToLocal();
    this.notify();
    return true;
  }

  // Settings
  public async updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToLocal();
    this.notify();

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.settings),
      });
    } catch (e) {
      console.warn('API update settings error:', e);
    }

    return this.settings;
  }

  // Admin Seed sample tools
  public async seedDemoData(): Promise<number> {
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.tools) {
        this.tools = data.tools;
        this.saveToLocal();
        this.notify();
        return this.tools.length;
      }
    } catch (e) {
      console.warn('API seed failed, using local demo data:', e);
    }

    const { DEMO_SAMPLE_TOOLS } = await import('./initialData');
    this.tools = [...DEMO_SAMPLE_TOOLS];
    this.saveToLocal();
    this.notify();
    return this.tools.length;
  }

  // Clear tools back to zero
  public async clearAllTools(): Promise<void> {
    try {
      await fetch('/api/admin/clear', { method: 'POST' });
    } catch (e) {
      console.warn('API clear error:', e);
    }
    this.tools = [];
    this.saveToLocal();
    this.notify();
  }
}

export const store = new ToollyStore();
