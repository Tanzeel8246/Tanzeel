import { NextResponse } from 'next/server';
import { getAllPages, savePageContent, SitePagesData } from '@/lib/pages-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pages = getAllPages();
  return NextResponse.json({ success: true, pages });
}

export async function POST(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { pageId, ...data } = body;

    if (!pageId || !['privacy', 'terms', 'about', 'contact', 'home'].includes(pageId)) {
      return NextResponse.json({ error: 'Invalid pageId' }, { status: 400 });
    }

    const updated = savePageContent(pageId as keyof SitePagesData, data);
    return NextResponse.json({
      success: true,
      message: `${pageId} page content updated successfully`,
      page: updated,
    });
  } catch (err: any) {
    console.error('Error saving page content:', err);
    return NextResponse.json({ error: err.message || 'Failed to save page content' }, { status: 500 });
  }
}
