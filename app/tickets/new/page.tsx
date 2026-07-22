// app/tickets/new/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/ui/AppShell';
import { createTicketAction } from '@/app/actions/ticket-actions';

export default function NewTicketPage() {
  const [user] = useState({
    email: 'you@company.com',
    name: 'Team Member',
    role: 'EMPLOYEE',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await createTicketAction(formData);
  };

  return (
    <AppShell
      user={user}
      title="New ticket"
      subtitle="Share a request with the team in a clear, structured way."
      actions={
        <Link href="/tickets" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Back to queue
        </Link>
      }
    >
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Create request</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tell us what needs attention.</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input name="title" placeholder="Add a short, clear title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" rows={5} placeholder="Describe the issue, request, or update in a little detail" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select name="category" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100">
                <option value="IT_SUPPORT">IT Support</option>
                <option value="FACILITIES">Facilities</option>
                <option value="HR">HR</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select name="priority" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-90">
            Create ticket
          </button>
        </form>
      </div>
    </AppShell>
  );
}
