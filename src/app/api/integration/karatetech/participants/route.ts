import { NextResponse } from 'next/server';
import { authorizeUser } from '../util';
import { createClient } from '@/utils/supabase/server';
import { KarateTechSyncService, KarateTechParticipantPayload } from '@/lib/integrations/karatetech-sync';

export async function POST(request: Request) {
  try {
    const { user, error, isClubManager, isAdmin } = await authorizeUser(request);
    if (error) return error;

    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json({ success: false, message: 'memberId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch Member from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, user_roles(club_id)')
      .eq('id', memberId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    const clubId = profile.user_roles?.[0]?.club_id || 'UNKNOWN_CLUB';

    // 2. Validate Permissions
    if (!isAdmin && isClubManager) {
      // Validate
    }

    // 3. Map to KarateTech Payload
    const payload: KarateTechParticipantPayload = {
      scms_member_id: profile.id,
      scms_club_id: clubId,
      club_name: 'SCMS Club',
      participant_name: profile.full_name || 'Unknown',
      gender: 'Mixed', // Gender missing in profiles
      date_of_birth: null,
      email: profile.email || null,
      phone: profile.phone || null,
    };

    // 4. Sync
    const result = await KarateTechSyncService.executeSync(payload, user.id);

    if (result.success) {
      return NextResponse.json({ success: true, karatetechId: result.karatetechId });
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
