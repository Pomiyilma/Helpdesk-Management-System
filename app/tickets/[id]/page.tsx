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
        <Link href="/tickets" className="rounded-2xl border bg-white px-4 py-3 text-sm font-semibold transition hover:opacity-80" style={{borderColor: '#6d7570', color: '#424f46'}}>
          Back to queue
        </Link>
      }
    >
      <div className="rounded-[28px] border p-6 shadow-lg backdrop-blur sm:p-8" style={{borderColor: '#6d7570', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 20px 60px rgba(100,118,106,0.12)'}}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{color: '#94A7AE'}}>{ticket.ticketId}</p>
            <h1 className="mt-2 text-3xl font-semibold" style={{color: '#424f46'}}>{ticket.title}</h1>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold text-white`} style={{background: ticket.status === 'CLOSED' ? '#94A7AE' : '#6d7570'}}>
            {ticket.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="mt-8 grid gap-6 rounded-3xl border p-6 md:grid-cols-2" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
          <div>
            <p className="text-sm" style={{color: '#94A7AE'}}>Priority</p>
            <p className="mt-2 font-semibold" style={{color: '#424f46'}}>{ticket.priority}</p>
          </div>
          <div>
            <p className="text-sm" style={{color: '#94A7AE'}}>Category</p>
            <p className="mt-2 font-semibold" style={{color: '#424f46'}}>{ticket.category.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-sm" style={{color: '#94A7AE'}}>Requested by</p>
            <p className="mt-2 font-semibold" style={{color: '#424f46'}}>{ticket.createdBy.name || ticket.createdBy.email}</p>
          </div>
          <div>
            <p className="text-sm" style={{color: '#94A7AE'}}>Assigned to</p>
            <p className="mt-2 font-semibold" style={{color: '#424f46'}}>{ticket.assignedTo?.name || ticket.assignedTo?.email || 'Unassigned'}</p>
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

        <div className="mt-8 rounded-3xl border p-6" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
          <p className="text-sm" style={{color: '#94A7AE'}}>Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7" style={{color: '#424f46'}}>{ticket.description}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold" style={{color: '#424f46'}}>Activity timeline</h3>
          <div className="mt-4 space-y-5 pl-6" style={{borderLeft: '2px solid #6d7570'}}>
            {ticket.comments.length === 0 ? (
              <p className="text-sm" style={{color: '#94A7AE'}}>No activity yet.</p>
            ) : (
              ticket.comments.map((comment: TicketCommentView) => (
                <div key={comment.id} className="relative">
                  <div className="absolute -left-8 mt-1 h-4 w-4 rounded-full" style={{background: '#94A7AE'}} />
                  <div className="rounded-2xl border bg-white p-4" style={{borderColor: '#6d7570'}}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold" style={{color: '#424f46'}}>{comment.user.name || comment.user.email}</span>
                        <span className="rounded-full px-2 py-1 text-xs font-medium text-white" style={{backgroundColor: '#6d7570'}}>
                          {commentTypeLabels[comment.type] ?? comment.type}
                        </span>
                      </div>
                      <span className="text-sm" style={{color: '#94A7AE'}}>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7" style={{color: '#424f46'}}>{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {ticket.status !== 'CLOSED' && (
          <div className="mt-8 rounded-3xl border p-6" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
            <AddCommentForm ticketId={ticket.id} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
