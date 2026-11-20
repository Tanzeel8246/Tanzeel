import { NextResponse } from 'next/server';
import { getAllBlogPosts, upsertBlogPost } from '@/lib/blogs-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blogs = getAllBlogPosts();
  return NextResponse.json({ success: true, total: blogs.length, blogs });
}

export async function POST(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, category, readTime, author, content } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const saved = upsertBlogPost({
      title,
      slug: slug || title,
      excerpt,
      category,
      readTime,
      author,
      content,
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully',
      blog: saved,
    });
  } catch (err: any) {
    console.error('Error saving blog post:', err);
    return NextResponse.json({ error: err.message || 'Failed to save blog post' }, { status: 500 });
  }
}
