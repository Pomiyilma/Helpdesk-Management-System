import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canAccessTicket } from '@/lib/ticket-access';
import { notFound } from 'next/navigation';
import AddCommentForm from './AddCommentForm';
import TicketActions from './TicketActions';
import { AppShell } from '@/components/ui/AppShell';

type TicketCommentView = {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

const commentTypeLabels: Record<string, string> = {
  COMMENT: 'Comment',
  STATUS_CHANGE: 'Status update',
  ASSIGNMENT: 'Assignment',
};

export default async function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: true,
      assignedTo: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!ticket) notFound();
  if (!canAccessTicket(user, ticket)) notFound();

  const technicalStaff =
    user.role === 'MANAGER'
      ? await prisma.user.findMany({
          where: { role: 'TECHNICAL' },
          select: { id: true, name: true, email: true },
          orderBy: { name: 'asc' },
        })
      : [];

  return (
    <AppShell
      user={user}
      title="Ticket details"
      subtitle="Follow the conversation and keep the context clear."
      actions={
        <Link href="/tickets" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Back to queue
        </Link>
      }
    >
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{ticket.ticketId}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{ticket.title}</h1>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${ticket.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {ticket.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="mt-8 grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Priority</p>
            <p className="mt-2 font-semibold text-slate-900">{ticket.priority}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Category</p>
            <p className="mt-2 font-semibold text-slate-900">{ticket.category.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Requested by</p>
            <p className="mt-2 font-semibold text-slate-900">{ticket.createdBy.name || ticket.createdBy.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Assigned to</p>
            <p className="mt-2 font-semibold text-slate-900">{ticket.assignedTo?.name || ticket.assignedTo?.email || 'Unassigned'}</p>
          </div>
        </div>

        <TicketActions
          ticketId={ticket.id}
          status={ticket.status}
          priority={ticket.priority}
          assignedToId={ticket.assignedToId}
          userRole={user.role}
          technicalStaff={technicalStaff}
        />

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
          <p className="text-sm text-slate-500">Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{ticket.description}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">Activity timeline</h3>
          <div className="mt-4 space-y-5 border-l-2 border-slate-200 pl-6">
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              ticket.comments.map((comment: TicketCommentView) => (
                <div key={comment.id} className="relative">
                  <div className="absolute -left-8 mt-1 h-4 w-4 rounded-full bg-sky-500" />
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{comment.user.name || comment.user.email}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {commentTypeLabels[comment.type] ?? comment.type}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {ticket.status !== 'CLOSED' && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
            <AddCommentForm ticketId={ticket.id} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
