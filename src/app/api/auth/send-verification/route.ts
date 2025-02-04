import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    // 실제 인증 없이 항상 성공 응답
    return NextResponse.json({
      success: true,
      message: '인증번호가 발송되었습니다.'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 