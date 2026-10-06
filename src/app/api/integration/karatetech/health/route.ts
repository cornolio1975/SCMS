import { NextResponse } from 'next/server';
import { authorizeUser } from '../util';
import { KarateTechApiClient } from '@/lib/integrations/karatetech-sync';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { error } = await authorizeUser(request);
    if (error) return error;

    const isHealthy = await KarateTechApiClient.checkHealth();
    return NextResponse.json({ success: true, status: isHealthy ? 'healthy' : 'down' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
