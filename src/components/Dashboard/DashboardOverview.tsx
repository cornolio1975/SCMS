'use client';

/**
 * Scms Dynamic Multi-Role Dashboard Overview & Club Health Metrics
 * Sections 24 & 29: Dynamic dashboards for SuperAdmin, Club Admin, Branch Manager, Coach, Volunteer, and Parent
 */

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { store } from '@/lib/store';
import {
  Building2,
  Users,
  HeartHandshake,
  CalendarCheck2,
  CreditCard,
  Trophy,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

interface DashboardOverviewProps {
  onSelectModule: (moduleId: string) => void;
}

export default function DashboardOverview({ onSelectModule }: DashboardOverviewProps) {
  const { activeRole, activeClub, activeBranch, currentUser } = useAuth();

  const isSuperAdmin = ['SUPERADMIN', 'SYSTEM_ADMIN'].includes(activeRole);
  const isClubAdmin = ['CLUB_ADMIN', 'CLUB_CO_ADMIN'].includes(activeRole);

  const clubs = store.getClubs();
  const branches = store.getBranches(activeClub?.id);
  const members = store.getMembers(activeClub?.id, activeBranch?.id);
  const athletes = members.filter(m => m.isAthlete);
  const volunteers = store.getVolunteers(activeClub?.id);
  const invoices = store.invoices.filter(i => (activeClub ? i.clubId === activeClub.id : true));
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const openTasks = store.tasks.filter(t => t.status === 'Open');
  const pendingApprovals = store.approvals.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. WELCOME BANNER */}
      <div className="bg-gradient-to-r from-sky-600 via-[#0284C7] to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>{activeRole.replace('_', ' ')} PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome back, {currentUser?.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            {isSuperAdmin
              ? 'Platform wide multi-tenant oversight and KarateTech 3.0 bridge synchronization.'
              : `Managing ${activeClub?.name || 'Club'} operational rosters, sessions, and tournament entries.`}
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap gap-2">
          {isSuperAdmin ? (
            <button
              onClick={() => onSelectModule('approvals')}
              className="px-4 py-2 rounded-xl bg-white text-[#0284C7] font-bold text-xs hover:bg-sky-50 shadow-xs transition-colors flex items-center space-x-1.5 touch-target"
            >
              <ShieldCheck size={14} />
              <span>Pending Approvals ({pendingApprovals.length})</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectModule('take-attendance')}
              className="px-4 py-2 rounded-xl bg-white text-[#0284C7] font-bold text-xs hover:bg-sky-50 shadow-xs transition-colors flex items-center space-x-1.5 touch-target"
            >
              <CalendarCheck2 size={14} />
              <span>Take Attendance</span>
            </button>
          )}

          <button
            onClick={() => onSelectModule('kt-tournaments')}
            className="px-4 py-2 rounded-xl bg-sky-950/40 border border-white/20 text-white font-bold text-xs hover:bg-sky-950/60 shadow-xs transition-colors flex items-center space-x-1.5 touch-target"
          >
            <Trophy size={14} />
            <span>KarateTech Bridge</span>
          </button>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI METRIC CARDS (Sections 24, 29 & 32) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isSuperAdmin ? (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Clubs</span>
                <Building2 size={18} className="text-[#0284C7]" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{clubs.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                {clubs.filter(c => c.status === 'Active').length} Active • 1 Pending
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Branches</span>
                <Building2 size={18} className="text-indigo-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{store.branches.length}</span>
              <span className="text-[11px] text-slate-500 font-medium block">Across all states</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">KarateTech Bridge</span>
                <Trophy size={18} className="text-amber-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">Connected</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">2 Sanctioned Meets</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Approvals Queue</span>
                <ShieldCheck size={18} className="text-rose-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
                {pendingApprovals.length}
              </span>
              <span className="text-[11px] text-amber-600 font-semibold block">Requires Review</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Members</span>
                <Users size={18} className="text-[#0284C7]" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{members.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                {athletes.length} Registered Athletes
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Attendance Rate</span>
                <CalendarCheck2 size={18} className="text-emerald-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">94.2%</span>
              <span className="text-[11px] text-slate-500 font-medium block">Last 30 Days</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Outstanding Dues</span>
                <CreditCard size={18} className="text-amber-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
                MYR {totalOutstanding.toFixed(0)}
              </span>
              <span className="text-[11px] text-amber-600 font-semibold block">Auto-reminders active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Volunteers</span>
                <HeartHandshake size={18} className="text-indigo-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{volunteers.length}</span>
              <span className="text-[11px] text-indigo-600 font-semibold block">70.5 Total Hours</span>
            </div>
          </>
        )}
      </div>

      {/* 3. MIDDLE SECTION: CLUB HEALTH & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Operational Highlights */}
        <div className="lg:col-span-2 space-y-6">
          {/* KarateTech 3.0 Connected Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    KarateTech 3.0 Live Tournaments
                  </h3>
                  <span className="text-xs text-slate-500">Official Sanctioned Championships</span>
                </div>
              </div>

              <button
                onClick={() => onSelectModule('kt-tournaments')}
                className="text-xs font-bold text-[#0284C7] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">
                  Kelab Senshi Goju-Ryu Open Karate Championship 2026
                </span>
                <span className="text-xs text-slate-500">
                  15–16 August 2026 • Dewan Serbaguna Petaling PJ
                </span>
              </div>

              <button
                onClick={() => onSelectModule('kt-tournaments')}
                className="py-1.5 px-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Draft Roster (2 Ready)
              </button>
            </div>
          </div>

          {/* Today's Training Schedule */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Today's Class Rosters</h3>
              <button
                onClick={() => onSelectModule('coach-console')}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                Open Coach Console
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Elite Kumite Squad (16+)</span>
                  <span className="text-slate-500">Honbu Dojo Tatami Arena • 19:30 - 21:30</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  18 Present
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Activity Feed (Section 25) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Activity Stream</h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Audit Feed</span>
            </div>

            <div className="space-y-3">
              {store.activityLogs.slice(0, 5).map(act => (
                <div key={act.id} className="text-xs space-y-0.5 pb-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{act.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{act.details}</p>
                  <span className="text-[10px] font-medium text-slate-400">by {act.userName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
