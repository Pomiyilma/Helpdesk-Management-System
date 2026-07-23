// lib/validations/ticket.ts
import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  category: z.enum(['IT_SUPPORT', 'FACILITIES', 'HR', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const updateStatusSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});

export const assignTicketSchema = z.object({
  ticketId: z.string().min(1),
  assigneeId: z.string().min(1),
});

export const updatePrioritySchema = z.object({
  ticketId: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const addCommentSchema = z.object({
  ticketId: z.string(),
  content: z.string().min(1),
});
