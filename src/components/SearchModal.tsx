import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Category, Tool } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: Tool[];
  categories: Category[];
  onOpenDetails: (tool: Tool) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tools,
  categories,
  onOpenDetails,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publishedTools = tools.filter((t) => t.status === 'published');
  
  const results = query.trim()
    ? publishedTools.filter((t) => {
        const q = query.toLowerCase().trim();
        const cat = categoryMap.get(t.category_id);
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.keywords && t.keywords.toLowerCase().includes(q)) ||
          (cat && cat.name.toLowerCase().includes(q))
        );
      })
    : publishedTools.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#262626] flex items-center gap-3 bg-[#111111]">
          <Search className="w-5 h-5 text-[#A1A1AA]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, category, or keyword..."
            className="w-full bg-transparent text-white placeholder-[#A1A1AA] text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#A1A1AA] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          <div className="px-3 py-1 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Micro SaaS Tools'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm">
              No matching tools found for "{query}"
            </div>
          ) : (
            results.map((tool) => {
              const cat = categoryMap.get(tool.category_id);
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onOpenDetails(tool);
                  }}
                  className="p-3 rounded-[16px] bg-[#111111] hover:bg-[#181818] border border-[#262626] hover:border-white/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      className="w-10 h-10 rounded-xl object-cover bg-[#181818]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-white flex items-center gap-2">
                        <span>{tool.name}</span>
                        {cat && (
                          <span className="text-[10px] text-[#A1A1AA] bg-white/5 border border-[#262626] px-2 py-0.5 rounded-full font-normal">
                            {cat.name}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#A1A1AA] line-clamp-1">
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-white shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#262626] bg-[#111111]/50 text-right text-[11px] text-[#A1A1AA]">
          Press <kbd className="px-1.5 py-0.5 bg-black border border-[#262626] rounded text-white">ESC</kbd> to exit
        </div>

      </div>
    </div>
  );
};
