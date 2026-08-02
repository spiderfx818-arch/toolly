import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const toolModules = import.meta.glob('../tools/*/index.tsx');

type ToolModule = { default: React.ComponentType<any> };

export const ToolLoader: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Tool slug is missing from the URL.');
      return;
    }

    const normalizedSlug = slug.toLowerCase();
    const matched = Object.entries(toolModules).find(([path]) =>
      path.toLowerCase().includes(`/${normalizedSlug}/index.tsx`)
    );

    if (!matched) {
      setError(`Tool "${slug}" is not available yet.`);
      setComponent(null);
      return;
    }

    const loader = matched[1];
    loader()
      .then((module: ToolModule) => {
        if (!module || !module.default) {
          setError(`Tool "${slug}" does not export a default component.`);
          return;
        }
        setComponent(() => module.default);
      })
      .catch((unsafeError) => {
        console.error(unsafeError);
        setError(`Failed to load tool "${slug}".`);
      });
  }, [slug]);

  if (error) {
    return <NotFoundPage message={error} />;
  }

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white">
        <div className="text-center space-y-3 px-4">
          <div className="text-2xl font-semibold">Loading tool...</div>
          <p className="text-sm text-[#A1A1AA]">Preparing the tool experience.</p>
        </div>
      </div>
    );
  }

  return <Component />;
};
