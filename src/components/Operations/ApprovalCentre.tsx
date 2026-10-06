'use client';

/**
 * Scms Approval Centre
 * Section 18: Centralized, audited multi-tenant approvals (Club registrations, branch creation, role elevations, transfers)
 */

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { ApprovalRequest } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  User,
  Filter,
} from 'lucide-react';

export default function ApprovalCentre() {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const approvals = store.approvals.filter(a =>
    filterStatus === 'All' ? true : a.status === filterStatus
  );

  const handleApprove = (approvalId: string) => {
    const success = store.approveClub(
      approvalId,
      currentUser?.fullName || 'SuperAdmin',
      reviewNotes[approvalId] || 'Approved'
    );
    if (!success) {
      const app = store.approvals.find(a => a.id === approvalId);
      if (app) {
        app.status = 'Approved';
        app.reviewedByName = currentUser?.fullName;
        app.reviewedAt = new Date().toISOString();
        app.decisionNotes = reviewNotes[approvalId] || 'Approved';
        store.logActivity(currentUser?.fullName || 'Admin', 'Request Approved', `Approved request ${app.title}`, 'APPROVAL');
      }
    }
    // Force re-render
    setFilterStatus(prev => prev);
  };

  const handleReject = (approvalId: string) => {
    const app = store.approvals.find(a => a.id === approvalId);
    if (app) {
      app.status = 'Rejected';
      app.reviewedByName = currentUser?.fullName;
      app.reviewedAt = new Date().toISOString();
      app.decisionNotes = reviewNotes[approvalId] || 'Rejected';
      store.logActivity(currentUser?.fullName || 'Admin', 'Request Rejected', `Rejected request ${app.title}`, 'APPROVAL');
      setFilterStatus(prev => prev);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <ShieldCheck size={14} />
            <span>Governance & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Central Approval Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit and approve club registration wizards, branch additions, volunteer enrolments, and role authorizations.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-500">
            No approval requests match the selected status filter.
          </div>
        ) : (
          approvals.map(app => {
            const isPending = app.status === 'Pending';

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0284C7]">{app.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                      {app.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700 animate-pulse'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {app.title}
                  </h3>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Submitted by: <strong className="text-slate-700">{app.submittedByName}</strong></span>
                    <span>•</span>
                    <span>Date: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    {app.reviewedByName && (
                      <>
                        <span>•</span>
                        <span>Audited by: <strong className="text-slate-800">{app.reviewedByName}</strong> ({app.decisionNotes})</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Decision Actions */}
                {isPending && (
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 md:flex-initial py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 touch-target"
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 md:flex-initial py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-1.5 touch-target"
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
