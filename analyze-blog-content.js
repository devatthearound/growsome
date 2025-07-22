#!/usr/bin/env node

// 🔍 현재 블로그 콘텐츠 분석 스크립트

const { Pool } = require('pg');

// 데이터베이스 연결 설정
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

async function analyzeBlogContent() {
  console.log('📊 현재 블로그 콘텐츠 분석 중...\n');
  
  try {
    const client = await dbPool.connect();
    
    try {
      // 1. 전체 블로그 포스트 개수
      const totalResult = await client.query('SELECT COUNT(*) as count FROM blog_contents');
      console.log(`📝 총 블로그 포스트 수: ${totalResult.rows[0].count}`);
      console.log('');
      
      // 2. 카테고리별 포스트 수
      console.log('📂 카테고리별 포스트 수:');
      const categoryResult = await client.query(`
        SELECT 
          bc.id,
          bc.name,
          bc.slug,
          COUNT(content.id) as post_count
        FROM blog_categories bc
        LEFT JOIN blog_contents content ON bc.id = content.category_id
        GROUP BY bc.id, bc.name, bc.slug
        ORDER BY post_count DESC, bc.id
      `);
      
      categoryResult.rows.forEach(cat => {
        console.log(`   ${cat.id}: ${cat.name} (${cat.slug}) - ${cat.post_count}개`);
      });
      console.log('');
      
      // 3. 최근 포스트 목록
      console.log('📋 최근 블로그 포스트 (최근 5개):');
      const recentResult = await client.query(`
        SELECT 
          bc.id,
          bc.title,
          bc.slug,
          bc.status,
          bc.author_id,
          bc.category_id,
          bc.view_count,
          bc.like_count,
          bc.created_at,
          bc.published_at,
          cat.name as category_name,
          u.username as author_name
        FROM blog_contents bc
        LEFT JOIN blog_categories cat ON bc.category_id = cat.id
        LEFT JOIN users u ON bc.author_id = u.id
        ORDER BY bc.created_at DESC
        LIMIT 5
      `);
      
      recentResult.rows.forEach(post => {
        const date = new Date(post.created_at).toLocaleString('ko-KR');
        console.log(`   ${post.id}: ${post.title}`);
        console.log(`      카테고리: ${post.category_name} | 작성자: ${post.author_name || 'Unknown'}`);
        console.log(`      상태: ${post.status} | 조회: ${post.view_count || 0} | 좋아요: ${post.like_count || 0}`);
        console.log(`      생성: ${date}`);
        console.log(`      슬러그: ${post.slug}`);
        console.log('');
      });
      
      // 4. 작성자별 포스트 수
      console.log('👤 작성자별 포스트 수:');
      const authorResult = await client.query(`
        SELECT 
          u.id,
          u.username,
          u.email,
          COUNT(bc.id) as post_count
        FROM users u
        LEFT JOIN blog_contents bc ON u.id = bc.author_id
        GROUP BY u.id, u.username, u.email
        HAVING COUNT(bc.id) > 0
        ORDER BY post_count DESC
      `);
      
      authorResult.rows.forEach(author => {
        console.log(`   ${author.id}: ${author.username} (${author.email}) - ${author.post_count}개`);
      });
      console.log('');
      
      // 5. 상태별 포스트 수
      console.log('📊 상태별 포스트 수:');
      const statusResult = await client.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM blog_contents
        GROUP BY status
        ORDER BY count DESC
      `);
      
      statusResult.rows.forEach(status => {
        console.log(`   ${status.status || 'NULL'}: ${status.count}개`);
      });
      console.log('');
      
      // 6. 가장 인기 있는 포스트
      console.log('🔥 인기 포스트 TOP 3 (조회수 기준):');
      const popularResult = await client.query(`
        SELECT 
          bc.title,
          bc.slug,
          bc.view_count,
          bc.like_count,
          cat.name as category_name
        FROM blog_contents bc
        LEFT JOIN blog_categories cat ON bc.category_id = cat.id
        WHERE bc.view_count > 0
        ORDER BY bc.view_count DESC
        LIMIT 3
      `);
      
      if (popularResult.rows.length > 0) {
        popularResult.rows.forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title}`);
          console.log(`      카테고리: ${post.category_name} | 조회: ${post.view_count} | 좋아요: ${post.like_count || 0}`);
        });
      } else {
        console.log('   (조회수 데이터가 없습니다)');
      }
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 블로그 콘텐츠 분석 실패:', error.message);
  } finally {
    await dbPool.end();
  }
}

// 스크립트 실행
if (require.main === module) {
  analyzeBlogContent();
}

module.exports = { analyzeBlogContent };
