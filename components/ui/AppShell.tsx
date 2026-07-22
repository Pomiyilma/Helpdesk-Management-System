import Link from 'next/link';
import type { ReactNode } from 'react';
import { logoutAction } from '@/app/actions/auth-actions';

type AppShellProps = {
  user: {
    email: string;
    name: string | null;
    role: string;
  };
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const roleStyles: Record<string, string> = {
  MANAGER: 'bg-violet-100 text-violet-700',
  TECHNICAL: 'bg-cyan-100 text-cyan-700',
  EMPLOYEE: 'bg-emerald-100 text-emerald-700',
};

export function AppShell({ user, title, subtitle, actions, children }: AppShellProps) {
  const displayName = user.name?.split(' ')[0] || 'Team';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#f5f7ff_55%,_#fdfcfb_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-lg font-semibold text-white shadow-lg">
                H
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Helpdesk Studio</p>
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role] || 'bg-slate-100 text-slate-700'}`}>
                  {user.role}
                </span>
              </div>
              {actions}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">{subtitle || 'Stay on top of requests with a calmer, clearer workspace.'}</p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
              <Link href="/dashboard" className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/tickets" className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-900">
                Tickets
              </Link>
            </nav>
          </div>
        </header>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
