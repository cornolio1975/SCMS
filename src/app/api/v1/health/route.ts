import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'SCMS — Sports Club Management System',
    company: 'SP SportData Solution',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    karateTechBridge: 'operational',
    features: {
      multiTenant: true,
      multiBranch: true,
      sportEngine: true,
      immutableIds: true,
      volunteerSystem: true,
    },
  });
}
