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
        <Link href="/tickets" className="rounded-2xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90" style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)'}}>
          View all tickets
        </Link>
      }
    >
      <div className="rounded-[28px] border p-6 shadow-lg backdrop-blur sm:p-8" style={{borderColor: '#6d7570', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 20px 60px rgba(100,118,106,0.12)'}}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{color: '#94A7AE'}}>Today&apos;s pulse</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{color: '#424f46'}}>Good morning, {user.name?.split(' ')[0] || 'Team'}!</h2>
            <p className="mt-2 text-sm" style={{color: '#94A7AE'}}>You&apos;re keeping the queue moving with clarity and calm.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {user.role === 'MANAGER' && stats.map((s) => (
            <div key={s.status} className="rounded-3xl border p-5" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
              <p className="text-sm font-medium" style={{color: '#94A7AE'}}>{s.status}</p>
              <p className="mt-3 text-4xl font-semibold" style={{color: '#424f46'}}>{s.count}</p>
            </div>
          ))}

          {user.role === 'TECHNICAL' && (
            <div className="rounded-3xl border p-5" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
              <p className="text-sm font-medium" style={{color: '#94A7AE'}}>Open assigned tickets</p>
              <p className="mt-3 text-4xl font-semibold" style={{color: '#424f46'}}>{activeAssignedTickets}</p>
            </div>
          )}

          {user.role === 'EMPLOYEE' && (
            <div className="rounded-3xl border p-5" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
              <p className="text-sm font-medium" style={{color: '#94A7AE'}}>Your active requests</p>
              <p className="mt-3 text-4xl font-semibold" style={{color: '#424f46'}}>{stats.length}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
