#!/usr/bin/env node

// 🔍 데이터베이스 테이블 구조 확인 스크립트

const { Pool } = require('pg');

// 데이터베이스 연결 설정 (.env에서 로드)
require('dotenv').config();

const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: false
};

const dbPool = new Pool(dbConfig);

console.log('DB 연결 설정:', {
  ...dbConfig,
  password: '********',
  host: dbConfig.host,
  port: dbConfig.port
});

async function checkTables() {
  console.log('🔍 데이터베이스 테이블 구조 확인 중...\n');
  
  try {
    const client = await dbPool.connect();
    
    try {
      // 1. 모든 테이블 목록 조회
      console.log('📋 모든 테이블 목록:');
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('');
      
      // 2. blog 관련 테이블만 필터링
      const blogTables = tablesResult.rows.filter(row => 
        row.table_name.includes('blog') || 
        row.table_name.includes('post')
      );
      
      if (blogTables.length > 0) {
        console.log('📝 블로그 관련 테이블:');
        blogTables.forEach(row => {
          console.log(`   ✓ ${row.table_name}`);
        });
        console.log('');
        
        // 3. 각 블로그 테이블의 컬럼 구조 확인
        for (const table of blogTables) {
          console.log(`🔍 ${table.table_name} 테이블 구조:`);
          
          const columnsResult = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position
          `, [table.table_name]);
          
          columnsResult.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
          });
          console.log('');
        }
      } else {
        console.log('❌ 블로그 관련 테이블을 찾을 수 없습니다.');
      }
      
      // 4. 사용자 테이블 확인 (author_id 참조용)
      console.log('👤 사용자 테이블 확인:');
      const userResult = await client.query(`
        SELECT COUNT(*) as count FROM users LIMIT 1
      `);
      console.log(`   사용자 테이블 레코드 수: ${userResult.rows[0].count}`);
      
      // 첫 번째 사용자 ID 조회
      const firstUser = await client.query(`
        SELECT id, email FROM users ORDER BY id LIMIT 1
      `);
      if (firstUser.rows.length > 0) {
        console.log(`   첫 번째 사용자: ID=${firstUser.rows[0].id}, Email=${firstUser.rows[0].email}`);
      }
      console.log('');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 데이터베이스 확인 실패:', error.message);
  } finally {
    await dbPool.end();
  }
}

// 스크립트 실행
if (require.main === module) {
  checkTables();
}

module.exports = { checkTables };