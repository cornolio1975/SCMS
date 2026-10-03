import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const clubs = store.getClubs(status);
  return NextResponse.json({ success: true, count: clubs.length, data: clubs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.primaryAdminEmail) {
      return NextResponse.json(
        { success: false, error: 'Club name and primary administrator email are required.' },
        { status: 400 }
      );
    }

    const club = store.registerClub(body, {
      name: body.primaryAdminName || 'Primary Admin',
      email: body.primaryAdminEmail,
      phone: body.primaryAdminPhone || '',
    });

    return NextResponse.json({ success: true, data: club }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
