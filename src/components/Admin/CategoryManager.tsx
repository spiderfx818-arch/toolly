import React, { useState } from 'react';
import { Plus, Trash2, Edit3, FolderPlus, Sparkles, LayoutGrid } from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, icon?: string, description?: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAddCategory(name.trim(), icon, description.trim());
    setName('');
    setDescription('');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Form: Add Category */}
      <div className="p-6 rounded-[20px] bg-[#111111] border border-[#262626]">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-white" />
          <span>Add New Category</span>
        </h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Analytics"
              className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short category context"
              className="w-full bg-[#181818] border border-[#262626] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white hover:bg-white/90 text-black font-semibold text-xs py-2.5 px-5 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Add Category'}</span>
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="rounded-[20px] bg-[#111111] border border-[#262626] overflow-hidden">
        <div className="p-4 border-b border-[#262626] text-xs font-bold text-white flex items-center justify-between">
          <span>Active Categories ({categories.length})</span>
          <span className="text-[#A1A1AA] font-normal">Slug auto-formatted</span>
        </div>

        <div className="divide-y divide-[#262626]">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#181818]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-center text-white text-xs font-bold">
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-[#A1A1AA] bg-black/50 border border-[#262626] px-2 py-0.5 rounded-full">
                      /category/{cat.slug}
                    </span>
                  </div>
                  <div className="text-xs text-[#A1A1AA]">
                    {cat.tool_count || 0} tools in this category
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Delete category "${cat.name}"?`)) {
                    onDeleteCategory(cat.id);
                  }
                }}
                className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-900/40 border border-red-500/20 transition-colors cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
