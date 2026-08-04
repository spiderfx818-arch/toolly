import React, { useState, useEffect } from 'react';
import TOOL_REGISTRY from '../../lib/toolRegistry';
import { X, Upload, Sparkles, Check, AlertCircle, Globe, Download, Link, Image as ImageIcon } from 'lucide-react';
import { Category, Tool } from '../../types';

interface ToolFormProps {
  initialTool?: Tool | null;
  categories: Category[];
  onSave: (toolData: Partial<Tool>) => Promise<void>;
  onClose: () => void;
}

const PRESET_ICONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568667256549-094345857637?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80',
];

export const ToolForm: React.FC<ToolFormProps> = ({
  initialTool,
  categories,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialTool?.name || '');
  const [slug, setSlug] = useState(initialTool?.slug || '');
  const [description, setDescription] = useState(initialTool?.description || '');
  const [fullDescription, setFullDescription] = useState(
    initialTool?.full_description || initialTool?.description || ''
  );
  const [icon, setIcon] = useState(
    initialTool?.icon || PRESET_ICONS[0]
  );
  const [thumbnail, setThumbnail] = useState(initialTool?.thumbnail || '');
  const [websiteUrl, setWebsiteUrl] = useState(initialTool?.website_url || '');
  const [apkUrl, setApkUrl] = useState(initialTool?.apk_url || '');
  const [categoryId, setCategoryId] = useState(
    initialTool?.category_id || (categories[0]?.id || '')
  );
  const [featured, setFeatured] = useState(initialTool?.featured || false);
  const [popular, setPopular] = useState(initialTool?.popular || false);
  const [isNew, setIsNew] = useState(initialTool?.new !== undefined ? initialTool.new : true);
  const [status, setStatus] = useState<'published' | 'draft'>(initialTool?.status || 'published');
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialTool?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialTool?.seo_description || '');
  const [keywords, setKeywords] = useState(initialTool?.keywords || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [internalToolSlug, setInternalToolSlug] = useState('');

  useEffect(()=>{
    if (internalToolSlug) {
      const reg = TOOL_REGISTRY.find(t=>t.slug===internalToolSlug || t.id===internalToolSlug);
      if (reg) {
        setName(reg.name);
        setSlug(reg.slug);
        setDescription(reg.description);
        setWebsiteUrl(`/tools/${reg.slug}`);
        if (!icon) setIcon('');
      }
    }
  },[internalToolSlug]);

  // Auto-generate slug when name changes if slug isn't custom edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialTool) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
      setSlug(generated);
      if (!seoTitle) setSeoTitle(val);
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIcon(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Tool name is required.');
      return;
    }
    if (!websiteUrl.trim()) {
      setError('Website URL is required.');
      return;
    }
    if (!categoryId) {
      setError('Category selection is required.');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name,
        slug,
        description,
        full_description: fullDescription || description,
        icon,
        thumbnail,
        website_url: websiteUrl,
        apk_url: apkUrl ? apkUrl.trim() : undefined,
        category_id: categoryId,
        featured,
        popular,
        new: isNew,
        status,
        seo_title: seoTitle || name,
        seo_description: seoDescription || description,
        keywords,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save tool.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden relative my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#111111]">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {initialTool ? 'Edit Micro SaaS Tool' : 'Add New Micro SaaS Tool'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181818] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Name & Slug */}
          {/* Internal Tool Selector */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">Internal Coded Tool (optional)</label>
            <select value={internalToolSlug} onChange={(e)=>setInternalToolSlug(e.target.value)} className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5">
              <option value="">-- Select internal tool --</option>
              {TOOL_REGISTRY.map(t=> (
                <option key={t.id} value={t.slug}>{t.name} — /tools/{t.slug}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Tool Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. DocuMind AI"
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="documind-ai"
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Row 2: Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111111] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="published" className="bg-[#111111] text-white">
                  Published (Live on Marketplace)
                </option>
                <option value="draft" className="bg-[#111111] text-white">
                  Draft (Hidden from Public)
                </option>
              </select>
            </div>
          </div>

          {/* Row 3: Website URL & APK URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Website URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                <input
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                APK Download URL <span className="text-xs text-[#A1A1AA] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Download className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={apkUrl}
                  onChange={(e) => setApkUrl(e.target.value)}
                  placeholder="https://example.com/app.apk"
                  className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>

          {/* Tool Icon Picker & Upload */}
          <div>
            <label className="block text-xs font-semibold text-white mb-2">
              Tool Icon
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#111111] border border-[#262626] p-4 rounded-2xl">
              <img
                src={icon}
                alt="Icon preview"
                className="w-14 h-14 rounded-2xl object-cover bg-[#181818] border border-[#262626] shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_ICONS[0];
                }}
              />

              <div className="space-y-2 flex-1 w-full">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Icon Image URL"
                  className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-lg px-3 py-2 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-white/10 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
                  </label>
                  <span className="text-[11px] text-[#A1A1AA]">or select a preset icon:</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  {PRESET_ICONS.map((pUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIcon(pUrl)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border cursor-pointer shrink-0 ${
                        icon === pUrl ? 'border-white ring-2 ring-white/20' : 'border-[#262626]'
                      }`}
                    >
                      <img src={pUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Short Description <span className="text-[#A1A1AA] font-normal">(Card display)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this Micro SaaS product does..."
              className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Full Overview & Features <span className="text-[#A1A1AA] font-normal">(Detail Page)</span>
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed explanation, feature list, or user benefits..."
              className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Flags Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-[#111111] border border-[#262626]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181818] border-[#262626] text-white accent-white cursor-pointer"
              />
              <span>Featured Tool (Shows in Featured section)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181818] border-[#262626] text-white accent-white cursor-pointer"
              />
              <span>Popular Tag</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 rounded bg-[#181818] border-[#262626] text-white accent-white cursor-pointer"
              />
              <span>New Release</span>
            </label>
          </div>

          {/* SEO Metadata Section */}
          <div className="pt-4 border-t border-[#262626] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
              SEO & Social Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={name || 'Tool Name'}
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Google search results snippet..."
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Keywords <span className="text-[#A1A1AA] font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ai, pdf, developer, converter"
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-[#A1A1AA] hover:text-white border border-[#262626] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-white hover:bg-white/90 text-black font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving Tool...' : 'Save & Publish Tool'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
