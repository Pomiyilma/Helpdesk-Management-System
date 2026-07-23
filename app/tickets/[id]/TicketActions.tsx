'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  assignTicketAction,
  updatePriorityAction,
  updateStatusAction,
} from '@/app/actions/ticket-actions';

type TechnicalStaffMember = {
  id: string;
  name: string | null;
  email: string;
};

type TicketActionsProps = {
  ticketId: string;
  status: string;
  priority: string;
  assignedToId: string | null;
  userRole: string;
  technicalStaff: TechnicalStaffMember[];
};

const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export default function TicketActions({
  ticketId,
  status,
  priority,
  assignedToId,
  userRole,
  technicalStaff,
}: TicketActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(assignedToId ?? '');
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleAssign = () => {
    if (!selectedAssignee) {
      setError('Select a technical employee to assign this ticket.');
      return;
    }

    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('ticketId', ticketId);
      formData.append('assigneeId', selectedAssignee);

      const result = await assignTicketAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const handlePriorityUpdate = () => {
    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('ticketId', ticketId);
      formData.append('priority', selectedPriority);

      const result = await updatePriorityAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const handleStatusUpdate = () => {
    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('ticketId', ticketId);
      formData.append('status', selectedStatus);

      const result = await updateStatusAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const handleQuickStatus = (nextStatus: string) => {
    setError('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('ticketId', ticketId);
      formData.append('status', nextStatus);

      const result = await updateStatusAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const showManagerControls = userRole === 'MANAGER' && status !== 'CLOSED';
  const showTechnicalControls = userRole === 'TECHNICAL' && status !== 'CLOSED';
  const showEmployeeControls = userRole === 'EMPLOYEE' && status === 'RESOLVED';

  if (!showManagerControls && !showTechnicalControls && !showEmployeeControls) {
    return null;
  }

  return (
    <div className="mt-8 rounded-3xl border p-6" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
      <h3 className="text-lg font-semibold" style={{color: '#424f46'}}>Actions</h3>
      <p className="mt-1 text-sm" style={{color: '#94A7AE'}}>Available actions depend on your role and the ticket status.</p>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      {showManagerControls && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <label className="block text-sm font-medium" style={{color: '#424f46'}}>Assign to</label>
            <select
              value={selectedAssignee}
              onChange={(event) => setSelectedAssignee(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
              style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
            >
              <option value="">Select technical staff</option>
              {technicalStaff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAssign}
              disabled={isPending}
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)'}}
            >
              {isPending ? 'Assigning...' : 'Assign ticket'}
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium" style={{color: '#424f46'}}>Priority</label>
            <select
              value={selectedPriority}
              onChange={(event) => setSelectedPriority(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
              style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handlePriorityUpdate}
              disabled={isPending}
              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-60"
              style={{borderColor: '#6d7570', color: '#424f46'}}
            >
              {isPending ? 'Updating...' : 'Update priority'}
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium" style={{color: '#424f46'}}>Status</label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#94A7AE]"
              style={{borderColor: '#6d7570', backgroundColor: 'white', color: '#424f46'}}
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={isPending}
              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-60"
              style={{borderColor: '#6d7570', color: '#424f46'}}
            >
              {isPending ? 'Updating...' : 'Update status'}
            </button>
          </div>
        </div>
      )}

      {showTechnicalControls && (
        <div className="mt-6 flex flex-wrap gap-3">
          {status === 'ASSIGNED' && (
            <button
              type="button"
              onClick={() => handleQuickStatus('IN_PROGRESS')}
              disabled={isPending}
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
              style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)', boxShadow: '0 10px 30px rgba(100,118,106,0.3)'}}
            >
              {isPending ? 'Starting...' : 'Start work'}
            </button>
          )}

          {status === 'IN_PROGRESS' && (
            <button
              type="button"
              onClick={() => handleQuickStatus('RESOLVED')}
              disabled={isPending}
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{background: '#94A7AE'}}
            >
              {isPending ? 'Updating...' : 'Mark as resolved'}
            </button>
          )}
        </div>
      )}

      {showEmployeeControls && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => handleQuickStatus('CLOSED')}
            disabled={isPending}
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{background: '#94A7AE'}}
          >
            {isPending ? 'Closing...' : 'Confirm resolution & close'}
          </button>
        </div>
      )}
    </div>
  );
}
