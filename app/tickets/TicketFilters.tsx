'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type TechnicalStaffMember = {
  id: string;
  name: string | null;
  email: string;
};

type TicketFiltersProps = {
  searchParams: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
    sortBy?: string;
  };
  technicalStaff: TechnicalStaffMember[];
  userRole: string;
};

const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const CATEGORIES = ['IT_SUPPORT', 'FACILITIES', 'HR', 'OTHER'];
const SORT_OPTIONS = [
  { value: 'date', label: 'Date (newest)' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

export default function TicketFilters({ searchParams, technicalStaff, userRole }: TicketFiltersProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const [status, setStatus] = useState(searchParams.status || '');
  const [priority, setPriority] = useState(searchParams.priority || '');
  const [category, setCategory] = useState(searchParams.category || '');
  const [assignedTo, setAssignedTo] = useState(searchParams.assignedTo || '');
  const [search, setSearch] = useState(searchParams.search || '');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'date');

  const updateFilters = () => {
    const params = new URLSearchParams(searchParamsObj.toString());
    
    if (status) params.set('status', status);
    else params.delete('status');
    
    if (priority) params.set('priority', priority);
    else params.delete('priority');
    
    if (category) params.set('category', category);
    else params.delete('category');
    
    if (assignedTo) params.set('assignedTo', assignedTo);
    else params.delete('assignedTo');
    
    if (search) params.set('search', search);
    else params.delete('search');
    
    if (sortBy) params.set('sortBy', sortBy);
    else params.delete('sortBy');

    router.push(`/tickets?${params.toString()}`);
  };

  const clearFilters = () => {
    setStatus('');
    setPriority('');
    setCategory('');
    setAssignedTo('');
    setSearch('');
    setSortBy('date');
    router.push('/tickets');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {userRole === 'MANAGER' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned to</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All technical staff</option>
              {technicalStaff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={updateFilters}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Apply filters
        </button>
        <button
          onClick={clearFilters}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
