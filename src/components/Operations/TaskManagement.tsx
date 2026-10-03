'use client';

/**
 * SCMS Task Management Component
 * Section 19 & 43: Task ID, Assigned user, Club/Branch scope, Priority, Status (Open, In Progress, Completed, Cancelled)
 */

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { SystemTask, TaskPriority, TaskStatus } from '@/types';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import { generateImmutableId } from '@/lib/idGenerator';

export default function TaskManagement() {
  const { currentUser, activeClub, activeBranch } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);

  const tasks = store.tasks.filter(t =>
    filterStatus === 'All' ? true : t.status === filterStatus
  );

  const handleToggleStatus = (taskId: string) => {
    const t = store.tasks.find(x => x.id === taskId);
    if (!t) return;
    if (t.status === 'Completed') {
      t.status = 'Open';
    } else {
      t.status = 'Completed';
    }
    // Force re-render
    setFilterStatus(prev => prev);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const taskId = generateImmutableId('TSK');
    store.tasks.unshift({
      id: taskId,
      title,
      description,
      priority,
      dueDate,
      status: 'Open',
      assignedToName: currentUser?.fullName || 'Assigned Staff',
      clubId: activeClub?.id,
      branchId: activeBranch?.id,
      createdBy: currentUser?.fullName || 'User',
      createdAt: new Date().toISOString(),
    });
    setIsNewTaskOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
            <CheckSquare size={14} />
            <span>Operations & Accountability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track club maintenance, registration deadlines, and staff action items.
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="py-2.5 px-5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 touch-target"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {['All', 'Open', 'In Progress', 'Completed'].map(st => (
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

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map(t => {
          const isCompleted = t.status === 'Completed';

          return (
            <div
              key={t.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 transition-all ${
                isCompleted ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-slate-200 hover:border-[#BAE6FD]'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggleStatus(t.id)}
                  className="mt-1 w-5 h-5 text-[#0284C7] rounded-md cursor-pointer shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : t.priority === 'High'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h3
                    className={`font-extrabold text-sm text-slate-900 leading-snug ${
                      isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {t.title}
                  </h3>

                  {t.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center space-x-3 pt-1">
                    <span>Assigned: <strong className="text-slate-600">{t.assignedToName}</strong></span>
                    <span>•</span>
                    <span>Due: <strong>{t.dueDate}</strong></span>
                  </div>
                </div>
              </div>

              <span
                className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                  isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-[#0284C7]'
                }`}
              >
                {t.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">Create New Task</h3>
              <button onClick={() => setIsNewTaskOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanitize tatami floor mats before seminar"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional task requirements or equipment location..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
