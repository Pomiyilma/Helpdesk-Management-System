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
    const params = new URLSearchParams();
    
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    if (category) params.set('category', category);
    if (assignedTo) params.set('assignedTo', assignedTo);
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);

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
    <div className="rounded-2xl border p-5" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Search</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
            style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
            style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
            style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
            style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {userRole === 'MANAGER' && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Assigned to</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
              style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
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
          <label className="block text-sm font-medium mb-2" style={{color: '#424f46'}}>Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
            style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
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
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)'}}
        >
          Apply filters
        </button>
        <button
          onClick={clearFilters}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold transition hover:opacity-80"
          style={{borderColor: '#6d7570', color: '#424f46'}}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
