// lib/db-health.ts
import pool from '@/lib/db';
import { supabase } from '@/lib/supabase';

export interface DatabaseHealth {
  postgresql: {
    connected: boolean;
    error?: string;
    details?: any;
  };
  supabase: {
    connected: boolean;
    error?: string;
    details?: any;
  };
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const health: DatabaseHealth = {
    postgresql: { connected: false },
    supabase: { connected: false }
  };

  // PostgreSQL 연결 확인
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as current_time');
      health.postgresql = {
        connected: true,
        details: {
          timestamp: result.rows[0].current_time,
          host: process.env.POSTGRES_HOST,
          database: process.env.POSTGRES_DATABASE,
          port: process.env.POSTGRES_PORT
        }
      };
    } finally {
      client.release();
    }
  } catch (error) {
    health.postgresql = {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown PostgreSQL error',
      details: {
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        port: process.env.POSTGRES_PORT
      }
    };
  }

  // Supabase 연결 확인
  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('blog_categories')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      // 테이블이 존재하지 않는 경우에도 연결은 성공으로 간주
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        health.supabase = {
          connected: true,
          details: {
            message: 'Connected but blog_categories table not found',
            url: process.env.NEXT_PUBLIC_SUPABASE_URL
          }
        };
      } else {
        health.supabase = {
          connected: false,
          error: error.message,
          details: {
            code: error.code,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL
          }
        };
      }
    } else {
      health.supabase = {
        connected: true,
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          categoriesCount: data?.length || 0
        }
      };
    }
  } catch (error) {
    health.supabase = {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown Supabase error',
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    };
  }

  return health;
}

// API route를 위한 헬퍼 함수
export async function createHealthCheckResponse() {
  const health = await checkDatabaseHealth();
  
  const allConnected = health.postgresql.connected && health.supabase.connected;
  
  return {
    status: allConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    databases: health,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      postgresConfigured: !!(process.env.POSTGRES_HOST && process.env.POSTGRES_DATABASE),
      supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  };
}
