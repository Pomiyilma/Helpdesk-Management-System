// app/(auth)/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';
import { loginAction } from '@/app/actions/auth-actions';
import { useState } from 'react';
import { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await loginAction(formData);
    if (result?.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_55%,_#fdfcfb_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-violet-700 p-8 text-white sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Helpdesk Studio</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Welcome back to calmer support.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Route requests, track updates, and keep the team aligned with one polished workspace.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-slate-200">
            <p className="font-medium">Try using the seeded accounts to explore the experience.</p>
            <p className="mt-2 text-slate-300">manager1@company.com • tech1@company.com • emp1@company.com</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500">Access your helpdesk workspace instantly.</p>
            </div>

            {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input {...register('email')} type="email" placeholder="you@company.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input {...register('password')} type="password" placeholder="Enter your password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
