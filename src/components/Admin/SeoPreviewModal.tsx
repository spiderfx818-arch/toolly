import React, { useState } from 'react';
import { Search, Globe, Copy, Check, FileCode, Shield } from 'lucide-react';
import { Tool, Category, Settings } from '../../types';

interface SeoPreviewModalProps {
  tools: Tool[];
  categories: Category[];
  settings: Settings;
  onClose: () => void;
}

export const SeoPreviewModal: React.FC<SeoPreviewModalProps> = ({
  tools,
  categories,
  settings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'serp' | 'sitemap' | 'robots'>('serp');
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
${categories
  .map(
    (c) => `  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
${tools
  .filter((t) => t.status === 'published')
  .map(
    (t) => `  <url>
    <loc>${baseUrl}/details/${t.slug}</loc>
    <lastmod>${t.updated_at.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] flex items-center justify-between bg-[#111111]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-white" />
            <span>SEO & Search Engine Inspector</span>
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-[#A1A1AA] hover:text-white px-3 py-1 rounded-full border border-[#262626] cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#262626] bg-[#000000]">
          <button
            onClick={() => setActiveTab('serp')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'serp'
                ? 'border-white text-white bg-[#111111]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            SERP & Social Preview
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'sitemap'
                ? 'border-white text-white bg-[#111111]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            sitemap.xml
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === 'robots'
                ? 'border-white text-white bg-[#111111]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            robots.txt
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'serp' && (
            <div className="space-y-6">
              {/* Google Search Result Card */}
              <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626] space-y-2">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                  Google Search Result
                </span>
                <div className="text-xs text-emerald-400 font-mono truncate">
                  {baseUrl} › directory
                </div>
                <div className="text-base font-bold text-blue-400 hover:underline cursor-pointer">
                  {settings.website_name || 'Toolly'} — {settings.tagline || 'Every Tool in One Place.'}
                </div>
                <div className="text-xs text-[#A1A1AA] line-clamp-2">
                  Discover independent web-based Micro SaaS products, tools, and utilities built for creators, developers, and businesses worldwide.
                </div>
              </div>

              {/* OpenGraph Card Preview */}
              <div className="p-5 rounded-[20px] bg-[#111111] border border-[#262626] space-y-3">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-mono tracking-wider">
                  OpenGraph & Social Sharing Card
                </span>
                <div className="rounded-xl border border-[#262626] bg-black overflow-hidden p-4 space-y-2">
                  <div className="text-sm font-bold text-white">
                    {settings.website_name || 'Toolly'} Micro SaaS Platform
                  </div>
                  <div className="text-xs text-[#A1A1AA]">
                    {settings.tagline || 'Every Tool in One Place.'} Listing {tools.filter(t => t.status === 'published').length} active indie SaaS tools.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA]">
                  Generated XML Sitemap ({tools.length + categories.length + 1} URLs)
                </span>
                <button
                  onClick={() => handleCopy(sitemapXml)}
                  className="px-3 py-1 rounded-lg bg-[#181818] border border-[#262626] text-xs text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy XML'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-[16px] bg-[#111111] border border-[#262626] text-emerald-400 font-mono text-xs overflow-x-auto max-h-80">
                {sitemapXml}
              </pre>
            </div>
          )}

          {activeTab === 'robots' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA]">Robots.txt Directives</span>
                <button
                  onClick={() => handleCopy(robotsTxt)}
                  className="px-3 py-1 rounded-lg bg-[#181818] border border-[#262626] text-xs text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-[16px] bg-[#111111] border border-[#262626] text-emerald-400 font-mono text-xs overflow-x-auto">
                {robotsTxt}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
