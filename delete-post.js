#!/usr/bin/env node

// 🗑️ 특정 포스트 삭제 스크립트 (ID 33)
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

async function deleteSpecificPost(postId = 33) {
  let dbClient = null;
  
  try {
    console.log(`🗑️ ID ${postId} 포스트 삭제 시작...\n`);
    
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // 1. 삭제할 포스트 정보 확인
    console.log(`\n1️⃣ ID ${postId} 포스트 정보 확인:`);
    const postQuery = `
      SELECT id, title, slug, created_at, status
      FROM blog_contents 
      WHERE id = $1
    `;

    const postResult = await dbClient.query(postQuery, [postId]);

    if (postResult.rows.length === 0) {
      console.log(`❌ ID ${postId} 포스트를 찾을 수 없습니다!`);
      return;
    }

    const post = postResult.rows[0];
    console.log('📋 삭제 대상 포스트:');
    console.log(`   ID: ${post.id}`);
    console.log(`   제목: ${post.title}`);
    console.log(`   슬러그: ${post.slug}`);
    console.log(`   상태: ${post.status}`);
    console.log(`   생성일: ${new Date(post.created_at).toLocaleString('ko-KR')}`);
    console.log(`   URL: https://growsome.kr/blog/${post.slug}`);

    // 2. 관련 데이터 삭제 (외래키 제약조건)
    console.log('\n2️⃣ 관련 데이터 삭제 중...');
    
    // 댓글 삭제
    const deleteCommentsQuery = `
      DELETE FROM blog_comments WHERE content_id = $1
    `;
    const commentsResult = await dbClient.query(deleteCommentsQuery, [postId]);
    console.log(`   ✅ 댓글 ${commentsResult.rowCount}개 삭제`);

    // 좋아요 삭제
    const deleteLikesQuery = `
      DELETE FROM blog_likes WHERE content_id = $1
    `;
    const likesResult = await dbClient.query(deleteLikesQuery, [postId]);
    console.log(`   ✅ 좋아요 ${likesResult.rowCount}개 삭제`);

    // 태그 연결 삭제
    const deleteTagsQuery = `
      DELETE FROM blog_content_tags WHERE content_id = $1
    `;
    const tagsResult = await dbClient.query(deleteTagsQuery, [postId]);
    console.log(`   ✅ 태그 연결 ${tagsResult.rowCount}개 삭제`);

    // 3. 메인 포스트 삭제
    console.log('\n3️⃣ 포스트 삭제 중...');
    const deletePostQuery = `
      DELETE FROM blog_contents WHERE id = $1
      RETURNING id, title, slug
    `;
    
    const deletedPost = await dbClient.query(deletePostQuery, [postId]);
    
    if (deletedPost.rowCount > 0) {
      const deleted = deletedPost.rows[0];
      console.log(`✅ 포스트 삭제 완료:`);
      console.log(`   ID: ${deleted.id}`);
      console.log(`   제목: ${deleted.title}`);
      console.log(`   슬러그: ${deleted.slug}`);
    } else {
      console.log(`❌ 포스트 삭제 실패`);
    }

    // 4. 최근 포스트 확인
    console.log('\n4️⃣ 삭제 후 최근 포스트 확인:');
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
      console.log('❌ 남은 포스트가 없습니다!');
    }

    console.log(`\n🎉 ID ${postId} 포스트 삭제 완료!`);
    console.log('💡 이제 https://growsome.kr/blog 에서 해당 포스트가 사라집니다.');

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
  const postId = process.argv[2] ? parseInt(process.argv[2]) : 33;
  
  deleteSpecificPost(postId)
    .then(() => {
      console.log('\n✅ 삭제 작업 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { deleteSpecificPost };
