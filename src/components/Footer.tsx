import React from 'react';
import { Category, Settings } from '../types';
import { Github, Twitter } from 'lucide-react';

interface FooterProps {
  settings: Settings;
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onSelectCategory,
  onGoHome,
}) => {
  return (
    <footer className="w-full bg-[#000000] border-t border-[#262626] mt-24 text-sm text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
            >
              <div className="w-7 h-7 rounded-xl bg-white text-black font-bold flex items-center justify-center text-sm">
                T
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                {settings.website_name || 'Toolly'}
              </span>
            </button>

            <p className="text-xs text-[#A1A1AA] max-w-sm leading-relaxed">
              {settings.tagline || 'Every Tool in One Place.'} Toolly is a modern marketplace platform aggregating independent Micro SaaS applications and web utilities.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.social_links?.twitter && (
                <a
                  href={settings.social_links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.github && (
                <a
                  href={settings.social_links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Col */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onGoHome} className="hover:text-white transition-colors cursor-pointer">
                  Directory
                </button>
              </li>
              <li>
                <button onClick={onGoHome} className="hover:text-white transition-colors cursor-pointer">
                  All Micro SaaS
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{settings.footer_text || '© 2026 Toolly Platform. All rights reserved.'}</p>
          <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
            <span>Micro SaaS Aggregator</span>
            <span>•</span>
            <span>Every Tool in One Place</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
