// app/tickets/page.tsx
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { AppShell } from '@/components/ui/AppShell';
import { Suspense } from 'react';
import TicketFilters from './TicketFilters';

type TicketListItem = {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  createdAt: Date;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
  assignedTo: {
    name: string | null;
    email: string;
  } | null;
};

type TicketListProps = {
  searchParams: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
    sortBy?: string;
  };
};

async function TicketList({ searchParams }: TicketListProps) {
  const user = await getCurrentUser();
  if (!user) return <div>Please log in</div>;

  const where: any = {};

  if (user.role === 'MANAGER') {
    if (searchParams.assignedTo) {
      where.assignedToId = searchParams.assignedTo;
    }
  } else if (user.role === 'TECHNICAL') {
    where.assignedToId = user.id;
  } else {
    where.createdById = user.id;
  }

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.priority) {
    where.priority = searchParams.priority;
  }

  if (searchParams.category) {
    where.category = searchParams.category;
  }

  if (searchParams.search) {
    where.title = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const statusOrder = { OPEN: 0, ASSIGNED: 1, IN_PROGRESS: 2, RESOLVED: 3, CLOSED: 4 };

  let orderBy: any = { createdAt: 'desc' };
  if (searchParams.sortBy === 'priority') {
    orderBy = { priority: 'desc' };
  } else if (searchParams.sortBy === 'status') {
    orderBy = { status: 'asc' };
  } else if (searchParams.sortBy === 'date') {
    orderBy = { createdAt: 'desc' };
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include: { createdBy: true, assignedTo: true },
    orderBy,
  });

  const sortedTickets = [...tickets].sort((a, b) => {
    if (searchParams.sortBy === 'priority') {
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    if (searchParams.sortBy === 'status') {
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
    return 0;
  });

  const technicalStaff = user.role === 'MANAGER'
    ? await prisma.user.findMany({
        where: { role: 'TECHNICAL' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      })
    : [];

  return (
    <>
      <TicketFilters
        searchParams={searchParams}
        technicalStaff={technicalStaff}
        userRole={user.role}
      />

      <div className="grid gap-4 mt-6">
        {sortedTickets.length === 0 ? (
          <div className="rounded-3xl border p-8 text-center" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
            <p style={{color: '#94A7AE'}}>No tickets found matching your criteria.</p>
          </div>
        ) : (
          sortedTickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="block rounded-3xl border p-5 transition hover:-translate-y-1 hover:bg-white" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-medium" style={{color: '#94A7AE'}}>{ticket.ticketId}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white" style={{backgroundColor: '#6d7570'}}>{ticket.priority}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{backgroundColor: '#94A7AE'}}>{ticket.category.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 className="text-lg font-semibold" style={{color: '#424f46'}}>{ticket.title}</h3>
                  <p className="mt-2 text-sm leading-6 line-clamp-2" style={{color: '#94A7AE'}}>{ticket.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs" style={{color: '#94A7AE'}}>
                    <span>Created by {ticket.createdBy?.name || ticket.createdBy?.email || 'Unknown'}</span>
                    {ticket.assignedTo && (
                      <span>Assigned to {ticket.assignedTo.name || ticket.assignedTo.email}</span>
                    )}
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="rounded-2xl border bg-white px-3 py-2 text-sm font-medium whitespace-nowrap" style={{borderColor: '#6d7570', color: '#424f46'}}>
                  {ticket.status.replace(/_/g, ' ')}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}

export default async function TicketsPage({ searchParams }: TicketListProps) {
  const user = await getCurrentUser();
  if (!user) return <div>Please log in</div>;

  return (
    <AppShell
      user={user}
      title="Ticket Queue"
      subtitle="Review, route, and follow up on support items from one place."
      actions={
        user.role === 'EMPLOYEE' ? (
          <Link href="/tickets/new" className="rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90" style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)', boxShadow: '0 10px 30px rgba(100,118,106,0.3)'}}>
            New ticket
          </Link>
        ) : null
      }
    >
      <div className="rounded-[28px] border p-6 shadow-lg backdrop-blur sm:p-8" style={{borderColor: '#6d7570', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 20px 60px rgba(100,118,106,0.12)'}}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{color: '#94A7AE'}}>Queue</p>
            <h2 className="text-2xl font-semibold" style={{color: '#424f46'}}>All tickets</h2>
          </div>
        </div>

        <Suspense fallback={<div className="text-slate-600">Loading tickets...</div>}>
          <TicketList searchParams={searchParams} />
        </Suspense>
      </div>
    </AppShell>
  );
}
