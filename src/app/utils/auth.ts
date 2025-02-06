import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function validateAuth(client: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    throw new Error('인증되지 않은 사용자입니다.');
  }

  const payload = await verifyToken(token);
  const userId = payload.userId;

  const sessionResult = await client.query(
    `SELECT s.* 
    FROM sessions s
    WHERE s.token = $1 
    AND s.expires_at > CURRENT_TIMESTAMP`,
    [token]
  );

  if (sessionResult.rows.length === 0) {
    throw new Error('세션이 만료되었습니다.');
  }

  return { userId, token };
} 