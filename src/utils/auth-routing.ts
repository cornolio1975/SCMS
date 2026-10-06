import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getDashboardRouteForUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return '/login';
  }

  // Fetch user profile and status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (!profile) return '/login';

  if (profile.status === 'PENDING') return '/pending-approval';
  if (profile.status === 'INACTIVE' || profile.status === 'SUSPENDED') return '/account-suspended';

  // Fetch active role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!userRole) return '/dashboard/unassigned';

  // Role-based routing
  switch (userRole.role) {
    case 'SUPERADMIN': return '/dashboard/superadmin';
    case 'CLUB_ADMIN': return '/dashboard/club';
    case 'BRANCH_MANAGER': return '/dashboard/branch';
    case 'STAFF': return '/dashboard/staff';
    case 'COACH': return '/dashboard/trainer';
    case 'VOLUNTEER': return '/dashboard/volunteer';
    case 'OBSERVER': return '/dashboard/observer';
    case 'MEMBER':
    case 'ATHLETE':
    case 'PARENT':
      return '/dashboard/member';
    default: return '/dashboard/guest';
  }
}

export async function checkAuthAndRoute() {
  const route = await getDashboardRouteForUser();
  redirect(route);
}
