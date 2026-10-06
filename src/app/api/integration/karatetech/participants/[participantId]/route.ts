import { NextResponse } from 'next/server';
import { authorizeUser } from '../../util';
import { KarateTechSyncService } from '@/lib/integrations/karatetech-sync';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    // Workaround for Next.js 15 route params pattern (need to await if strictly required in 15.x, but keeping simple here or using it directly)
    // Actually in Next 15, params is a Promise. Let's await it to be safe.
    const resolvedParams = await params;
    const { participantId } = resolvedParams;

    if (!participantId) {
      return NextResponse.json({ success: false, message: 'participantId is required' }, { status: 400 });
    }

    const { error } = await authorizeUser(request);
    if (error) return error;

    // We can use the prepareSync method as it does a sync status check.
    // Normally we should pass the clubId, but here we can pass a dummy one just to check identity.
    const statusResult = await KarateTechSyncService.prepareSync(participantId, 'SYSTEM');

    return NextResponse.json({ success: true, data: statusResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
