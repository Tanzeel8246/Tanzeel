import { NextResponse } from 'next/server';
import { toggleToolStatus } from '@/lib/tools-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { id } = await params;
  const updated = toggleToolStatus(id);

  if (!updated) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Tool status updated to ${updated.status}`,
    tool: updated,
  });
}
