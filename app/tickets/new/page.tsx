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
        <Link href="/tickets" className="rounded-2xl border bg-white px-4 py-3 text-sm font-semibold transition hover:opacity-80" style={{borderColor: '#6d7570', color: '#424f46'}}>
          Back to queue
        </Link>
      }
    >
      <div className="rounded-[28px] border p-6 shadow-lg backdrop-blur sm:p-8" style={{borderColor: '#6d7570', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 20px 60px rgba(100,118,106,0.12)'}}>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{color: '#94A7AE'}}>Create request</p>
          <h2 className="mt-2 text-2xl font-semibold" style={{color: '#424f46'}}>Tell us what needs attention.</h2>
        </div>

        <CreateTicketForm />
      </div>
    </AppShell>
  );
}
