import { NextRequest, NextResponse } from 'next/server';
import { getAuthTokens } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
    
    const jwtSecret = process.env.JWT_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    return NextResponse.json({
      environment: nodeEnv,
      hasJwtSecret: !!jwtSecret,
      jwtSecretLength: jwtSecret?.length || 0,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0,
      cookies: Object.fromEntries(
        Array.from(request.cookies.getAll().map(c => [c.name, c.value.substring(0, 10) + '...']))
      ),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
