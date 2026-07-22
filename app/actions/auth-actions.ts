// app/actions/auth-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import { generateToken, setAuthCookie, comparePasswords, clearAuthCookie } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const validated = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { error: 'Invalid input' };
  }

  const user = await prisma.user.findUnique({
    where: { email: validated.data.email },
  });

  if (!user || !(await comparePasswords(validated.data.password, user.password))) {
    return { error: 'Invalid credentials' };
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await setAuthCookie(token);

  revalidatePath('/');
  redirect('/dashboard');
}

export async function logoutAction() {
  await clearAuthCookie();
  revalidatePath('/');
  redirect('/login');
}

export async function registerAction(formData: FormData) {
  void formData;
  return { error: 'Register not implemented yet' };
}

