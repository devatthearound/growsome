import { NextRequest, NextResponse } from 'next/server'
import { getAuthTokens, verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('Admin 권한 확인 시작...')
    
    // 1. 기본 인증 확인
    const { accessToken } = await getAuthTokens()
    
    if (!accessToken) {
      return NextResponse.json({
        isAdmin: false,
        message: '인증되지 않음',
        user: null
      }, { status: 401 })
    }

    // 2. 토큰 검증 및 사용자 정보 가져오기
    try {
      const payload = await verifyToken(accessToken)
      const userId = payload.userId
      
      // 3. 데이터베이스에서 사용자 정보 조회
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true
        }
      })

      if (!user) {
        return NextResponse.json({
          isAdmin: false,
          message: '사용자를 찾을 수 없음',
          user: null
        }, { status: 404 })
      }

      // 4. Admin 권한 체크
      const isAdmin = user.role === 'admin' || user.email === 'master@growsome.kr'
      
      if (!isAdmin) {
        console.log('Admin 권한 없음:', user.email)
        return NextResponse.json({
          isAdmin: false,
          message: '관리자 권한이 없습니다',
          user: user
        }, { status: 403 })
      }

      console.log('Admin 권한 확인됨:', user.email)
      return NextResponse.json({
        isAdmin: true,
        message: '관리자 권한 확인됨',
        user: user
      })

    } catch (tokenError: any) {
      console.log('토큰 검증 실패:', tokenError.message)
      return NextResponse.json({
        isAdmin: false,
        message: '토큰이 유효하지 않음',
        user: null
      }, { status: 401 })
    }

  } catch (error: any) {
    console.error('Admin 권한 확인 오류:', error)
    return NextResponse.json({
      isAdmin: false,
      message: '서버 오류',
      user: null
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 