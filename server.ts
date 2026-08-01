import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_TOOLS, DEMO_SAMPLE_TOOLS } from './src/lib/initialData.js';
import { Category, Settings, Tool } from './src/types/index.js';

let tools: Tool[] = [...INITIAL_TOOLS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let settings: Settings = { ...INITIAL_SETTINGS };

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@toolly.io',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for generating slug
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // ==================== API ROUTES ====================

  // Get all tools with optional query filters
  app.get('/api/tools', (req, res) => {
    let result = [...tools];
    const { category, search, featured, popular, new: isNew, status } = req.query;

    if (status && typeof status === 'string') {
      result = result.filter((t) => t.status === status);
    } else {
      // Default to published for non-admin API view unless specified
      result = result.filter((t) => t.status === 'published');
    }

    if (category && typeof category === 'string' && category !== 'all') {
      const catObj = categories.find((c) => c.slug === category || c.id === category);
      if (catObj) {
        result = result.filter((t) => t.category_id === catObj.id);
      }
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.keywords && t.keywords.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      result = result.filter((t) => t.featured);
    }

    if (popular === 'true') {
      result = result.filter((t) => t.popular);
    }

    if (isNew === 'true') {
      result = result.filter((t) => t.new);
    }

    // Sort newest created first
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(result);
  });

  // Get single tool by slug
  app.get('/api/tools/:slug', (req, res) => {
    const { slug } = req.params;
    const tool = tools.find((t) => t.slug === slug || t.id === slug);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  });

  // Add new tool (Admin)
  app.post('/api/tools', (req, res) => {
    const body = req.body;
    if (!body.name || !body.website_url || !body.category_id) {
      return res.status(400).json({ error: 'Missing required fields: name, website_url, category_id' });
    }

    const generatedSlug = body.slug ? slugify(body.slug) : slugify(body.name);
    
    // Check slug uniqueness
    let finalSlug = generatedSlug;
    let count = 1;
    while (tools.some((t) => t.slug === finalSlug)) {
      finalSlug = `${generatedSlug}-${count++}`;
    }

    const newTool: Tool = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name.trim(),
      slug: finalSlug,
      description: body.description || '',
      full_description: body.full_description || body.description || '',
      icon: body.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      thumbnail: body.thumbnail || '',
      website_url: body.website_url.trim(),
      apk_url: body.apk_url ? body.apk_url.trim() : undefined,
      category_id: body.category_id,
      featured: Boolean(body.featured),
      popular: Boolean(body.popular),
      new: body.new !== undefined ? Boolean(body.new) : true,
      status: body.status || 'published',
      seo_title: body.seo_title || body.name,
      seo_description: body.seo_description || body.description,
      keywords: body.keywords || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    tools.unshift(newTool);
    res.status(201).json(newTool);
  });

  // Update tool (Admin)
  app.put('/api/tools/:id', (req, res) => {
    const { id } = req.params;
    const index = tools.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    const current = tools[index];
    const body = req.body;

    const updated: Tool = {
      ...current,
      ...body,
      id: current.id,
      updated_at: new Date().toISOString(),
    };

    tools[index] = updated;
    res.json(updated);
  });

  // Delete tool (Admin)
  app.delete('/api/tools/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = tools.length;
    tools = tools.filter((t) => t.id !== id);
    if (tools.length === initialLength) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json({ success: true, message: 'Tool deleted' });
  });

  // Categories API
  app.get('/api/categories', (req, res) => {
    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      tool_count: tools.filter((t) => t.category_id === cat.id && t.status === 'published').length,
    }));
    res.json(categoriesWithCount);
  });

  app.post('/api/categories', (req, res) => {
    const { name, icon, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const slug = slugify(name);
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      icon: icon || 'LayoutGrid',
      description: description || '',
    };
    categories.push(newCategory);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    categories[index] = { ...categories[index], ...req.body, id: categories[index].id };
    res.json(categories[index]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    categories = categories.filter((c) => c.id !== id);
    res.json({ success: true });
  });

  // Settings API
  app.get('/api/settings', (req, res) => {
    res.json(settings);
  });

  app.post('/api/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.json(settings);
  });

  // Admin auth
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = `toolly-jwt-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      res.json({
        success: true,
        user: { id: 'admin-1', email: ADMIN_CREDENTIALS.email, token },
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials. Default: admin@toolly.io / admin123' });
    }
  });

  // Admin seed demo tools toggle
  app.post('/api/admin/seed', (req, res) => {
    tools = [...DEMO_SAMPLE_TOOLS];
    res.json({ success: true, count: tools.length, tools });
  });

  // Admin clear tools back to empty
  app.post('/api/admin/clear', (req, res) => {
    tools = [];
    res.json({ success: true, count: 0 });
  });

  // File / Image upload endpoint
  app.post('/api/upload', (req, res) => {
    const { fileData, fileName, fileType } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }
    // Return base64 or generated data URL for local storage compatibility
    res.json({
      url: fileData,
      name: fileName || 'uploaded-asset',
      size: Math.round((fileData.length * 3) / 4),
    });
  });

  // Dynamic Sitemap XML
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.APP_URL || 'https://toolly.io';
    const categoryUrls = categories
      .map(
        (c) => `
  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('');

    const toolUrls = tools
      .filter((t) => t.status === 'published')
      .map(
        (t) => `
  <url>
    <loc>${baseUrl}/details/${t.slug}</loc>
    <lastmod>${t.updated_at.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>${categoryUrls}${toolUrls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Dynamic Robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || 'https://toolly.io';
    const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
    res.header('Content-Type', 'text/plain');
    res.send(txt);
  });

  // ==================== VITE MIDDLEWARE ====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Toolly Platform Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
