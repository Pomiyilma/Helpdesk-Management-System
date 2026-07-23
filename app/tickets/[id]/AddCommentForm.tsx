'use client';

import { addCommentAction } from '@/app/actions/ticket-actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function AddCommentForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('ticketId', ticketId);
      formData.append('content', content);

      const result = await addCommentAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      setContent('');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold" style={{color: '#424f46'}}>Add comment</h3>
        <p className="mt-1 text-sm" style={{color: '#94A7AE'}}>Share an update with everyone who can access this ticket.</p>
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
      )}

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Add a comment or update..."
        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
        style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
        rows={3}
      />

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
        style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)', boxShadow: '0 10px 30px rgba(100,118,106,0.3)'}}
      >
        {isPending ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}
