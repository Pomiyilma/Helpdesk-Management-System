// app/actions/ticket-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { createTicketSchema, addCommentSchema } from '@/lib/validations/ticket';
import { getCurrentUser, getUserWithRoleCheck } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    include: { createdBy: true },
  });

  revalidatePath('/tickets');
  redirect(`/tickets/${ticket.id}`);
}

export async function addCommentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  const validated = addCommentSchema.safeParse({
    ticketId: formData.get('ticketId'),
    content: formData.get('content'),
  });

  if (!validated.success) return { error: 'Invalid comment' };

  await prisma.ticketComment.create({
    data: {
      content: validated.data.content,
      ticketId: validated.data.ticketId,
      userId: user.id,
    },
  });

  revalidatePath(`/tickets/${validated.data.ticketId}`);
  return { success: true };
}
