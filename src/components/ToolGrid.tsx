import React from 'react';
import { Sparkles, Clock, LayoutGrid, Plus, FolderOpen } from 'lucide-react';
import { Category, Tool } from '../types';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  categories: Category[];
  selectedCategorySlug: string | null;
  searchQuery: string;
  onOpenDetails: (tool: Tool) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  categories,
  selectedCategorySlug,
  searchQuery,
  onOpenDetails,
}) => {
  const publishedTools = tools.filter((t) => t.status === 'published');

  // Filter by category or search query if active
  let filteredTools = [...publishedTools];

  if (selectedCategorySlug) {
    const cat = categories.find((c) => c.slug === selectedCategorySlug || c.id === selectedCategorySlug);
    if (cat) {
      filteredTools = filteredTools.filter((t) => t.category_id === cat.id);
    }
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredTools = filteredTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.toLowerCase().includes(q))
    );
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Categorized lists
  const featuredTools = filteredTools.filter((t) => t.featured);
  const newestTools = filteredTools.filter((t) => t.new);

  // If search or category filter is active, show flat single grid
  const isFilteredView = Boolean(selectedCategorySlug || searchQuery.trim());

  if (publishedTools.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-[#0A0A0A] border border-[#262626] rounded-[24px] p-8 sm:p-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#111111] border border-[#262626] flex items-center justify-center text-[#A1A1AA] mb-4">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tools available yet</h3>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Check back soon for new Micro SaaS tools and web applications.
          </p>
        </div>
      </section>
    );
  }

  if (isFilteredView) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#A1A1AA]" />
            <span>
              {searchQuery ? `Search results for "${searchQuery}"` : 'Category Results'}
            </span>
            <span className="text-xs text-[#A1A1AA] bg-[#111111] border border-[#262626] px-2.5 py-0.5 rounded-full font-normal">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </span>
          </h2>
        </div>

        {filteredTools.length === 0 ? (
          <div className="bg-[#111111] border border-[#262626] rounded-[20px] p-12 text-center">
            <p className="text-[#A1A1AA] text-sm">No tools match your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category_id)}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      
      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white tracking-tight">Featured Tools</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category_id)}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newest Tools Section */}
      {newestTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white tracking-tight">Newest Tools</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newestTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category_id)}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Tools Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white tracking-tight">All Tools</h2>
          </div>
          <span className="text-xs text-[#A1A1AA]">
            {filteredTools.length} Listed
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              category={categoryMap.get(tool.category_id)}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
