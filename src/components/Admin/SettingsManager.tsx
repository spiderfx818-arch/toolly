import React, { useState } from 'react';
import { Settings } from '../../types';
import { Save, Database, Copy, Check, Shield, Globe } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../../lib/supabase';

interface SettingsManagerProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [websiteName, setWebsiteName] = useState(settings.website_name || 'Toolly');
  const [tagline, setTagline] = useState(settings.tagline || 'Every Tool in One Place.');
  const [footerText, setFooterText] = useState(
    settings.footer_text || '© 2026 Toolly Platform. All rights reserved.'
  );
  const [twitter, setTwitter] = useState(settings.social_links?.twitter || '');
  const [github, setGithub] = useState(settings.social_links?.github || '');
  const [analyticsId, setAnalyticsId] = useState(settings.analytics_id || '');
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabase_url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabase_anon_key || '');

  const [saving, setSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdateSettings({
      website_name: websiteName,
      tagline,
      footer_text: footerText,
      social_links: { twitter, github },
      analytics_id: analyticsId,
      supabase_url: supabaseUrl,
      supabase_anon_key: supabaseAnonKey,
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Branding & Text Settings */}
        <div className="p-6 rounded-[20px] bg-[#111111] border border-[#262626] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-white" />
            <span>Marketplace Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Website Name
              </label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Footer Text
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Twitter / X Link
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/toolly"
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                GitHub Link
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/toolly"
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Supabase Database Config */}
        <div className="p-6 rounded-[20px] bg-[#111111] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase Database Integration</span>
            </h3>

            <button
              type="button"
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-white/10 text-white border border-[#262626] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy Supabase SQL Migration'}</span>
            </button>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Connect Toolly directly to your Supabase Cloud instance. Tables required: <code className="text-white">tools</code>, <code className="text-white">categories</code>, <code className="text-white">settings</code>, <code className="text-white">admins</code>.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}

          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="bg-white hover:bg-white/90 text-black font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
