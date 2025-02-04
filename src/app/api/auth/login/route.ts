import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import { generateToken } from '@/app/utils/jwt';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email, password, rememberMe, isExtension } = await request.json();

    // 이메일 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const userResult = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.password,
        u.username,
        u.company_name,
        u.position
      FROM users u
      WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    await client.query('BEGIN');

    try {
      // 기존 세션 삭제 (선택적)
      await client.query(
        'DELETE FROM sessions WHERE user_id = $1',
        [user.id]
      );

      // 새 세션 생성
      const expiresAt = rememberMe 
        ? 'NOW() + INTERVAL \'30 days\''  // 로그인 상태 유지 시 30일
        : 'NOW() + INTERVAL \'24 hours\''; // 기본 24시간

      await client.query(
        `INSERT INTO sessions (user_id, token, expires_at)
        VALUES ($1, $2, ${expiresAt})`,
        [user.id, token]
      );

      // 마지막 로그인 시간 업데이트
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    // 사용자 정보에서 민감한 정보 제거
    delete user.password;
    // 일반 로그인 응답
    const response = NextResponse.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        company_name: user.company_name,
        position: user.position,
        isExtension: isExtension
      }
    });

    // 쿠키 설정 업데이트
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: true, // HTTPS 필수
      sameSite: 'strict', // 가장 엄격한 설정
      path: '/', // 전체 도메인에서 접근 가능
      maxAge: rememberMe 
        ? 30 * 24 * 60 * 60  // 30일
        : 24 * 60 * 60       // 24시간
    });

    return response;

  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}