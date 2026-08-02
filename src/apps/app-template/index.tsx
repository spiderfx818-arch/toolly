import React from 'react';

export const AppTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full rounded-[24px] border border-[#262626] bg-[#0A0A0A] p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">App Template</h1>
        <p className="text-sm text-[#A1A1AA] leading-relaxed">
          This directory shows the future structure for full SaaS applications. Replace this placeholder with your app implementation inside <code>components/</code>, <code>pages/</code>, <code>hooks/</code>, and <code>services/</code>.
        </p>
      </div>
    </div>
  );
};

export default AppTemplate;
