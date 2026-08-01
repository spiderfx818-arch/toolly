import React, { useEffect } from 'react';
import { X, ExternalLink, Download, ArrowUpRight, Share2, Globe, Shield, Sparkles } from 'lucide-react';
import { Category, Tool } from '../types';
import { updatePageMeta, generateToolJsonLd } from '../lib/seo';
import { ToolCard } from './ToolCard';

interface ToolDetailModalProps {
  tool: Tool;
  category?: Category;
  relatedTools: Tool[];
  onClose: () => void;
  onOpenTool: (tool: Tool) => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  category,
  relatedTools,
  onClose,
  onOpenTool,
}) => {
  useEffect(() => {
    // Sync SEO meta for this tool
    updatePageMeta({
      title: tool.seo_title || tool.name,
      description: tool.seo_description || tool.description,
      image: tool.thumbnail || tool.icon,
      keywords: tool.keywords,
    });

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tool, onClose]);

  const jsonLd = generateToolJsonLd(tool, category);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Tool link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden relative my-8">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#111111]/50">
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
            <span>Micro SaaS Directory</span>
            <span>/</span>
            <span className="text-white font-medium">{category?.name || 'Tool'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              title="Share / Copy Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#181818] border border-[#262626] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#111111] border border-[#262626] p-2 overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {tool.name}
                  </h1>
                  {tool.featured && (
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white text-black">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#A1A1AA] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Category: {category?.name || 'Micro SaaS'}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-white/90 text-black font-semibold text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Visit Website</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {tool.apk_url && (
                <a
                  href={tool.apk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent hover:bg-white/10 text-white border border-[#262626] hover:border-white/40 text-sm px-5 py-3 rounded-full inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK</span>
                </a>
              )}
            </div>
          </div>

          {/* Optional Thumbnail / Preview banner */}
          {tool.thumbnail && (
            <div className="w-full h-64 sm:h-80 rounded-[20px] bg-[#111111] border border-[#262626] overflow-hidden shadow-xl">
              <img
                src={tool.thumbnail}
                alt={`${tool.name} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Full Description */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
              About {tool.name}
            </h2>
            <p className="text-white/90 text-base leading-relaxed whitespace-pre-line bg-[#111111] border border-[#262626] p-5 rounded-[20px]">
              {tool.full_description || tool.description}
            </p>
          </div>

          {/* SEO Metadata Card */}
          <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626] space-y-2">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-widest">
              Search Engine Preview
            </span>
            <div className="text-sm font-semibold text-blue-400">
              {tool.seo_title || tool.name}
            </div>
            <div className="text-xs text-[#A1A1AA] line-clamp-2">
              {tool.seo_description || tool.description}
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="pt-6 border-t border-[#262626] space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Related {category?.name || ''} Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onOpenTool(rel)}
                    className="p-4 rounded-[16px] bg-[#111111] border border-[#262626] hover:bg-[#181818] hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rel.icon}
                        alt={rel.name}
                        className="w-9 h-9 rounded-xl object-cover bg-[#181818]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-white">
                          {rel.name}
                        </div>
                        <div className="text-xs text-[#A1A1AA] line-clamp-1">
                          {rel.description}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-white shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON-LD Script tag embedded */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </div>
      </div>
    </div>
  );
};
