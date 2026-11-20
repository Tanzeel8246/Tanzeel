import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { AI_ASSISTANTS } from '@/config/ai-assistants';
import { getAllBlogPosts } from '@/lib/blogs-store';
import { getActiveTools } from '@/lib/tools-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tanzeel.work';
  const lastModified = new Date();

  // Core Static Routes & AdSense Trust Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic Blog Guides
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Dynamic AI Assistants
  const aiAssistants: MetadataRoute.Sitemap = AI_ASSISTANTS.map((bot) => ({
    url: `${baseUrl}/ai-assistants/${bot.id}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic Tools by scanning the src/app/tools directory
  let tools: MetadataRoute.Sitemap = [];
  try {
    const toolsDir = path.join(process.cwd(), 'src', 'app', 'tools');
    if (fs.existsSync(toolsDir)) {
      const toolFolders = fs.readdirSync(toolsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('[') && !dirent.name.startsWith('.'))
        .map(dirent => dirent.name);

      // Add scanned directory tools
      for (const folder of toolFolders) {
        tools.push({
          url: `${baseUrl}/tools/${folder}`,
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      }

      // Add custom tools from dynamic tools store
      const customTools = getActiveTools().filter(t => t.isCustom || t.path.includes('/custom/'));
      for (const ct of customTools) {
        tools.push({
          url: `${baseUrl}${ct.path}`,
          lastModified: new Date(ct.updatedAt || lastModified),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      }
    }
  } catch (e) {
    console.error('Failed to read tools directory for sitemap:', e);
  }

  return [...staticRoutes, ...blogRoutes, ...aiAssistants, ...tools];
}
