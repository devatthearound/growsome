import { NextRequest, NextResponse } from 'next/server'
import { getAuthTokens, verifyToken, refreshTokens, setAuthCookies } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('인증 상태 확인 시작...')
    
    // 1. 쿠키에서 토큰 가져오기
    const { accessToken, refreshToken } = await getAuthTokens()
    
    console.log('토큰 상태:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })

    // 2. 토큰이 없는 경우
    if (!accessToken && !refreshToken) {
      console.log('토큰이 없음 - 미인증 상태')
      return NextResponse.json({
        isLoggedIn: false,
        message: '인증되지 않음 - 토큰 없음',
        user: null
      }, { status: 401 })
    }

    let userId: string | null = null
    let userEmail: string | null = null
    let isTokenRefreshed = false
    let newAccessToken: string | undefined
    let newRefreshToken: string | undefined

    // 3. 액세스 토큰 검증
    if (accessToken) {
      try {
        console.log('액세스 토큰 검증 중...')
        const payload = await verifyToken(accessToken)
        userId = payload.userId
        userEmail = payload.email
        console.log('액세스 토큰 유효:', { userId, userEmail })
      } catch (error: any) {
        console.log('액세스 토큰 무효:', error.message)
        // 액세스 토큰이 유효하지 않지만 리프레시 토큰으로 갱신 시도
      }
    }

    // 4. 액세스 토큰이 유효하지 않고 리프레시 토큰이 있는 경우
    if (!userId && refreshToken) {
      console.log('토큰 갱신 시도 중...')
      const refreshResult = await refreshTokens(refreshToken)
      
      if (!refreshResult) {
        console.log('토큰 갱신 실패')
        return NextResponse.json({
          isLoggedIn: false,
          message: '토큰 갱신 실패 - 다시 로그인 필요',
          user: null
        }, { status: 401 })
      }
      
      userId = refreshResult.userId
      userEmail = refreshResult.email
      newAccessToken = refreshResult.accessToken
      newRefreshToken = refreshResult.refreshToken
      isTokenRefreshed = true
      console.log('토큰 갱신 성공:', { userId, userEmail })
    }

    // 5. 여전히 사용자 정보가 없으면 인증 실패
    if (!userId || !userEmail) {
      console.log('사용자 정보 없음 - 인증 실패')
      return NextResponse.json({
        isLoggedIn: false,
        message: '인증 실패 - 사용자 정보 없음',
        user: null
      }, { status: 401 })
    }

    // 6. 인증 성공 - 사용자 정보 반환 (데이터베이스에서 사용자 정보 조회)
    let userData;
    
    try {
      // Prisma를 사용해 사용자 정보 조회 (role 포함)
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true
        }
      });
      
      await prisma.$disconnect();
      
      if (user) {
        userData = {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          slug: user.username.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          role: user.role || 'user',
          isAdmin: user.role === 'admin',
          canWriteContent: true
        };
      } else {
        // 데이터베이스에 사용자가 없는 경우 기본값
        userData = {
          id: userId,
          email: userEmail,
          username: userEmail.split('@')[0],
          slug: userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
          role: 'user',
          isAdmin: false,
          canWriteContent: true
        };
      }
    } catch (dbError) {
      console.error('데이터베이스 조회 오류:', dbError);
      // 데이터베이스 오류 시 기본값 사용
      userData = {
        id: userId,
        email: userEmail,
        username: userEmail.split('@')[0],
        slug: userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
        role: 'user',
        isAdmin: false,
        canWriteContent: true
      };
    }

    console.log('인증 성공:', userData)

    const response = NextResponse.json({
      isLoggedIn: true,
      message: '인증 성공',
      user: userData
    }, { status: 200 })

    // 7. 토큰이 갱신된 경우 새 쿠키 설정
    if (isTokenRefreshed && newAccessToken && newRefreshToken) {
      console.log('새 토큰으로 쿠키 업데이트')
      return setAuthCookies(newAccessToken, newRefreshToken, response)
    }

    return response

  } catch (error) {
    console.error('인증 확인 중 오류:', error)
    return NextResponse.json({
      isLoggedIn: false,
      message: '인증 확인 중 오류 발생',
      user: null
    }, { status: 500 })
  }
}