import type { Role } from '../prisma/generated/prisma';

type TicketAccessRecord = {
  createdById: string;
  assignedToId: string | null;
};

export function canAccessTicket(
  user: { id: string; role: Role },
  ticket: TicketAccessRecord
): boolean {
  if (user.role === 'MANAGER') return true;
  if (user.role === 'TECHNICAL') return ticket.assignedToId === user.id;
  if (user.role === 'EMPLOYEE') return ticket.createdById === user.id;
  return false;
}

export function getTicketAccessWhere(user: { id: string; role: Role }) {
  if (user.role === 'MANAGER') return {};
  if (user.role === 'TECHNICAL') return { assignedToId: user.id };
  return { createdById: user.id };
}
