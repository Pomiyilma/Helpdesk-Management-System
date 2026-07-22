// app/tickets/[id]/AddCommentForm.tsx
'use client';

import { addCommentAction } from '@/app/actions/ticket-actions';
import { useState } from 'react';

export default function AddCommentForm({ ticketId }: { ticketId: string }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('ticketId', ticketId);
    formData.append('content', content);

    await addCommentAction(formData);
    setContent('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 border-t pt-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment or update..."
        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <button 
        type="submit" 
        disabled={isLoading || !content.trim()}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
