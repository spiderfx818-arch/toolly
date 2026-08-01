import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  LayoutGrid,
  Clock,
  TrendingUp,
  FolderTree,
  Settings as SettingsIcon,
  Globe,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Check,
  Eye,
  Zap,
} from 'lucide-react';
import { AdminStats, Category, Settings, Tool } from '../../types';
import { ToolForm } from './ToolForm';
import { CategoryManager } from './CategoryManager';
import { SettingsManager } from './SettingsManager';
import { SeoPreviewModal } from './SeoPreviewModal';

interface AdminDashboardProps {
  stats: AdminStats;
  tools: Tool[];
  categories: Category[];
  settings: Settings;
  onLogout: () => void;
  onAddTool: (data: Partial<Tool>) => Promise<Tool>;
  onUpdateTool: (id: string, data: Partial<Tool>) => Promise<Tool | null>;
  onDeleteTool: (id: string) => Promise<boolean>;
  onAddCategory: (name: string, icon?: string, description?: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  onSeedDemoData: () => Promise<number>;
  onClearAllTools: () => Promise<void>;
  onViewSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  tools,
  categories,
  settings,
  onLogout,
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  onAddCategory,
  onDeleteCategory,
  onUpdateSettings,
  onSeedDemoData,
  onClearAllTools,
  onViewSite,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'categories' | 'settings'>('tools');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showToolForm, setShowToolForm] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [seeding, setSeeding] = useState(false);

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  const filteredTools = tools.filter((t) => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase().trim();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    );
  });

  const handleSeed = async () => {
    if (
      confirm(
        'Seed sample Micro SaaS listings to test the marketplace? (This populates realistic tools like DocuMind AI, PixelForge Studio, Invoicer Pro, etc.)'
      )
    ) {
      setSeeding(true);
      await onSeedDemoData();
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Clear all tools and return marketplace to zero items?')) {
      await onClearAllTools();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Admin Header Bar */}
      <div className="p-6 rounded-[24px] bg-[#0A0A0A] border border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-black font-bold flex items-center justify-center text-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Manage tools, categories, branding, and platform settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onViewSite}
            className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Marketplace</span>
          </button>

          <button
            onClick={() => setShowSeoModal(true)}
            className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO Inspector</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-full bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626]">
          <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Tools</span>
            <LayoutGrid className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.totalTools}
          </div>
        </div>

        <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626]">
          <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Categories</span>
            <FolderTree className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.totalCategories}
          </div>
        </div>

        <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626]">
          <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Featured</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.featuredTools}
          </div>
        </div>

        <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626]">
          <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Newest</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.newestTools}
          </div>
        </div>

        <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626]">
          <div className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Popular</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {stats.popularTools}
          </div>
        </div>

      </div>

      {/* Main Tabs Header */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-white text-black'
                : 'bg-[#111111] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
            }`}
          >
            Manage Tools ({tools.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-black'
                : 'bg-[#111111] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
            }`}
          >
            Manage Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-black'
                : 'bg-[#111111] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
            }`}
          >
            Settings & Supabase
          </button>
        </div>

        {/* Demo Seed Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Populate sample Micro SaaS listings for testing"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{seeding ? 'Seeding...' : 'Seed Sample Tools'}</span>
          </button>

          {tools.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3.5 py-2 rounded-full bg-[#111111] hover:bg-red-950/40 text-[#A1A1AA] hover:text-red-400 border border-[#262626] text-xs font-medium transition-colors cursor-pointer"
              title="Clear all tools"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: TOOLS MANAGEMENT */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Admin Tool Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Filter tools by name or slug..."
                className="w-full bg-[#111111] border border-[#262626] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Add Tool Trigger Button */}
            <button
              onClick={() => {
                setEditingTool(null);
                setShowToolForm(true);
              }}
              className="w-full sm:w-auto bg-white hover:bg-white/90 text-black font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Micro SaaS Tool</span>
            </button>

          </div>

          {/* Tools Table */}
          <div className="rounded-[20px] bg-[#111111] border border-[#262626] overflow-hidden">
            {filteredTools.length === 0 ? (
              <div className="p-12 text-center text-[#A1A1AA] text-sm">
                No tools found. Click "Add New Micro SaaS Tool" or "Seed Sample Tools" above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#A1A1AA]">
                  <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider border-b border-[#262626]">
                    <tr>
                      <th className="p-4">Tool</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Website</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {filteredTools.map((tool) => {
                      const cat = categoryMap.get(tool.category_id);
                      return (
                        <tr key={tool.id} className="hover:bg-[#181818]/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={tool.icon}
                                alt={tool.name}
                                className="w-10 h-10 rounded-xl object-cover bg-[#181818] border border-[#262626]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                                }}
                              />
                              <div>
                                <div className="text-sm font-bold text-white">
                                  {tool.name}
                                </div>
                                <div className="text-[11px] text-[#A1A1AA] font-mono">
                                  /details/{tool.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-white">
                            {cat?.name || 'Uncategorized'}
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() =>
                                onUpdateTool(tool.id, {
                                  status: tool.status === 'published' ? 'draft' : 'published',
                                })
                              }
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase cursor-pointer border ${
                                tool.status === 'published'
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {tool.status}
                            </button>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1 flex-wrap">
                              {tool.featured && (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                                  Featured
                                </span>
                              )}
                              {tool.apk_url && (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-medium">
                                  APK
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <a
                              href={tool.website_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-white hover:underline flex items-center gap-1"
                            >
                              <span>Visit</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingTool(tool);
                                  setShowToolForm(true);
                                }}
                                className="p-2 rounded-lg bg-[#181818] hover:bg-white/10 text-white border border-[#262626] transition-colors cursor-pointer"
                                title="Edit Tool"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete tool "${tool.name}"?`)) {
                                    onDeleteTool(tool.id);
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                                title="Delete Tool"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <CategoryManager
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
        />
      )}

      {/* TAB 3: SETTINGS & SUPABASE */}
      {activeTab === 'settings' && (
        <SettingsManager
          settings={settings}
          onUpdateSettings={onUpdateSettings}
        />
      )}

      {/* Add / Edit Tool Modal Form */}
      {showToolForm && (
        <ToolForm
          initialTool={editingTool}
          categories={categories}
          onSave={async (data) => {
            if (editingTool) {
              await onUpdateTool(editingTool.id, data);
            } else {
              await onAddTool(data);
            }
          }}
          onClose={() => {
            setShowToolForm(false);
            setEditingTool(null);
          }}
        />
      )}

      {/* SEO Preview Modal */}
      {showSeoModal && (
        <SeoPreviewModal
          tools={tools}
          categories={categories}
          settings={settings}
          onClose={() => setShowSeoModal(false)}
        />
      )}

    </div>
  );
};
