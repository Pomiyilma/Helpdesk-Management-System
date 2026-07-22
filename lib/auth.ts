// lib/auth.ts
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'auth-token';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }

    console.warn('JWT_SECRET is not set; using a development fallback secret.');
    return 'dev-secret-change-me';
  }

  return secret;
}

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true }
  });

  return user;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function requireRole(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>, allowedRoles: string[]) {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error('Unauthorized');
  }
}

export async function getUserWithRoleCheck(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  requireRole(user, allowedRoles);
  return user;
}

