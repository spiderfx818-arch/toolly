import React from 'react';

export const PlaceholderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full rounded-[24px] border border-[#262626] bg-[#0A0A0A] p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">SaaS App Page Template</h1>
        <p className="text-sm text-[#A1A1AA]">This placeholder page lives under <code>src/apps/app-template/pages/</code> and illustrates the app-level page structure.</p>
      </div>
    </div>
  );
};
