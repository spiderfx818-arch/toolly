import React, { useState } from 'react';
import { Search, Sparkles, FileText, Image, Code, GraduationCap, Briefcase, Wrench, LayoutGrid, X } from 'lucide-react';
import { Category, Settings } from '../types';

interface HeroSearchProps {
  categories: Category[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings: Settings;
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

export const HeroSearch: React.FC<HeroSearchProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  settings,
}) => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#262626] text-xs font-medium text-[#A1A1AA] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Independent Micro SaaS Marketplace
      </div>

      {/* Main Tagline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
        {settings.tagline || 'Every Tool in One Place.'}
      </h1>

      <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-8 font-normal">
        Explore curated web tools and software created by independent indie developers worldwide.
      </p>

      {/* Large Rounded Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#A1A1AA] group-focus-within:text-white transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-12 pr-12 py-4 rounded-[20px] bg-[#111111] border border-[#262626] text-white placeholder-[#A1A1AA] text-base focus:outline-none focus:border-white/40 focus:bg-[#181818] shadow-2xl transition-all duration-200"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {/* 'All Categories' Chip */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selectedCategorySlug === null
              ? 'bg-white text-black font-semibold'
              : 'bg-[#111111] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => {
          const IconComp = (cat.icon && CATEGORY_ICONS[cat.icon]) || LayoutGrid;
          const isSelected = selectedCategorySlug === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#111111] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              {cat.tool_count !== undefined && cat.tool_count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-[#A1A1AA]'
                  }`}
                >
                  {cat.tool_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
