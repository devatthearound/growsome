// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../lib/auth';
import { PrismaClient } from '@prisma/client';
import { isAdminUser } from '../../../../utils/admin';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, tokenPayload) => {
    try {
      // 사용자 정보 조회
      const user = await prisma.user.findUnique({
        where: { id: parseInt(tokenPayload.userId) },
        select: {
          id: true,
          email: true,
          username: true,
          companyName: true,
          position: true,
          avatar: true,
          status: true,
          createdAt: true
        }
      });

      if (!user) {
        return NextResponse.json(
          { isLoggedIn: false, error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 관리자 권한 확인
      const isAdmin = isAdminUser(user.email);

      return NextResponse.json({
        isLoggedIn: true,
        user: {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          companyName: user.companyName,
          position: user.position,
          avatar: user.avatar,
          status: user.status,
          isAdmin,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      return NextResponse.json(
        { isLoggedIn: false, error: '사용자 정보를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return GET(request); // GET과 동일한 로직
}