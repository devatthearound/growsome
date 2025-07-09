// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createHealthCheckResponse } from '@/lib/db-health';

export async function GET() {
  try {
    const healthData = await createHealthCheckResponse();
    
    const statusCode = healthData.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
        databases: {
          postgresql: { connected: false, error: 'Health check failed' },
          supabase: { connected: false, error: 'Health check failed' }
        }
      },
      { status: 500 }
    );
  }
}
