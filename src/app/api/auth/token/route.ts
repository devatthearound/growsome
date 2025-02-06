import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/utils/jwt';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: '토큰을 찾을 수 없습니다.' },
      { status: 401 }
    );
  }

  try {
    // 토큰 검증
    await verifyToken(token);
    
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: '유효하지 않은 토큰입니다.' },
      { status: 401 }
    );
  }
} 