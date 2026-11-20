import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings-store';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: Request) {
  const isAuth = await isAuthorizedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveSettings(body);

    return NextResponse.json({
      success: true,
      message: 'System settings & API credentials updated successfully',
      settings: updated,
    });
  } catch (err: any) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
  }
}
