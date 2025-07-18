// lib/db-health.ts
import pool from '@/lib/db';

export interface DatabaseHealth {
  postgresql: {
    connected: boolean;
    error?: string;
    details?: any;
  };
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const health: DatabaseHealth = {
    postgresql: { connected: false }
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



  return health;
}

// API route를 위한 헬퍼 함수
export async function createHealthCheckResponse() {
  const health = await checkDatabaseHealth();
  
  const allConnected = health.postgresql.connected;
  
  return {
    status: allConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    databases: health,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      postgresConfigured: !!(process.env.POSTGRES_HOST && process.env.POSTGRES_DATABASE)
    }
  };
}
