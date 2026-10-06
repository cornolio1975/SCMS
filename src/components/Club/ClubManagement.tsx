'use client';

/**
 * Scms Club Management & Multi-Branch Architecture
 * Sections 4, 5 & 10: Multi-tenant club profile, Branch hierarchy (Scms-CLUB-xxxxxx-Bxxx), and Club Onboarding Wizard
 */

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { ClubBranch } from '@/types';
import {
  Building2,
  GitBranch,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { generateImmutableId } from '@/lib/idGenerator';

export default function ClubManagement() {
  const { activeClub, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'branches' | 'onboarding'>('branches');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  // New Branch state
  const [branchName, setBranchName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchState, setBranchState] = useState('Selangor');
  const [managerName, setManagerName] = useState('');
  const [operatingHours, setOperatingHours] = useState('Mon-Fri: 18:00-21:00');

  // Onboarding Wizard Step
  const [onboardingStep, setOnboardingStep] = useState(activeClub?.onboardingStep || 10);

  const branches = store.getBranches(activeClub?.id);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClub) return;

    store.addBranch(
      activeClub.id,
      {
        name: branchName,
        venueName,
        address: branchAddress,
        city: branchCity,
        state: branchState,
        managerName,
        operatingHours,
      },
      currentUser?.fullName || 'Club Admin'
    );

    setIsAddBranchOpen(false);
    setBranchName('');
    setVenueName('');
    setBranchAddress('');
    setBranchCity('');
  };

  const onboardingSteps = [
    { num: 1, title: 'Club Profile', desc: 'Identity, logo, registration number' },
    { num: 2, title: 'Branches & Dojos', desc: 'Venues and training centers' },
    { num: 3, title: 'Sport Configuration', desc: 'Belt ladders, weight divisions' },
    { num: 4, title: 'Membership Plans', desc: 'Fee structures and billing cycles' },
    { num: 5, title: 'Coaches & Staff', desc: 'Instructor credentials and roles' },
    { num: 6, title: 'Roles & Permissions', desc: 'RBAC authorization levels' },
    { num: 7, title: 'Training Groups', desc: 'Squad rosters and capacity' },
    { num: 8, title: 'Member Import', desc: 'Upload CSV/Excel athlete list' },
    { num: 9, title: 'KarateTech 3.0', desc: 'Live tournament synchronization' },
    { num: 10, title: 'Complete & Go Live', desc: 'Active club operations' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Building2 size={14} />
            <span>Multi-Club & Branch Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Club & Branch Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure club details, manage satellite dojos and venues, and monitor multi-branch operations.
          </p>
        </div>

        <button
          onClick={() => setIsAddBranchOpen(true)}
          className="py-2.5 px-5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 touch-target"
        >
          <Plus size={16} />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'branches'
              ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitBranch size={15} />
          <span>Authorized Branches ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'profile'
              ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={15} />
          <span>Club Master Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'onboarding'
              ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers size={15} />
          <span>Onboarding Progress</span>
        </button>
      </div>

      {/* 1. MULTI-BRANCH DIRECTORY (Section 5) */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(b => (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 group hover:border-[#BAE6FD] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0284C7]">{b.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-[#0284C7] transition-colors">
                      {b.name}
                    </h3>
                    <span className="text-xs text-slate-500 block mt-0.5">{b.venueName}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{b.city}, {b.state}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <span>Manager: <strong className="text-slate-800">{b.managerName || 'Unassigned'}</strong></span>
                    </div>
                    {b.operatingHours && (
                      <div className="flex items-center space-x-2">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{b.operatingHours}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Registered Members:</span>
                  <span className="font-bold text-slate-800">{b.memberCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CLUB PROFILE TAB */}
      {activeTab === 'profile' && activeClub && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-[#0284C7] block">{activeClub.id}</span>
              <h2 className="text-2xl font-black text-slate-950">{activeClub.name}</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
              {activeClub.sport}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Registration / ROS No.</span>
              <span className="font-bold text-slate-900">{activeClub.registrationNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Established Year</span>
              <span className="font-bold text-slate-900">{activeClub.establishedYear}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Phone & Email</span>
              <span className="font-semibold text-slate-800">{activeClub.phone} • {activeClub.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Primary Administrator</span>
              <span className="font-semibold text-slate-800">{activeClub.primaryAdminName}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block">Headquarters Address</span>
              <span className="font-medium text-slate-800">{activeClub.address}, {activeClub.city}, {activeClub.state}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ONBOARDING WIZARD TAB (Section 10) */}
      {activeTab === 'onboarding' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
          <div>
            <h3 className="font-black text-xl text-slate-900">10-Step Club Onboarding Blueprint</h3>
            <p className="text-xs text-slate-500 mt-1">
              Follow setup progression from club incorporation to official KarateTech 3.0 tournament linkage.
            </p>
          </div>

          <div className="space-y-3">
            {onboardingSteps.map(s => {
              const isDone = s.num <= onboardingStep;
              return (
                <div
                  key={s.num}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isDone ? 'bg-sky-50/50 border-[#BAE6FD]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                        isDone ? 'bg-[#0284C7] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.num}
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                        {s.title}
                      </span>
                      <span className="text-xs text-slate-500">{s.desc}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      isDone ? 'text-emerald-600 flex items-center space-x-1' : 'text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Completed</span>
                      </>
                    ) : (
                      'Pending'
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD BRANCH MODAL */}
      {isAddBranchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">Establish New Branch</h3>
              <button onClick={() => setIsAddBranchOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dojo Cyberjaya Tech"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Facility / Venue Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberjaya Tatami Studio"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyberjaya"
                    value={branchCity}
                    onChange={e => setBranchCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Branch Manager
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sensei Bala"
                    value={managerName}
                    onChange={e => setManagerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
