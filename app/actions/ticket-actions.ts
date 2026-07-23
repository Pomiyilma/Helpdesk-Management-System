'use server';

import { prisma } from '@/lib/prisma';
import {
  createTicketSchema,
  addCommentSchema,
  updateStatusSchema,
  assignTicketSchema,
  updatePrioritySchema,
} from '@/lib/validations/ticket';
import { getCurrentUser, getUserWithRoleCheck } from '@/lib/auth';
import { canAccessTicket } from '@/lib/ticket-access';
import { canTransitionStatus, formatStatusLabel } from '@/lib/ticket-workflow';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Status } from '@/prisma/generated/prisma';

function revalidateTicketPaths(ticketId: string) {
  revalidatePath('/tickets');
  revalidatePath('/dashboard');
  revalidatePath(`/tickets/${ticketId}`);
}

export async function createTicketAction(formData: FormData) {
  const user = await getUserWithRoleCheck(['EMPLOYEE', 'MANAGER']);

  const validated = createTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    priority: formData.get('priority'),
  });

  if (!validated.success) return { error: 'Invalid data' };

  const ticket = await prisma.ticket.create({
    data: {
      title: validated.data.title,
      description: validated.data.description,
      category: validated.data.category,
      priority: validated.data.priority,
      createdById: user.id,
      status: 'OPEN',
      ticketId: `TKT-${Date.now().toString().slice(-6)}`,
    },
  });

  revalidateTicketPaths(ticket.id);
  redirect(`/tickets/${ticket.id}`);
}

export async function assignTicketAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (user.role !== 'MANAGER') return { error: 'Only managers can assign tickets' };

  const validated = assignTicketSchema.safeParse({
    ticketId: formData.get('ticketId'),
    assigneeId: formData.get('assigneeId'),
  });

  if (!validated.success) return { error: 'Invalid assignment data' };

  const ticket = await prisma.ticket.findUnique({
    where: { id: validated.data.ticketId },
    include: { assignedTo: true },
  });

  if (!ticket) return { error: 'Ticket not found' };
  if (!canAccessTicket(user, ticket)) return { error: 'You do not have access to this ticket' };
  if (ticket.status === 'CLOSED') return { error: 'Closed tickets cannot be reassigned' };

  const assignee = await prisma.user.findUnique({
    where: { id: validated.data.assigneeId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!assignee || assignee.role !== 'TECHNICAL') {
    return { error: 'Tickets can only be assigned to technical staff' };
  }

  const assigneeLabel = assignee.name || assignee.email;
  const previousAssignee = ticket.assignedTo?.name || ticket.assignedTo?.email;

  await prisma.$transaction([
    prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        assignedToId: assignee.id,
        status: ticket.status === 'OPEN' ? 'ASSIGNED' : ticket.status,
      },
    }),
    prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        userId: user.id,
        type: 'ASSIGNMENT',
        content: previousAssignee
          ? `Reassigned ticket from ${previousAssignee} to ${assigneeLabel}.`
          : `Assigned ticket to ${assigneeLabel}.`,
      },
    }),
  ]);

  revalidateTicketPaths(ticket.id);
  return { success: true };
}

export async function updateStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const validated = updateStatusSchema.safeParse({
    ticketId: formData.get('ticketId'),
    status: formData.get('status'),
  });

  if (!validated.success) return { error: 'Invalid status update' };

  const ticket = await prisma.ticket.findUnique({
    where: { id: validated.data.ticketId },
  });

  if (!ticket) return { error: 'Ticket not found' };
  if (!canAccessTicket(user, ticket)) return { error: 'You do not have access to this ticket' };

  const nextStatus = validated.data.status as Status;

  if (!canTransitionStatus(user.role, ticket.status, nextStatus)) {
    return { error: 'You are not allowed to make this status change' };
  }

  if (user.role === 'TECHNICAL' && ticket.assignedToId !== user.id) {
    return { error: 'You can only update tickets assigned to you' };
  }

  if (user.role === 'EMPLOYEE' && ticket.createdById !== user.id) {
    return { error: 'You can only close your own tickets' };
  }

  await prisma.$transaction([
    prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: nextStatus },
    }),
    prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        userId: user.id,
        type: 'STATUS_CHANGE',
        content: `Status changed from ${formatStatusLabel(ticket.status)} to ${formatStatusLabel(nextStatus)}.`,
      },
    }),
  ]);

  revalidateTicketPaths(ticket.id);
  return { success: true };
}

export async function updatePriorityAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  if (user.role !== 'MANAGER') return { error: 'Only managers can change priority' };

  const validated = updatePrioritySchema.safeParse({
    ticketId: formData.get('ticketId'),
    priority: formData.get('priority'),
  });

  if (!validated.success) return { error: 'Invalid priority update' };

  const ticket = await prisma.ticket.findUnique({
    where: { id: validated.data.ticketId },
  });

  if (!ticket) return { error: 'Ticket not found' };
  if (!canAccessTicket(user, ticket)) return { error: 'You do not have access to this ticket' };
  if (ticket.priority === validated.data.priority) {
    return { error: 'Ticket already has this priority' };
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { priority: validated.data.priority },
  });

  revalidateTicketPaths(ticket.id);
  return { success: true };
}

export async function addCommentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const validated = addCommentSchema.safeParse({
    ticketId: formData.get('ticketId'),
    content: formData.get('content'),
  });

  if (!validated.success) return { error: 'Invalid comment' };

  const ticket = await prisma.ticket.findUnique({
    where: { id: validated.data.ticketId },
    select: { id: true, createdById: true, assignedToId: true },
  });

  if (!ticket) return { error: 'Ticket not found' };
  if (!canAccessTicket(user, ticket)) return { error: 'You do not have access to this ticket' };

  await prisma.ticketComment.create({
    data: {
      content: validated.data.content,
      ticketId: validated.data.ticketId,
      userId: user.id,
    },
  });

  revalidateTicketPaths(validated.data.ticketId);
  return { success: true };
}
