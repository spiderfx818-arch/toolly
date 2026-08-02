import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const appModules = import.meta.glob('../apps/*/index.tsx');

type AppModule = { default: React.ComponentType<any> };

export const AppLoader: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('App slug is missing from the URL.');
      return;
    }

    const normalizedSlug = slug.toLowerCase();
    const matched = Object.entries(appModules).find(([path]) =>
      path.toLowerCase().includes(`/${normalizedSlug}/index.tsx`)
    );

    if (!matched) {
      setError(`Application "${slug}" is not available yet.`);
      setComponent(null);
      return;
    }

    const loader = matched[1];
    loader()
      .then((module: AppModule) => {
        if (!module || !module.default) {
          setError(`Application "${slug}" does not export a default component.`);
          return;
        }
        setComponent(() => module.default);
      })
      .catch((unsafeError) => {
        console.error(unsafeError);
        setError(`Failed to load application "${slug}".`);
      });
  }, [slug]);

  if (error) {
    return <NotFoundPage message={error} />;
  }

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white">
        <div className="text-center space-y-3 px-4">
          <div className="text-2xl font-semibold">Loading application...</div>
          <p className="text-sm text-[#A1A1AA]">Preparing the SaaS experience.</p>
        </div>
      </div>
    );
  }

  return <Component />;
};
