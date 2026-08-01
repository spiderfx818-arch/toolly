import { Tool, Category, Settings } from '../types';

export function updatePageMeta(opts: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
  settings?: Settings;
}) {
  const siteName = opts.settings?.website_name || 'Toolly';
  const tagline = opts.settings?.tagline || 'Every Tool in One Place.';
  
  const pageTitle = opts.title 
    ? `${opts.title} | ${siteName}`
    : `${siteName} — ${tagline}`;

  const metaDesc = opts.description || `${siteName} is the premier marketplace platform for web-based Micro SaaS products and independent online tools.`;

  // Update DOM Title
  document.title = pageTitle;

  // Helper to update meta tag
  const setMeta = (nameAttr: string, value: string, propName: 'name' | 'property' = 'name') => {
    let el = document.querySelector(`meta[${propName}="${nameAttr}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(propName, nameAttr);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  setMeta('description', metaDesc);
  if (opts.keywords) setMeta('keywords', opts.keywords);

  // OpenGraph
  setMeta('og:title', pageTitle, 'property');
  setMeta('og:description', metaDesc, 'property');
  setMeta('og:type', opts.url ? 'article' : 'website', 'property');
  if (opts.url) setMeta('og:url', opts.url, 'property');
  if (opts.image) setMeta('og:image', opts.image, 'property');

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', pageTitle);
  setMeta('twitter:description', metaDesc);
  if (opts.image) setMeta('twitter:image', opts.image);
}

export function generateToolJsonLd(tool: Tool, category?: Category, settings?: Settings) {
  const siteName = settings?.website_name || 'Toolly';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'operatingSystem': 'Web, Browser, Cross-platform',
    'applicationCategory': category?.name || 'WebApplication',
    'description': tool.description,
    'url': tool.website_url,
    'downloadUrl': tool.apk_url || undefined,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteName,
    },
  };
}

export function generateMarketplaceJsonLd(tools: Tool[], settings?: Settings) {
  const siteName = settings?.website_name || 'Toolly';
  return {
    '@context': 'https://schema.org',
    '@type': 'DataFeed',
    'name': `${siteName} Micro SaaS Directory`,
    'description': settings?.tagline || 'Every Tool in One Place.',
    'dataFeedElement': tools.map((t) => ({
      '@type': 'DataFeedItem',
      'item': {
        '@type': 'SoftwareApplication',
        'name': t.name,
        'url': t.website_url,
        'description': t.description,
      },
    })),
  };
}
