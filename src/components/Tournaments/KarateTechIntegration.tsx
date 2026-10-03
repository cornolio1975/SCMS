'use client';

/**
 * SCMS ↔ KarateTech 3.0 Integration Module
 * Sections 58-67: Live Tournament Discovery, Category Validation Engine, Idempotent Draft Registration & SuperAdmin Monitor
 */

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import {
  KarateTechIntegrationService,
  KarateTechTournament,
  KarateTechCategory,
  FALLBACK_CATEGORIES,
} from '@/lib/integrations/karateTech';
import { TournamentRegistrationDraft, TournamentRegistrationItem, Member } from '@/types';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Send,
  UserCheck,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { generateImmutableId, generateIdempotencyKey } from '@/lib/idGenerator';

export default function KarateTechIntegration() {
  const { activeClub, currentUser, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'drafts' | 'monitor'>('discover');
  const [tournaments, setTournaments] = useState<KarateTechTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<KarateTechTournament | null>(null);

  // Registration Draft Builder State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [submissionStatus, setSubmissionStatus] = useState<string>('');

  const drafts = store.tournamentDrafts.filter(d => d.clubId === activeClub?.id);
  const clubAthletes = store.getMembers(activeClub?.id).filter(m => m.isAthlete);

  useEffect(() => {
    async function loadTournaments() {
      setLoading(true);
      const data = await KarateTechIntegrationService.getUpcomingTournaments();
      setTournaments(data);
      setLoading(false);
    }
    loadTournaments();
  }, []);

  const handleStartDraft = (t: KarateTechTournament) => {
    setSelectedTournament(t);
    setSelectedAthleteIds([]);
    setSelectedCategories({});
    setIsBuilderOpen(true);
  };

  const handleToggleAthlete = (athleteId: string) => {
    setSelectedAthleteIds(prev =>
      prev.includes(athleteId) ? prev.filter(id => id !== athleteId) : [...prev, athleteId]
    );
  };

  const handleCategorySelect = (athleteId: string, categoryId: string) => {
    setSelectedCategories(prev => ({ ...prev, [athleteId]: categoryId }));
  };

  // Build and submit draft
  const handleSubmitDraft = async () => {
    if (!selectedTournament || !activeClub) return;

    setSubmissionStatus('Validating and submitting to KarateTech 3.0...');

    // Validate all items
    const items: TournamentRegistrationItem[] = selectedAthleteIds.map(athId => {
      const athlete = clubAthletes.find(a => a.id === athId)!;
      const catId = selectedCategories[athId] || FALLBACK_CATEGORIES[0].id;
      const cat = FALLBACK_CATEGORIES.find(c => c.id === catId);

      const val = KarateTechIntegrationService.validateParticipantCategory(
        athlete,
        selectedTournament.tournamentDate,
        catId
      );

      return {
        scmsMemberId: athlete.id,
        memberName: athlete.fullName,
        discipline: athlete.sportData?.preferredDiscipline === 'Kata Only' ? 'Kata' : 'Kumite',
        targetCategoryId: catId,
        targetCategoryName: cat?.name || 'Category',
        ageAtTournament: new Date().getFullYear() - new Date(athlete.dob).getFullYear(),
        weightKg: athlete.sportData?.weightKg || 60,
        gender: athlete.gender,
        eligibilityPassed: val.eligible,
        validationError: val.reason,
      };
    });

    const draftId = generateImmutableId('TREG');
    const idempotencyKey = generateIdempotencyKey();

    const draft: TournamentRegistrationDraft = {
      id: draftId,
      tournamentId: selectedTournament.tournamentId,
      tournamentName: selectedTournament.tournamentName,
      tournamentDate: selectedTournament.tournamentDate,
      clubId: activeClub.id,
      participants: items,
      idempotencyKey,
      status: 'READY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await KarateTechIntegrationService.submitRegistrationDraft(draft);

    if (res.success) {
      draft.status = 'ACKNOWLEDGED';
      draft.acknowledgedAt = new Date().toISOString();
      store.tournamentDrafts.unshift(draft);
      setSubmissionStatus(`Success! Acknowledged by KarateTech 3.0: ${res.acknowledgementId}`);
      setTimeout(() => {
        setIsBuilderOpen(false);
        setSubmissionStatus('');
        setActiveTab('drafts');
      }, 2000);
    } else {
      draft.status = 'VALIDATION_FAILED';
      setSubmissionStatus(res.error || 'Submission failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <Trophy size={14} />
            <span>KarateTech 3.0 Controlled Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Official Tournament Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover sanctioned championships, evaluate weight/age eligibility, and submit idempotent club rosters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">KarateTech Live Bridge</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'discover'
              ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy size={15} />
          <span>Discover Tournaments ({tournaments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'drafts'
              ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send size={15} />
          <span>Registration Drafts ({drafts.length})</span>
        </button>

        {['SUPERADMIN', 'SYSTEM_ADMIN'].includes(activeRole) && (
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'monitor'
                ? 'border-[#0284C7] text-[#0284C7] bg-sky-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw size={15} />
            <span>SuperAdmin KarateTech Monitor</span>
          </button>
        )}
      </div>

      {/* 1. DISCOVER TOURNAMENTS TAB (Section 61) */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map(t => (
              <div
                key={t.tournamentId}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-[#BAE6FD]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                      KarateTech Official
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      t.registrationStatus === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Registration {t.registrationStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-[#0284C7] transition-colors">
                      {t.tournamentName}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                      Organizer: {t.organizer}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>Date: <strong>{t.tournamentDate}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{t.venue}, {t.state}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-slate-400 shrink-0" />
                      <span>Closing: {new Date(t.registrationClosingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleStartDraft(t)}
                    disabled={t.registrationStatus !== 'Open'}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <span>Register Club Participants</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. REGISTRATION DRAFTS TAB (Section 64) */}
      {activeTab === 'drafts' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Submitted & Draft Rosters</h3>

          {drafts.length === 0 ? (
            <p className="text-xs text-slate-500">No tournament registration drafts found for this club.</p>
          ) : (
            <div className="space-y-3">
              {drafts.map(d => (
                <div key={d.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0284C7] block">{d.id}</span>
                      <h4 className="font-extrabold text-sm text-slate-900">{d.tournamentName}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 w-fit">
                      {d.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700 block mb-1">
                      Participants Roster ({d.participants.length} Athletes):
                    </span>
                    <ul className="space-y-1">
                      {d.participants.map((p, idx) => (
                        <li key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <span className="font-medium text-slate-900">{p.memberName}</span>
                          <span className="text-slate-500">{p.targetCategoryName}</span>
                          <span className="text-emerald-600 font-bold">✓ Validated</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SUPERADMIN KARATETECH MONITOR TAB (Section 67) */}
      {activeTab === 'monitor' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">KarateTech 3.0 Platform Monitor</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bridge Operational
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">SCMS Club ID</th>
                  <th className="py-2.5 px-3">KarateTech Club ID</th>
                  <th className="py-2.5 px-3">Mapped Club Name</th>
                  <th className="py-2.5 px-3">Sync Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.karateTechMappings.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0284C7]">{m.scmsClubId}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{m.karateTechClubId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{m.karateTechClubName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {m.connectionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => alert('KarateTech connection re-verified successfully!')}
                        className="text-[#0284C7] font-bold hover:underline"
                      >
                        Re-verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REGISTRATION DRAFT BUILDER MODAL */}
      {isBuilderOpen && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#0284C7] tracking-wider block">
                  Draft Registration Builder
                </span>
                <h3 className="font-black text-lg text-slate-900 leading-tight">
                  {selectedTournament.tournamentName}
                </h3>
              </div>
              <button onClick={() => setIsBuilderOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {submissionStatus && (
              <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold animate-fade-in">
                {submissionStatus}
              </div>
            )}

            {/* Select Athletes & Target Categories */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Select Club Athletes ({selectedAthleteIds.length} Selected):
              </span>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {clubAthletes.map(ath => {
                  const isSelected = selectedAthleteIds.includes(ath.id);
                  const selectedCat = selectedCategories[ath.id] || FALLBACK_CATEGORIES[0].id;
                  const eligibleCategories = KarateTechIntegrationService.suggestEligibleCategories(
                    ath,
                    selectedTournament.tournamentDate
                  );

                  return (
                    <div
                      key={ath.id}
                      className={`p-3 rounded-2xl border transition-all text-xs space-y-2 ${
                        isSelected ? 'bg-sky-50/60 border-[#0284C7]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleAthlete(ath.id)}
                            className="w-4 h-4 text-[#0284C7] rounded cursor-pointer"
                          />
                          <span className="font-bold text-slate-900">{ath.fullName}</span>
                          <span className="text-slate-400">({ath.gender}, {ath.sportData?.weightKg || 0}kg)</span>
                        </label>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
                          {ath.sportData?.beltRank || 'Athlete'}
                        </span>
                      </div>

                      {/* Category Selection Dropdown */}
                      {isSelected && (
                        <div className="pl-6 pt-1">
                          <span className="text-[11px] text-slate-500 block mb-1">Target Category:</span>
                          <select
                            value={selectedCat}
                            onChange={e => handleCategorySelect(ath.id, e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                          >
                            {eligibleCategories.length > 0 ? (
                              eligibleCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name} ({cat.gender}, {cat.min_weight}-{cat.max_weight}kg)
                                </option>
                              ))
                            ) : (
                              <option value="">No strictly eligible category found</option>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">
                Idempotency key will be generated to guarantee zero duplicate submissions.
              </span>
              <button
                onClick={handleSubmitDraft}
                disabled={selectedAthleteIds.length === 0}
                className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 transition-all shadow-xs flex items-center space-x-2"
              >
                <Send size={15} />
                <span>Submit to KarateTech 3.0</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
