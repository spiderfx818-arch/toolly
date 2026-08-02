import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Category, Settings } from '../types';

interface PublicLayoutProps {
  settings: Settings;
  categories: Category[];
  onOpenSearch: () => void;
  onGoHome: () => void;
  onSelectCategory: (slug: string | null) => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  settings,
  categories,
  onOpenSearch,
  onGoHome,
  onSelectCategory,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar settings={settings} onOpenSearch={onOpenSearch} onGoHome={onGoHome} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} onSelectCategory={onSelectCategory} onGoHome={onGoHome} />
    </div>
  );
};
