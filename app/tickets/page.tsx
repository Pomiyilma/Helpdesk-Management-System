// app/tickets/page.tsx
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { AppShell } from '@/components/ui/AppShell';

type TicketListItem = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
};

export default async function TicketsPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Please log in</div>;

  let tickets: TicketListItem[] = [];

  if (user.role === 'MANAGER') {
    tickets = await prisma.ticket.findMany({
      include: { createdBy: true, assignedTo: true },
      orderBy: { createdAt: 'desc' },
    });
  } else if (user.role === 'TECHNICAL') {
    tickets = await prisma.ticket.findMany({
      where: { assignedToId: user.id },
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    tickets = await prisma.ticket.findMany({
      where: { createdById: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  return (
    <AppShell
      user={user}
      title="Ticket Queue"
      subtitle="Review, route, and follow up on support items from one place."
      actions={
        user.role === 'EMPLOYEE' ? (
          <Link href="/tickets/new" className="rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-90">
            New ticket
          </Link>
        ) : null
      }
    >
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Queue</p>
            <h2 className="text-2xl font-semibold text-slate-900">Open and recent tickets</h2>
          </div>
        </div>

        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="block rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition hover:-translate-y-1 hover:border-sky-300 hover:bg-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">{ticket.priority}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{ticket.description}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                  {ticket.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
