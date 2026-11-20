import { NextResponse } from 'next/server';
import { getAllTools, upsertTool, DEFAULT_CATEGORIES } from '@/lib/tools-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const tools = getAllTools();
  return NextResponse.json({
    success: true,
    total: tools.length,
    activeCount: tools.filter(t => t.status === 'active').length,
    inactiveCount: tools.filter(t => t.status !== 'active').length,
    categories: DEFAULT_CATEGORIES.map(c => c.name),
    tools,
  });
}

export async function POST(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, category, icon, status, badge, isCustom, content, embedCode } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid tool slug' }, { status: 400 });
    }

    const saved = upsertTool({
      id: body.id || cleanSlug,
      name: name.trim(),
      slug: cleanSlug,
      path: body.path || (isCustom ? `/tools/custom/${cleanSlug}` : `/tools/${cleanSlug}`),
      description: description || '',
      category: category || 'General Tools',
      icon: icon || 'Wand2',
      status: status || 'active',
      badge: badge || '',
      isCustom: isCustom ?? true,
      content: content || '',
      embedCode: embedCode || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Tool saved successfully',
      tool: saved,
    });
  } catch (err: any) {
    console.error('Error in admin tools POST:', err);
    return NextResponse.json({ error: err.message || 'Failed to save tool' }, { status: 500 });
  }
}
