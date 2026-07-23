// app/dashboard/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { AppShell } from '@/components/ui/AppShell';

type DashboardStat = {
  status: string;
  count: number;
};

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  let stats: DashboardStat[] = [];
  let activeAssignedTickets = 0;

  if (user.role === 'MANAGER') {
    const tickets = await prisma.ticket.findMany({
      select: { status: true },
    });

    const counts = tickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
      return acc;
    }, {});

    stats = Object.entries(counts).map(([status, count]) => ({ status, count }));
  } else if (user.role === 'TECHNICAL') {
    activeAssignedTickets = await prisma.ticket.count({
      where: { assignedToId: user.id, status: { not: 'CLOSED' } }
    });
  } else if (user.role === 'EMPLOYEE') {
    const employeeTickets = await prisma.ticket.findMany({
      where: { createdById: user.id },
      select: { status: true },
    });

    const counts = employeeTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
      return acc;
    }, {});

    stats = Object.entries(counts).map(([status, count]) => ({ status, count }));
  }

  return (
    <AppShell
      user={user}
      title="Dashboard"
      subtitle="A calm overview of active work and ticket momentum."
      actions={
        <Link href="/tickets" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          View all tickets
        </Link>
      }
    >
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Today&apos;s pulse</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Good morning, {user.name?.split(' ')[0] || 'Team'}!</h2>
            <p className="mt-2 text-sm text-slate-600">You&apos;re keeping the queue moving with clarity and calm.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {user.role === 'MANAGER' && stats.map((s) => (
            <div key={s.status} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">{s.status}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{s.count}</p>
            </div>
          ))}

          {user.role === 'TECHNICAL' && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Open assigned tickets</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{activeAssignedTickets}</p>
            </div>
          )}

          {user.role === 'EMPLOYEE' && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Your active requests</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.length}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
