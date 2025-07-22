#!/usr/bin/env node

// 🗑️ 한글 슬러그 포스트 정리 스크립트
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

async function cleanupKoreanSlugPosts() {
  let dbClient = null;
  
  try {
    console.log('🗑️ 한글 슬러그 포스트 정리 시작...\n');
    
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // 1. 한글 슬러그 포스트 조회
    console.log('\n1️⃣ 한글 슬러그 포스트 찾는 중...');
    const koreanSlugQuery = `
      SELECT id, title, slug, created_at 
      FROM blog_contents 
      WHERE slug ~ '[가-힣]'
      ORDER BY created_at DESC
    `;

    const koreanPosts = await dbClient.query(koreanSlugQuery);

    if (koreanPosts.rows.length === 0) {
      console.log('✅ 한글 슬러그 포스트가 없습니다!');
      return;
    }

    console.log(`📋 발견된 한글 슬러그 포스트 (${koreanPosts.rows.length}개):`);
    koreanPosts.rows.forEach((post, index) => {
      console.log(`   ${index + 1}. ID: ${post.id}`);
      console.log(`      제목: ${post.title}`);
      console.log(`      슬러그: ${post.slug}`);
      console.log(`      생성일: ${new Date(post.created_at).toLocaleString('ko-KR')}`);
      console.log('   ───────────────────────────────');
    });

    // 2. 영문 슬러그 포스트도 확인
    console.log('\n2️⃣ 영문 슬러그 포스트 확인...');
    const englishSlugQuery = `
      SELECT id, title, slug, created_at 
      FROM blog_contents 
      WHERE slug !~ '[가-힣]' AND slug ~ '^[a-z0-9-]+$'
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const englishPosts = await dbClient.query(englishSlugQuery);
    
    if (englishPosts.rows.length > 0) {
      console.log(`📋 최근 영문 슬러그 포스트 (${englishPosts.rows.length}개):`);
      englishPosts.rows.forEach((post, index) => {
        console.log(`   ${index + 1}. ID: ${post.id}`);
        console.log(`      제목: ${post.title}`);
        console.log(`      슬러그: ${post.slug}`);
        console.log(`      생성일: ${new Date(post.created_at).toLocaleString('ko-KR')}`);
        console.log('   ───────────────────────────────');
      });
    }

    // 3. 한글 슬러그 포스트 삭제 확인
    console.log('\n3️⃣ 삭제 작업 시작...');
    
    if (koreanPosts.rows.length > 0) {
      // 관련 데이터부터 삭제 (외래키 제약조건 때문)
      console.log('   📝 관련 댓글 삭제 중...');
      const deleteCommentsQuery = `
        DELETE FROM blog_comments 
        WHERE content_id IN (
          SELECT id FROM blog_contents WHERE slug ~ '[가-힣]'
        )
      `;
      const commentsResult = await dbClient.query(deleteCommentsQuery);
      console.log(`   ✅ 댓글 ${commentsResult.rowCount}개 삭제`);

      console.log('   👍 좋아요 삭제 중...');
      const deleteLikesQuery = `
        DELETE FROM blog_likes 
        WHERE content_id IN (
          SELECT id FROM blog_contents WHERE slug ~ '[가-힣]'
        )
      `;
      const likesResult = await dbClient.query(deleteLikesQuery);
      console.log(`   ✅ 좋아요 ${likesResult.rowCount}개 삭제`);

      console.log('   🏷️ 태그 연결 삭제 중...');
      const deleteTagsQuery = `
        DELETE FROM blog_content_tags 
        WHERE content_id IN (
          SELECT id FROM blog_contents WHERE slug ~ '[가-힣]'
        )
      `;
      const tagsResult = await dbClient.query(deleteTagsQuery);
      console.log(`   ✅ 태그 연결 ${tagsResult.rowCount}개 삭제`);

      // 메인 포스트 삭제
      console.log('   📰 한글 슬러그 포스트 삭제 중...');
      const deletePostsQuery = `
        DELETE FROM blog_contents 
        WHERE slug ~ '[가-힣]'
        RETURNING id, title, slug
      `;
      const deletedPosts = await dbClient.query(deletePostsQuery);
      
      console.log(`\n✅ 한글 슬러그 포스트 ${deletedPosts.rowCount}개 삭제 완료:`);
      deletedPosts.rows.forEach((post, index) => {
        console.log(`   ${index + 1}. ID: ${post.id} - ${post.title}`);
      });
    }

    // 4. 최종 상태 확인
    console.log('\n4️⃣ 정리 후 상태 확인...');
    const finalCountQuery = `
      SELECT 
        COUNT(*) as total_posts,
        COUNT(CASE WHEN slug ~ '[가-힣]' THEN 1 END) as korean_slug_posts,
        COUNT(CASE WHEN slug !~ '[가-힣]' THEN 1 END) as english_slug_posts
      FROM blog_contents
    `;
    
    const finalCount = await dbClient.query(finalCountQuery);
    const stats = finalCount.rows[0];
    
    console.log('📊 최종 통계:');
    console.log(`   전체 포스트: ${stats.total_posts}개`);
    console.log(`   한글 슬러그: ${stats.korean_slug_posts}개`);
    console.log(`   영문 슬러그: ${stats.english_slug_posts}개`);

    // 5. 최근 포스트 5개 확인
    console.log('\n5️⃣ 최근 포스트 확인:');
    const recentPostsQuery = `
      SELECT id, title, slug, created_at
      FROM blog_contents
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const recentPosts = await dbClient.query(recentPostsQuery);
    
    if (recentPosts.rows.length > 0) {
      console.log('📋 남아있는 최근 포스트들:');
      recentPosts.rows.forEach((post, index) => {
        console.log(`   ${index + 1}. ID: ${post.id}`);
        console.log(`      제목: ${post.title}`);
        console.log(`      슬러그: ${post.slug}`);
        console.log(`      URL: https://growsome.kr/blog/${post.slug}`);
        console.log('   ───────────────────────────────');
      });
    } else {
      console.log('❌ 포스트가 없습니다!');
    }

    console.log('\n🎉 한글 슬러그 포스트 정리 완료!');
    console.log('💡 이제 https://growsome.kr/blog 에서 깔끔한 영문 슬러그 포스트들만 보실 수 있습니다.');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
      console.log('🔌 데이터베이스 연결 종료');
    }
  }
}

// 실행
if (require.main === module) {
  cleanupKoreanSlugPosts()
    .then(() => {
      console.log('\n✅ 정리 작업 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { cleanupKoreanSlugPosts };
