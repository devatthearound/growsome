import { NextRequest, NextResponse } from 'next/server'
import { getAuthTokens, refreshTokens, setAuthCookies } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('토큰 갱신 요청 시작...')
    
    // 1. 쿠키에서 리프레시 토큰 가져오기
    const { refreshToken } = await getAuthTokens()
    
    if (!refreshToken) {
      console.log('리프레시 토큰이 없음')
      return NextResponse.json({
        success: false,
        message: '리프레시 토큰이 없습니다.',
      }, { status: 401 })
    }

    console.log('리프레시 토큰 확인됨, 갱신 시도...')

    // 2. 토큰 갱신 시도
    const refreshResult = await refreshTokens(refreshToken)
    
    if (!refreshResult) {
      console.log('토큰 갱신 실패')
      return NextResponse.json({
        success: false,
        message: '토큰 갱신에 실패했습니다. 다시 로그인해주세요.',
      }, { status: 401 })
    }

    console.log('토큰 갱신 성공:', {
      userId: refreshResult.userId,
      email: refreshResult.email
    })

    // 3. 성공 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '토큰이 성공적으로 갱신되었습니다.',
    }, { status: 200 })

    // 4. 새 토큰으로 쿠키 설정
    return setAuthCookies(
      refreshResult.accessToken, 
      refreshResult.refreshToken, 
      response
    )

  } catch (error) {
    console.error('토큰 갱신 중 오류:', error)
    return NextResponse.json({
      success: false,
      message: '토큰 갱신 중 오류가 발생했습니다.',
    }, { status: 500 })
  }
}