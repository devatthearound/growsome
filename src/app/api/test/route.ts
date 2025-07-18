import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API 라우트가 정상적으로 작동합니다',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'POST 요청이 정상적으로 처리되었습니다',
    timestamp: new Date().toISOString()
  });
}