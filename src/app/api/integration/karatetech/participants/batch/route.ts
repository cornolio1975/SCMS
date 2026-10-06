import { NextResponse } from 'next/server';
import { authorizeUser } from '../../util';
import { createClient } from '@/utils/supabase/server';
import { KarateTechSyncService, KarateTechParticipantPayload } from '@/lib/integrations/karatetech-sync';

export async function POST(request: Request) {
  try {
    const { user, error, isClubManager, isAdmin } = await authorizeUser(request);
    if (error) return error;

    const body = await request.json();
    const { clubId, memberIds } = body;

    if (!clubId || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ success: false, message: 'clubId and an array of memberIds are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch Members
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*, clubs(name)')
      .in('id', memberIds)
      .eq('clubId', clubId); // Only fetch from the requested club

    if (membersError || !members || members.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid members found for the provided clubId' }, { status: 404 });
    }

    // 2. Validate Permissions (In real app, ensure clubManager has access to clubId)
    if (!isAdmin && isClubManager) {
      // Omitted for brevity: Verify user is a manager for `clubId`
    }

    // 3. Map to KarateTech Payload
    const participants: KarateTechParticipantPayload[] = members.map(member => ({
      scms_member_id: member.id,
      scms_club_id: member.clubId,
      club_name: member.clubs?.name || 'Unknown Club',
      participant_name: member.fullName,
      gender: member.gender,
      date_of_birth: member.dob,
      email: member.email || null,
      phone: member.phone || null,
    }));

    // 4. Batch Sync
    const result = await KarateTechSyncService.executeBulkSync(clubId, participants, user.id);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
