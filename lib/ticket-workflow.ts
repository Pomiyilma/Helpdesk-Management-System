import type { Role, Status } from '../prisma/generated/prisma';

const TECHNICAL_TRANSITIONS: Partial<Record<Status, Status[]>> = {
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
};

const EMPLOYEE_TRANSITIONS: Partial<Record<Status, Status[]>> = {
  RESOLVED: ['CLOSED'],
};

export function canTransitionStatus(role: Role, from: Status, to: Status): boolean {
  if (from === to) return false;

  if (role === 'MANAGER') return true;

  if (role === 'TECHNICAL') {
    return TECHNICAL_TRANSITIONS[from]?.includes(to) ?? false;
  }

  if (role === 'EMPLOYEE') {
    return EMPLOYEE_TRANSITIONS[from]?.includes(to) ?? false;
  }

  return false;
}

export function formatStatusLabel(status: Status): string {
  return status.replace(/_/g, ' ');
}
