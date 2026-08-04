import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Download, ArrowUpRight } from 'lucide-react';
import { Category, Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  category?: Category;
  onOpenDetails: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, category, onOpenDetails }) => {
  const navigate = useNavigate();
  const handleOpenWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tool.website_url) return;
    if (tool.website_url.startsWith('/')) {
      // internal route
      navigate(tool.website_url);
    } else {
      window.open(tool.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadApk = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tool.apk_url) {
      window.open(tool.apk_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(tool)}
      className="bg-[#111111] hover:bg-[#181818] border border-[#262626] hover:border-white/20 rounded-[20px] p-5 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative"
    >
      <div>
        {/* Top Header: Icon + Category Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-[#262626] overflow-hidden flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform duration-200">
            {tool.icon ? (
              <img
                src={tool.icon}
                alt={tool.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback image if broken
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full bg-white/5 text-white font-bold flex items-center justify-center text-lg">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.featured && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                Featured
              </span>
            )}
            <span className="text-xs text-[#A1A1AA] bg-white/5 border border-[#262626] px-2.5 py-1 rounded-full font-medium">
              {category?.name || 'Micro SaaS'}
            </span>
          </div>
        </div>

        {/* Tool Name */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-1.5 group-hover:text-white transition-colors flex items-center gap-1">
          {tool.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      {/* Action Buttons: Open & APK */}
      <div className="pt-4 border-t border-[#262626]/60 flex items-center justify-between gap-2">
        <button
          onClick={handleOpenWebsite}
          className="flex-1 bg-white hover:bg-white/90 text-black font-medium text-xs px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {tool.apk_url && (
          <button
            onClick={handleDownloadApk}
            className="bg-transparent hover:bg-white/10 text-white border border-[#262626] hover:border-white/40 text-xs px-3.5 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Download APK Application"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK</span>
          </button>
        )}
      </div>
    </div>
  );
};
