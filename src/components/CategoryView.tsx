import React from 'react';
import { ArrowLeft, Sparkles, FileText, Image, Code, GraduationCap, Briefcase, Wrench, LayoutGrid } from 'lucide-react';
import { Category, Tool } from '../types';
import { ToolCard } from './ToolCard';

interface CategoryViewProps {
  category: Category;
  tools: Tool[];
  onOpenDetails: (tool: Tool) => void;
  onBackToHome: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  FileText,
  Image,
  Code,
  GraduationCap,
  Briefcase,
  Wrench,
  LayoutGrid,
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  tools,
  onOpenDetails,
  onBackToHome,
}) => {
  const IconComp = (category.icon && CATEGORY_ICONS[category.icon]) || LayoutGrid;

  const categoryTools = tools.filter(
    (t) => t.category_id === category.id && t.status === 'published'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </button>

      {/* Category Banner Header */}
      <div className="p-8 rounded-[24px] bg-[#0A0A0A] border border-[#262626] flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg">
          <IconComp className="w-7 h-7" />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {category.name} Micro SaaS Tools
            </h1>
            <span className="text-xs text-[#A1A1AA] bg-[#111111] border border-[#262626] px-3 py-1 rounded-full font-medium">
              {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          <p className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
            {category.description || `Browse web-based independent ${category.name} tools and applications.`}
          </p>
        </div>
      </div>

      {/* Category Tools Grid */}
      {categoryTools.length === 0 ? (
        <div className="bg-[#111111] border border-[#262626] rounded-[24px] p-16 text-center space-y-3">
          <h3 className="text-lg font-bold text-white">No tools in this category yet</h3>
          <p className="text-xs text-[#A1A1AA]">
            Tools added to "{category.name}" via the Admin Panel will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              category={category}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
