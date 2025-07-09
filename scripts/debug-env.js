#!/usr/bin/env node

// scripts/debug-env.js
// 환경변수 디버깅 스크립트

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.error('.env.local 파일을 읽을 수 없습니다:', error.message);
  }
}

loadEnvFile();

console.log('🔍 환경변수 디버깅');
console.log('==================');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (길이: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');

console.log('\n🧪 Supabase 연결 테스트');
console.log('======================');

async function testConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('❌ 환경변수가 설정되지 않았습니다!');
      return;
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('✅ Supabase 클라이언트 생성 성공');
    
    // 기본 연결 테스트
    console.log('\n1. 기본 연결 테스트...');
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('✅ 연결 성공 (테이블이 없는 것은 정상)');
      } else {
        console.log('⚠️ 연결 이슈:', error.message);
        console.log('Error Code:', error.code);
        console.log('Error Details:', error.details);
      }
    }
    
    // 스키마 정보 조회
    console.log('\n2. 스키마 정보 조회...');
    const { data: tables, error: schemaError } = await supabase.rpc('get_schema_tables');
    
    if (schemaError) {
      console.log('스키마 조회 실패:', schemaError.message);
    } else {
      console.log('스키마 조회 성공:', tables);
    }
    
    // 직접 SQL 쿼리 테스트
    console.log('\n3. 직접 SQL 쿼리 테스트...');
    const { data: sqlResult, error: sqlError } = await supabase.rpc('exec_sql', {
      query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'blog_%'`
    });
    
    if (sqlError) {
      console.log('SQL 쿼리 실패:', sqlError.message);
    } else {
      console.log('SQL 쿼리 성공:', sqlResult);
    }
    
  } catch (error) {
    console.log('❌ 테스트 실패:', error.message);
    console.log('스택:', error.stack);
  }
}

testConnection();
