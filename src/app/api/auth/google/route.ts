import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { PrismaClient } from '@prisma/client'
import { generateToken, setAuthCookies } from '@/lib/auth'
import { isAdminUser } from '@/utils/admin'

const prisma = new PrismaClient()

// Google OAuth 설정
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential } = body

    console.log('Google OAuth 로그인 시도')

    if (!credential) {
      return NextResponse.json({
        success: false,
        message: 'Google 인증 정보가 필요합니다.',
      }, { status: 400 })
    }

    if (!CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID가 설정되지 않았습니다')
      return NextResponse.json({
        success: false,
        message: 'Google OAuth 설정이 올바르지 않습니다.',
      }, { status: 500 })
    }

    // Google ID 토큰 검증
    const client = new OAuth2Client(CLIENT_ID)
    
    let ticket
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID,
      })
    } catch (error) {
      console.error('Google ID 토큰 검증 실패:', error)
      return NextResponse.json({
        success: false,
        message: 'Google 인증에 실패했습니다.',
      }, { status: 401 })
    }

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return NextResponse.json({
        success: false,
        message: 'Google 사용자 정보를 가져올 수 없습니다.',
      }, { status: 401 })
    }

    const { email, name, picture, email_verified } = payload

    if (!email_verified) {
      return NextResponse.json({
        success: false,
        message: '이메일 인증이 완료되지 않은 Google 계정입니다.',
      }, { status: 401 })
    }

    console.log('Google 사용자 정보:', { email, name })

    // 데이터베이스에서 사용자 확인 또는 생성
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // 새 사용자 생성
      console.log('새 사용자 생성:', email)
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: name || email.split('@')[0],
          password: null, // OAuth 사용자는 password null
          avatar: picture,
          status: 'active',
          phoneNumber: '', // OAuth에서는 빈 값으로 설정
          companyName: null,
          position: null
        }
      })
    } else {
      // 기존 사용자 정보 업데이트 (필요한 경우)
      if (user.avatar !== picture || user.username !== name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            username: name || user.username,
            avatar: picture || user.avatar
          }
        })
      }
    }

    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: '비활성화된 계정입니다. 관리자에게 문의해주세요.',
      }, { status: 401 })
    }

    console.log('로그인 성공:', { userId: user.id, email: user.email })

    // 관리자 권한 확인
    const isAdmin = isAdminUser(user.email)

    // 토큰 생성
    const accessToken = await generateToken(
      { userId: user.id.toString(), email: user.email }, 
      '2h'
    )
    const refreshToken = await generateToken(
      { userId: user.id.toString(), email: user.email }, 
      '7d'
    )

    // 사용자 데이터
    const userData = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      companyName: user.companyName,
      position: user.position,
      avatar: user.avatar,
      status: user.status,
      isAdmin,
      canWriteContent: true
    }

    // 성공 응답
    const response = NextResponse.json({
      success: true,
      message: 'Google 로그인에 성공했습니다.',
      user: userData
    }, { status: 200 })

    // 쿠키 설정
    return setAuthCookies(accessToken, refreshToken, response)

  } catch (error) {
    console.error('Google OAuth 로그인 중 오류:', error)
    return NextResponse.json({
      success: false,
      message: 'Google 로그인 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}