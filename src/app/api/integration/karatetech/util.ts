import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function authorizeUser(request?: Request) {
  // Test hook for E2E script
  if (request && process.env.NODE_ENV !== 'production') {
    const testRole = request.headers.get('X-Test-Role');
    if (testRole) {
      if (testRole === 'UNAUTHENTICATED') {
        return { error: NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 }) };
      }
      const isAdmin = ['SUPERADMIN', 'SYSTEM_ADMIN'].includes(testRole);
      const isClubManager = ['CLUB_ADMIN', 'CLUB_CO_ADMIN', 'BRANCH_MANAGER'].includes(testRole);
      const isObserver = testRole === 'OBSERVER';

      if (!isAdmin && !isClubManager && !isObserver) {
        return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }) };
      }
      return { user: { id: 'test-user-id' }, role: testRole, isAdmin, isClubManager, isObserver };
    }
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 }) };
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const role = userRole?.role || 'MEMBER';

  // Basic check: Admin, Club Manager, Observer
  const isAdmin = ['SUPERADMIN', 'SYSTEM_ADMIN'].includes(role);
  const isClubManager = ['CLUB_ADMIN', 'CLUB_CO_ADMIN', 'BRANCH_MANAGER'].includes(role);
  const isObserver = role === 'OBSERVER';

  if (!isAdmin && !isClubManager && !isObserver) {
    return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }) };
  }

  return { user, role, isAdmin, isClubManager, isObserver };
}
