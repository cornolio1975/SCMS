import { NextResponse } from 'next/server';
import { KarateTechIntegrationService } from '@/lib/integrations/karateTech';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tournaments = await KarateTechIntegrationService.getUpcomingTournaments();
    return NextResponse.json({
      success: true,
      source: 'KarateTech 3.0 Platform',
      count: tournaments.length,
      data: tournaments,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
