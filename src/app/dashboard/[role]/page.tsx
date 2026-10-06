import React from 'react';
import WorkspaceView from '@/components/Workspace/WorkspaceView';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardRolePage(props: any) {
  const resolvedParams = await props.params;
  const { role } = resolvedParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Authoritative Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.status === 'PENDING') redirect('/pending-approval');
  if (profile.status === 'INACTIVE' || profile.status === 'SUSPENDED') redirect('/account-suspended');

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const dbRole = userRole?.role;

  // Validate the route matches their actual authorized role
  const roleMap: Record<string, string[]> = {
    'superadmin': ['SUPERADMIN'],
    'admin': ['SYSTEM_ADMIN'], // In case there's an admin role
    'club': ['CLUB_ADMIN', 'CLUB_CO_ADMIN'],
    'branch': ['BRANCH_MANAGER'],
    'staff': ['STAFF'],
    'trainer': ['COACH'],
    'volunteer': ['VOLUNTEER'],
    'observer': ['OBSERVER'],
    'member': ['MEMBER', 'ATHLETE', 'PARENT'],
    'guest': []
  };

  const allowedDbRoles = roleMap[role] || [];
  
  if (role !== 'guest' && !allowedDbRoles.includes(dbRole)) {
    // Attempting to access an unauthorized URL, bounce them to dispatcher
    redirect('/api/auth/route-dispatch');
  }

  // They are authorized, render the WorkspaceView
  // Pass the dbRole as a prop so the client side can use it reliably without trusting the browser
  return <WorkspaceView initialModule="dashboard" serverRole={dbRole || 'MEMBER'} />;
}
