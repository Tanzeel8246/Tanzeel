import fs from 'fs';
import path from 'path';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';

export type { BlogPost };

function getBlogsFilePath(): string {
  const p1 = path.join(process.cwd(), 'data', 'blogs-db.json');
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), 'src', 'data', 'blogs-db.json');
  if (fs.existsSync(p2)) return p2;
  return p1;
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    const filePath = getBlogsFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading blogs-db.json, using defaults:', err);
  }
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const all = getAllBlogPosts();
  return all.find(b => b.slug === slug);
}

export function saveBlogPosts(posts: BlogPost[]): boolean {
  try {
    const filePath = getBlogsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save blogs-db.json:', err);
    return false;
  }
}

export function upsertBlogPost(post: Partial<BlogPost> & { title: string; slug: string }): BlogPost {
  const posts = getAllBlogPosts();
  const cleanSlug = post.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existingIndex = posts.findIndex(p => p.slug === cleanSlug);
  const now = new Date().toISOString().split('T')[0];

  const itemToSave: BlogPost = {
    slug: cleanSlug,
    title: post.title.trim(),
    excerpt: post.excerpt || '',
    category: post.category || 'Productivity',
    readTime: post.readTime || '3 min read',
    publishedAt: post.publishedAt || (existingIndex >= 0 ? posts[existingIndex].publishedAt : now),
    author: post.author || {
      name: 'CodeHubb Editorial Team',
      role: 'Staff Writer',
    },
    content: post.content || '',
  };

  if (existingIndex >= 0) {
    posts[existingIndex] = { ...posts[existingIndex], ...itemToSave };
  } else {
    posts.unshift(itemToSave);
  }

  saveBlogPosts(posts);
  return itemToSave;
}

export function deleteBlogPost(slug: string): boolean {
  const posts = getAllBlogPosts();
  const filtered = posts.filter(p => p.slug !== slug);
  if (filtered.length !== posts.length) {
    return saveBlogPosts(filtered);
  }
  return false;
}
