import { NextResponse } from 'next/server';
import { getBlogPostBySlug, upsertBlogPost, deleteBlogPost } from '@/lib/blogs-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const blog = getBlogPostBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, blog });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await req.json();

    const updated = upsertBlogPost({
      ...body,
      slug,
      title: body.title,
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      blog: updated,
    });
  } catch (err: any) {
    console.error('Error updating blog post:', err);
    return NextResponse.json({ error: err.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = deleteBlogPost(slug);

  if (!deleted) {
    return NextResponse.json({ error: 'Blog post not found or could not be deleted' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
}
