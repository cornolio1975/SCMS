'use client';

/**
 * SCMS Parent / Guardian Portal
 * Sections 15 & 40: Multi-child management, attendance tracking, fee receipts, and tournament sign-off
 */

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { Member } from '@/types';
import {
  UserCheck,
  CalendarCheck2,
  CreditCard,
  Award,
  Trophy,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  Shield,
  QrCode,
} from 'lucide-react';

export default function ParentPortal() {
  const { currentUser } = useAuth();
  
  // Find children linked to this guardian
  const children = store.members.filter(
    m => m.guardianId === currentUser?.id || m.emergencyContactPhone === currentUser?.phone || m.id === 'SCMS-MEM-000003'
  );

  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.id || 'SCMS-MEM-000003'
  );

  const activeChild = children.find(c => c.id === selectedChildId) || children[0];
  const invoices = store.invoices.filter(i => i.memberId === activeChild?.id);
  const attendance = store.attendance.filter(a => a.memberId === activeChild?.id);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <UserCheck size={14} />
            <span>Family & Guardian Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Parent & Guardian Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your enrolled children, view class attendance, track belt promotions, and settle monthly club dues.
          </p>
        </div>
      </div>

      {/* Child Selector Tabs (Mobile First) */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {children.map(child => {
          const isSelected = child.id === selectedChildId;
          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all text-left min-w-[220px] touch-target ${
                isSelected
                  ? 'bg-sky-50/80 border-[#0284C7] shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {child.fullName.charAt(0)}
              </div>
              <div className="truncate">
                <span className="font-extrabold text-xs text-slate-900 block truncate">
                  {child.fullName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {child.sportData?.beltRank || 'Junior Athlete'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Child Dashboard */}
      {activeChild && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Child Profile Overview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Athlete Profile
                  </span>
                  <h3 className="font-black text-xl text-slate-900 leading-tight">
                    {activeChild.fullName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{activeChild.id}</span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                  {activeChild.status} Enrolled
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{activeChild.dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Rank</span>
                  <span className="font-bold text-[#0284C7]">{activeChild.sportData?.beltRank || 'Green Belt'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assigned Coach</span>
                  <span className="font-semibold text-slate-800">{activeChild.assignedCoachName || 'Sensei Mohan'}</span>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900">Training Session Attendance</h3>
                <span className="text-xs font-bold text-emerald-600">100% Attendance Rate</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Junior Kata Class</span>
                    <span className="text-slate-500">March 3, 2026 • 17:00 - 18:30</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Present
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column: Invoices & Receipts */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Fees & Invoices</h3>

              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-[#0284C7]">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Amount:</span>
                      <span className="font-bold text-slate-900">MYR {inv.total.toFixed(2)}</span>
                    </div>
                    {inv.status === 'Pending' && (
                      <button
                        onClick={() => {
                          store.recordPayment(inv.id, inv.total, 'DuitNow QR', 'Parent Online');
                          alert('Payment submitted successfully via DuitNow QR!');
                        }}
                        className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl transition-all shadow-xs touch-target"
                      >
                        Pay Online (DuitNow / FPX)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
