import { NextResponse } from 'next/server';
import { getToolById, upsertTool, deleteTool } from '@/lib/tools-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { id } = await params;
  const tool = getToolById(id);

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, tool });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = getToolById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const body = await req.json();
    const updated = upsertTool({
      ...existing,
      ...body,
      id: existing.id,
      slug: body.slug || existing.slug,
      name: body.name || existing.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Tool updated successfully',
      tool: updated,
    });
  } catch (err: any) {
    console.error('Error in admin tools PUT:', err);
    return NextResponse.json({ error: err.message || 'Failed to update tool' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteTool(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Tool not found or could not be deleted' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Tool deleted successfully' });
}
