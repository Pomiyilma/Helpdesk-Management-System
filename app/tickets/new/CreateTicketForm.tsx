'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicketAction } from '@/app/actions/ticket-actions';

export default function CreateTicketForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const result = await createTicketAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <input 
          name="title" 
          placeholder="Add a short, clear title" 
          required
          minLength={5}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" 
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea 
          name="description" 
          rows={5} 
          placeholder="Describe the issue, request, or update in a little detail"
          required
          minLength={10}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" 
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select 
            name="category" 
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Select category</option>
            <option value="IT_SUPPORT">IT Support</option>
            <option value="FACILITIES">Facilities</option>
            <option value="HR">HR</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Priority</label>
          <select 
            name="priority" 
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating ticket...' : 'Create ticket'}
      </button>
    </form>
  );
}
