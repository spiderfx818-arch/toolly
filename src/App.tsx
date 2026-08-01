import React, { useState, useEffect } from 'react';
import { store } from './lib/store';
import { Category, Settings, Tool, AdminUser } from './types';
import { updatePageMeta, generateMarketplaceJsonLd } from './lib/seo';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ToolGrid } from './components/ToolGrid';
import { ToolDetailModal } from './components/ToolDetailModal';
import { SearchModal } from './components/SearchModal';
import { CategoryView } from './components/CategoryView';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';

export default function App() {
  const [tools, setTools] = useState<Tool[]>(store.getTools('all'));
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [settings, setSettings] = useState<Settings>(store.getSettings());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(store.getAdminUser());

  // Views & Modals
  const [activeView, setActiveView] = useState<'home' | 'category' | 'admin'>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync state with store updates
  useEffect(() => {
    const updateFromStore = () => {
      setTools(store.getTools('all'));
      setCategories(store.getCategories());
      setSettings(store.getSettings());
      setAdminUser(store.getAdminUser());
    };

    updateFromStore();
    const unsubscribe = store.subscribe(updateFromStore);
    return () => unsubscribe();
  }, []);

  // Handle URL path on load or back/forward
  useEffect(() => {
    const handleUrlPath = () => {
      const path = window.location.pathname;
      if (path.startsWith('/details/')) {
        const slug = path.replace('/details/', '');
        const found = store.getToolBySlug(slug);
        if (found) setSelectedTool(found);
      } else if (path.startsWith('/category/')) {
        const slug = path.replace('/category/', '');
        setSelectedCategorySlug(slug);
        setActiveView('category');
      } else if (
        path === '/admin' ||
        path === '/manage' ||
        path === '/dashboard-admin' ||
        path === '/admin/login' ||
        path === '/admin/dashboard'
      ) {
        setActiveView('admin');
      } else {
        setActiveView('home');
      }
    };

    handleUrlPath();
    window.addEventListener('popstate', handleUrlPath);
    return () => window.removeEventListener('popstate', handleUrlPath);
  }, []);

  // Sync SEO Meta Tags
  useEffect(() => {
    if (activeView === 'home') {
      updatePageMeta({
        title: settings.website_name,
        description: settings.tagline,
        settings,
      });
    } else if (activeView === 'category' && selectedCategorySlug) {
      const cat = store.getCategoryBySlug(selectedCategorySlug);
      updatePageMeta({
        title: cat ? `${cat.name} Micro SaaS Tools` : 'Category',
        description: cat?.description || `Explore web-based ${cat?.name} products on Toolly.`,
        settings,
      });
    } else if (activeView === 'admin') {
      updatePageMeta({
        title: 'Admin Control Panel',
        description: 'Toolly Platform Administration',
        settings,
      });
    }
  }, [activeView, selectedCategorySlug, settings]);

  // Navigation handlers
  const navigateToHome = () => {
    setActiveView('home');
    setSelectedCategorySlug(null);
    setSelectedTool(null);
    setSearchQuery('');
    window.history.pushState({}, '', '/');
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('category');
    setSelectedTool(null);
    window.history.pushState({}, '', `/category/${slug}`);
  };

  const openToolDetails = (tool: Tool) => {
    setSelectedTool(tool);
    window.history.pushState({}, '', `/details/${tool.slug}`);
  };

  const closeToolDetails = () => {
    setSelectedTool(null);
    if (activeView === 'category' && selectedCategorySlug) {
      window.history.pushState({}, '', `/category/${selectedCategorySlug}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const currentCategory = selectedCategorySlug
    ? store.getCategoryBySlug(selectedCategorySlug)
    : undefined;

  const publishedTools = tools.filter((t) => t.status === 'published');

  // Related tools for details view
  const relatedTools = selectedTool
    ? publishedTools
        .filter(
          (t) => t.category_id === selectedTool.category_id && t.id !== selectedTool.id
        )
        .slice(0, 4)
    : [];

  const marketplaceJsonLd = generateMarketplaceJsonLd(publishedTools, settings);

  // If in secret admin view mode
  if (activeView === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLogin={async (email, pass) => {
            const success = await store.loginAdmin(email, pass);
            if (success) {
              window.history.pushState({}, '', '/admin');
            }
            return success;
          }}
          onClose={navigateToHome}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#000000] text-white font-sans">
        <AdminDashboard
          stats={store.getStats()}
          tools={tools}
          categories={categories}
          settings={settings}
          onLogout={() => {
            store.logoutAdmin();
            navigateToHome();
          }}
          onAddTool={(data) => store.addTool(data)}
          onUpdateTool={(id, data) => store.updateTool(id, data)}
          onDeleteTool={(id) => store.deleteTool(id)}
          onAddCategory={(name, icon, desc) => store.addCategory(name, icon, desc)}
          onDeleteCategory={(id) => store.deleteCategory(id)}
          onUpdateSettings={(newSettings) => store.updateSettings(newSettings)}
          onSeedDemoData={() => store.seedDemoData()}
          onClearAllTools={() => store.clearAllTools()}
          onViewSite={navigateToHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Top Glass Navigation Bar (Public Only) */}
      <Navbar
        settings={settings}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={navigateToHome}
      />

      {/* Main Public Router */}
      <main className="flex-1">
        {activeView === 'category' && currentCategory ? (
          <CategoryView
            category={currentCategory}
            tools={tools}
            onOpenDetails={openToolDetails}
            onBackToHome={navigateToHome}
          />
        ) : (
          <>
            {/* Homepage Hero Search & Category Chips */}
            <HeroSearch
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={(slug) => {
                if (slug) {
                  navigateToCategory(slug);
                } else {
                  setSelectedCategorySlug(null);
                }
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              settings={settings}
            />

            {/* Homepage Tool Grid Sections */}
            <ToolGrid
              tools={tools}
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              searchQuery={searchQuery}
              onOpenDetails={openToolDetails}
            />
          </>
        )}
      </main>

      {/* Tool Detail Modal View */}
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          category={store.getCategoryBySlug(selectedTool.category_id)}
          relatedTools={relatedTools}
          onClose={closeToolDetails}
          onOpenTool={openToolDetails}
        />
      )}

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={tools}
        categories={categories}
        onOpenDetails={openToolDetails}
      />

      {/* Public Footer */}
      <Footer
        settings={settings}
        categories={categories}
        onSelectCategory={navigateToCategory}
        onGoHome={navigateToHome}
      />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceJsonLd) }}
      />
    </div>
  );
}
