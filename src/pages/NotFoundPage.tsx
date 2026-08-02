import React from 'react';
import { Link } from 'react-router-dom';

interface NotFoundPageProps {
  message?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full rounded-[24px] border border-[#262626] bg-[#0A0A0A] p-10 text-center shadow-2xl">
        <div className="text-6xl font-extrabold mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-sm sm:text-base text-[#A1A1AA] mb-8">
          {message || 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
        >
          Return to Toolly Home
        </Link>
      </div>
    </div>
  );
};
