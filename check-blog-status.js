#!/usr/bin/env node

// 🔍 블로그 포스트 상태 확인 스크립트
require('dotenv').config({ path: '.env.local' });

const { Client } = require('pg');

const createDatabaseClient = () => {
  return new Client({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.POSTGRES_HOST || '43.200.174.22',
    database: process.env.POSTGRES_DATABASE || 'growsome',
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    ssl: false
  });
};

async function checkBlogPost() {
  let dbClient = null;
  
  try {
    console.log('🔍 블로그 포스트 상태 확인 중...\n');
    
    dbClient = createDatabaseClient();
    await dbClient.connect();
    
    // 1. 방금 생성된 포스트 확인
    console.log('1️⃣ 최근 생성된 블로그 포스트 확인:');
    const recentPost = await dbClient.query(`
      SELECT id, title, slug, status, is_featured, category_id, author_id, 
             created_at, published_at, view_count
      FROM blog_contents 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    if (recentPost.rows.length === 0) {
      console.log('❌ 블로그 포스트가 없습니다!');
      return;
    }

    console.log('📋 최근 포스트들:');
    recentPost.rows.forEach((post, index) => {
      console.log(`   ${index + 1}. ID: ${post.id}`);
      console.log(`      제목: ${post.title}`);
      console.log(`      슬러그: ${post.slug}`);
      console.log(`      상태: ${post.status}`);
      console.log(`      특집: ${post.is_featured}`);
      console.log(`      카테고리: ${post.category_id}`);
      console.log(`      작성자: ${post.author_id}`);
      console.log(`      생성일: ${post.created_at}`);
      console.log(`      발행일: ${post.published_at}`);
      console.log(`      조회수: ${post.view_count}`);
      console.log('   ───────────────────────────────');
    });

    // 2. 카테고리 확인
    console.log('\n2️⃣ 블로그 카테고리 확인:');
    const categories = await dbClient.query(`
      SELECT id, name, slug, is_visible 
      FROM blog_categories 
      ORDER BY id
    `);

    console.log('📂 카테고리 목록:');
    categories.rows.forEach(cat => {
      console.log(`   ID: ${cat.id}, 이름: ${cat.name}, 슬러그: ${cat.slug}, 표시: ${cat.is_visible}`);
    });

    // 3. 특정 포스트 상세 확인 (ID 33)
    console.log('\n3️⃣ ID 33 포스트 상세 확인:');
    const specificPost = await dbClient.query(`
      SELECT bc.*, bc_cat.name as category_name, u.username as author_name
      FROM blog_contents bc
      LEFT JOIN blog_categories bc_cat ON bc.category_id = bc_cat.id
      LEFT JOIN users u ON bc.author_id = u.id
      WHERE bc.id = 33
    `);

    if (specificPost.rows.length > 0) {
      const post = specificPost.rows[0];
      console.log('📄 포스트 상세 정보:');
      console.log(`   ID: ${post.id}`);
      console.log(`   제목: ${post.title}`);
      console.log(`   슬러그: ${post.slug}`);
      console.log(`   상태: ${post.status}`);
      console.log(`   카테고리: ${post.category_name} (ID: ${post.category_id})`);
      console.log(`   작성자: ${post.author_name} (ID: ${post.author_id})`);
      console.log(`   특집: ${post.is_featured}`);
      console.log(`   히어로: ${post.is_hero}`);
      console.log(`   생성일: ${post.created_at}`);
      console.log(`   수정일: ${post.updated_at}`);
      console.log(`   발행일: ${post.published_at}`);
      console.log(`   메타 제목: ${post.meta_title}`);
      console.log(`   메타 설명: ${post.meta_description}`);
      console.log(`   썸네일: ${post.thumbnail_url || '없음'}`);
      console.log(`   내용 길이: ${post.content_body?.length || 0}자`);
    } else {
      console.log('❌ ID 33 포스트를 찾을 수 없습니다!');
    }

    // 4. 블로그 라우팅 확인을 위한 URL 테스트
    console.log('\n4️⃣ 접근 가능한 URL들:');
    const testPost = recentPost.rows[0];
    console.log(`   직접 ID: https://growsome.kr/blog/${testPost.id}`);
    console.log(`   슬러그: https://growsome.kr/blog/${testPost.slug}`);
    console.log(`   전체 목록: https://growsome.kr/blog`);

    // 5. 가능한 문제점들 체크
    console.log('\n5️⃣ 잠재적 문제점 체크:');
    
    const issues = [];
    
    // 상태 체크
    if (testPost.status !== 'PUBLISHED') {
      issues.push(`❌ 상태가 PUBLISHED가 아님: ${testPost.status}`);
    } else {
      console.log('✅ 상태: PUBLISHED');
    }

    // 발행일 체크
    if (!testPost.published_at) {
      issues.push('❌ published_at이 null임');
    } else {
      console.log('✅ 발행일 설정됨');
    }

    // 카테고리 존재 체크
    const categoryExists = categories.rows.find(c => c.id === testPost.category_id);
    if (!categoryExists) {
      issues.push(`❌ 카테고리 ID ${testPost.category_id}가 존재하지 않음`);
    } else if (!categoryExists.is_visible) {
      issues.push(`❌ 카테고리 '${categoryExists.name}'이 비표시 상태`);
    } else {
      console.log(`✅ 카테고리: ${categoryExists.name}`);
    }

    if (issues.length === 0) {
      console.log('\n🎉 데이터베이스 상태는 정상입니다!');
      console.log('\n🔧 가능한 해결방법들:');
      console.log('   1. Next.js 캐시 문제 - 페이지 새로고침');
      console.log('   2. 라우팅 문제 - 다른 URL로 접근 시도');
      console.log('   3. 빌드 문제 - 새로운 배포 필요');
      console.log('   4. 블로그 목록 API 확인 필요');
    } else {
      console.log('\n❌ 발견된 문제점들:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

checkBlogPost();
