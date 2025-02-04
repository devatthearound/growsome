import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();
    
    // 실제 인증 없이 항상 성공 응답
    return NextResponse.json({
      verified: true
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 