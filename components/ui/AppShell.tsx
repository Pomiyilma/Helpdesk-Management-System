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
  MANAGER: 'text-white',
  TECHNICAL: 'text-white',
  EMPLOYEE: 'text-white',
};

export function AppShell({ user, title, subtitle, actions, children }: AppShellProps) {
  const displayName = user.name?.split(' ')[0] || 'Team';

  return (
    <div className="min-h-screen text-slate-800" style={{background: 'radial-gradient(circle at top left, rgba(192,169,189,0.25), transparent 30%), linear-gradient(135deg, #F4F2F3 0%, #6d7570 55%, #94A7AE 100%)'}}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border p-4 shadow-lg backdrop-blur" style={{borderColor: '#6d7570', backgroundColor: 'rgba(255,255,255,0.85)', boxShadow: '0 20px 60px rgba(100,118,106,0.12)'}}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-lg" style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)'}}>
                H
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{color: '#94A7AE'}}>Helpdesk Studio</p>
                <h1 className="text-xl font-semibold" style={{color: '#424f46'}}>{title}</h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{borderColor: '#6d7570', backgroundColor: '#F4F2F3'}}>
                <div>
                  <p className="text-sm font-semibold" style={{color: '#424f46'}}>{displayName}</p>
                  <p className="text-xs" style={{color: '#94A7AE'}}>{user.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role] || 'text-white'}`} style={{background: 'linear-gradient(135deg, #6d7570 0%, #94A7AE 50%, #424f46 100%)'}}>
                  {user.role}
                </span>
              </div>
              {actions}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold transition hover:opacity-80"
                  style={{borderColor: '#6d7570', color: '#424f46'}}
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between" style={{borderColor: '#6d7570', backgroundColor: 'rgba(244,242,243,0.7)'}}>
            <div>
              <p className="text-sm font-medium" style={{color: '#424f46'}}>{subtitle || 'Stay on top of requests with a calmer, clearer workspace.'}</p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm font-medium" style={{color: '#94A7AE'}}>
              <Link href="/dashboard" className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-900" style={{color: '#424f46'}}>
                Dashboard
              </Link>
              <Link href="/tickets" className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-900" style={{color: '#424f46'}}>
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
