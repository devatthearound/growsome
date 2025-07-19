import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setAuthCookies } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('로그인 시도:', { email })

    // 개발용 임시 인증 로직 (실제로는 데이터베이스에서 사용자 확인)
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.',
      }, { status: 400 })
    }

    // 임시 테스트 계정 (실제로는 데이터베이스 검증)
    const testAccounts = [
      { email: 'test@example.com', password: 'test123', userId: '1' },
      { email: 'admin@example.com', password: 'admin123', userId: '2' },
      { email: 'user@growsome.com', password: 'password', userId: '3' }
    ]

    const user = testAccounts.find(account => 
      account.email === email && account.password === password
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      }, { status: 401 })
    }

    console.log('로그인 성공:', { userId: user.userId, email: user.email })

    // 토큰 생성
    const accessToken = await generateToken(
      { userId: user.userId, email: user.email }, 
      '2h'
    )
    const refreshToken = await generateToken(
      { userId: user.userId, email: user.email }, 
      '7d'
    )

    // 사용자 데이터
    const userData = {
      id: user.userId,
      email: user.email,
      username: user.email.split('@')[0],
      slug: user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: 'user',
      canWriteContent: true
    }

    // 성공 응답
    const response = NextResponse.json({
      success: true,
      message: '로그인에 성공했습니다.',
      user: userData
    }, { status: 200 })

    // 쿠키 설정
    return setAuthCookies(accessToken, refreshToken, response)

  } catch (error) {
    console.error('로그인 중 오류:', error)
    return NextResponse.json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
    }, { status: 500 })
  }
}