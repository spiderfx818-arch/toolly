import React from 'react';
import { Search } from 'lucide-react';
import { Settings } from '../types';

interface NavbarProps {
  settings: Settings;
  onOpenSearch: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenSearch,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/80 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-white text-black font-bold flex items-center justify-center text-base tracking-tight shadow-sm group-hover:scale-105 transition-transform duration-200">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-lg tracking-tight leading-none">
              {settings.website_name || 'Toolly'}
            </span>
            <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-medium mt-0.5">
              Micro SaaS Platform
            </span>
          </div>
        </button>

        {/* Center: Empty */}
        <div className="hidden md:block" />

        {/* Right: Quick Search Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-[#A1A1AA] bg-black/50 border border-[#262626] rounded">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
