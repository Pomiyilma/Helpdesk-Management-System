// app/tickets/new/page.tsx
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { AppShell } from '@/components/ui/AppShell';
import { redirect } from 'next/navigation';
import CreateTicketForm from './CreateTicketForm';

export default async function NewTicketPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  if (user.role !== 'EMPLOYEE' && user.role !== 'MANAGER') {
    redirect('/tickets');
  }

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

        <CreateTicketForm />
      </div>
    </AppShell>
  );
}
