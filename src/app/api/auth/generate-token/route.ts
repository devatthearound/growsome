// n8n 워크플로우용 API 토큰 생성 엔드포인트
import { NextRequest, NextResponse } from 'next/server'

// 기본적인 토큰 생성 함수 (jwt import 없이)
function createSimpleToken(payload: any, secret: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (30 * 24 * 60 * 60) // 30일
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  
  const signature = require('crypto')
    .createHmac('sha256', secret)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return `${base64Header}.${base64Payload}.${signature}`;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Token generation API is running',
    endpoint: '/api/auth/generate-token',
    method: 'POST',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎫 Token generation API called')
    
    const body = await request.json()
    const { apiKey, purpose } = body

    console.log('📝 Request data:', { apiKey: apiKey?.substring(0, 10) + '...', purpose })

    // API Key 검증
    const masterApiKey = process.env.N8N_API_KEY || 'growsome-n8n-secure-key-2025'
    
    if (!apiKey || apiKey !== masterApiKey) {
      console.log('❌ Invalid API key')
      return NextResponse.json({
        success: false,
        message: '유효하지 않은 API Key입니다.'
      }, { status: 401 })
    }

    // 목적별 토큰 데이터 설정
    let tokenData;
    let expiresIn;

    switch (purpose) {
      case 'blog_automation':
        tokenData = {
          userId: '6', // 실제 존재하는 사용자 ID (그로우썸 관리자)
          email: 'master@growsome.kr', // 실제 사용자 이메일
          role: 'blog_automation',
          permissions: ['create_content', 'update_content']
        }
        expiresIn = '30d'
        break;
      
      case 'analytics':
        tokenData = {
          userId: '6',
          email: 'master@growsome.kr', 
          role: 'analytics',
          permissions: ['track_events', 'view_analytics']
        }
        expiresIn = '90d'
        break;
      
      default:
        tokenData = {
          userId: '6',
          email: 'master@growsome.kr',
          role: 'general',
          permissions: ['read_only']
        }
        expiresIn = '7d'
    }

    console.log('🔧 Token data prepared:', tokenData)

    // JWT 시크릿 가져오기
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

    try {
      // 간단한 토큰 생성
      const token = createSimpleToken(tokenData, jwtSecret)
      
      console.log('✅ Token generated successfully')

      return NextResponse.json({
        success: true,
        token,
        expiresIn,
        purpose,
        issuedAt: new Date().toISOString(),
        tokenData: {
          userId: tokenData.userId,
          email: tokenData.email,
          role: tokenData.role
        }
      })

    } catch (tokenError: any) {
      console.error('❌ Token generation error:', tokenError)
      
      return NextResponse.json({
        success: false,
        message: 'JWT 토큰 생성에 실패했습니다.',
        error: tokenError.message
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'API 토큰 생성에 실패했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
