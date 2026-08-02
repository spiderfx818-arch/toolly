import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { store } from '../lib/store';
import { AdminDashboard } from '../components/Admin/AdminDashboard';
import { AdminUser, Category, Settings, Tool } from '../types';

export const DashboardPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(store.getTools('all'));
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [settings, setSettings] = useState<Settings>(store.getSettings());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(store.getAdminUser());

  useEffect(() => {
    const updateFromStore = () => {
      setTools(store.getTools('all'));
      setCategories(store.getCategories());
      setSettings(store.getSettings());
      setAdminUser(store.getAdminUser());
    };

    updateFromStore();
    const unsubscribe = store.subscribe(updateFromStore);
    return () => unsubscribe();
  }, []);

  if (!adminUser) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <AdminDashboard
        stats={store.getStats()}
        tools={tools}
        categories={categories}
        settings={settings}
        onLogout={() => {
          store.logoutAdmin();
        }}
        onAddTool={(data) => store.addTool(data)}
        onUpdateTool={(id, data) => store.updateTool(id, data)}
        onDeleteTool={(id) => store.deleteTool(id)}
        onAddCategory={(name, icon, desc) => store.addCategory(name, icon, desc)}
        onDeleteCategory={(id) => store.deleteCategory(id)}
        onUpdateSettings={(newSettings) => store.updateSettings(newSettings)}
        onSeedDemoData={() => store.seedDemoData()}
        onClearAllTools={() => store.clearAllTools()}
        onViewSite={() => {
          window.location.href = '/';
        }}
      />
    </div>
  );
};
