import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { store } from '../lib/store';
import { Category, Settings, Tool } from '../types';
import { Navbar } from '../components/Navbar';
import { HeroSearch } from '../components/HeroSearch';
import { ToolGrid } from '../components/ToolGrid';
import { CategoryView } from '../components/CategoryView';
import { ToolDetailModal } from '../components/ToolDetailModal';
import { SearchModal } from '../components/SearchModal';
import { Footer } from '../components/Footer';
import { updatePageMeta, generateMarketplaceJsonLd } from '../lib/seo';

export const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ slug?: string }>();

  const [tools, setTools] = useState<Tool[]>(store.getTools('all'));
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [settings, setSettings] = useState<Settings>(store.getSettings());
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchRoute = location.pathname === '/search';
  const detailSlug = location.pathname.startsWith('/details/') ? params.slug || null : null;
  const selectedCategorySlug = location.pathname.startsWith('/category/') ? params.slug || null : null;

  useEffect(() => {
    const updateFromStore = () => {
      setTools(store.getTools('all'));
      setCategories(store.getCategories());
      setSettings(store.getSettings());
    };

    updateFromStore();
    const unsubscribe = store.subscribe(updateFromStore);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      updatePageMeta({
        title: settings.website_name,
        description: settings.tagline,
        settings,
      });
    } else if (selectedCategorySlug) {
      const currentCategory = store.getCategoryBySlug(selectedCategorySlug);
      updatePageMeta({
        title: currentCategory ? `${currentCategory.name} Micro SaaS Tools` : 'Category',
        description:
          currentCategory?.description ||
          `Explore web-based ${currentCategory?.name} products on Toolly.`,
        settings,
      });
    } else if (location.pathname.startsWith('/details/')) {
      const tool = detailSlug ? store.getToolBySlug(detailSlug) : null;
      updatePageMeta({
        title: tool ? `${tool.name} | ${settings.website_name}` : `Tool details | ${settings.website_name}`,
        description: tool?.description || settings.tagline,
        settings,
      });
    }
  }, [location.pathname, selectedCategorySlug, detailSlug, settings]);

  const navigateToHome = () => {
    setSearchQuery('');
    navigate('/');
  };

  const navigateToCategory = (slug: string | null) => {
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate('/');
    }
  };

  const openToolDetails = (tool: Tool) => {
    navigate(`/details/${tool.slug}`);
  };

  const closeToolDetails = () => {
    if (selectedCategorySlug) {
      navigate(`/category/${selectedCategorySlug}`);
    } else {
      navigate('/');
    }
  };

  const currentCategory = selectedCategorySlug
    ? store.getCategoryBySlug(selectedCategorySlug)
    : undefined;

  const publishedTools = tools.filter((t) => t.status === 'published');

  const relatedTools = detailSlug
    ? publishedTools
        .filter((t) => t.slug !== detailSlug)
        .slice(0, 4)
    : [];

  const selectedTool = detailSlug ? store.getToolBySlug(detailSlug) : null;

  const marketplaceJsonLd = generateMarketplaceJsonLd(publishedTools, settings);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar
        settings={settings}
        onOpenSearch={() => navigate('/search')}
        onGoHome={navigateToHome}
      />

      <main className="flex-1">
        {currentCategory ? (
          <CategoryView
            category={currentCategory}
            tools={tools}
            onOpenDetails={openToolDetails}
            onBackToHome={navigateToHome}
          />
        ) : (
          <>
            <HeroSearch
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={navigateToCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              settings={settings}
            />

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

      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          category={store.getCategoryBySlug(selectedTool.category_id)}
          relatedTools={relatedTools}
          onClose={closeToolDetails}
          onOpenTool={openToolDetails}
        />
      )}

      <SearchModal
        isOpen={isSearchRoute}
        onClose={navigateToHome}
        tools={tools}
        categories={categories}
        onOpenDetails={(tool) => {
          openToolDetails(tool);
          navigateToHome();
        }}
      />

      <Footer
        settings={settings}
        categories={categories}
        onSelectCategory={navigateToCategory}
        onGoHome={navigateToHome}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceJsonLd) }}
      />
    </div>
  );
};
