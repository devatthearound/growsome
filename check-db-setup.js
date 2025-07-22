#!/usr/bin/env node

// 🔍 데이터베이스 사용자 확인 및 블로그 생성 스크립트
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

async function checkUsersAndCreateBlog() {
  let dbClient = null;
  
  try {
    console.log('🔍 데이터베이스 연결 및 사용자 확인 중...');
    
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // 1. 사용자 목록 확인
    console.log('\n👥 사용자 목록 확인:');
    const usersResult = await dbClient.query('SELECT id, email, username, role FROM users ORDER BY id LIMIT 10');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ 사용자가 존재하지 않습니다!');
      
      // 기본 사용자 생성
      console.log('👤 기본 사용자 생성 중...');
      const createUserResult = await dbClient.query(`
        INSERT INTO users (
          email, username, phone_number, company_name, position, role, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, username;
      `, [
        'master@growsome.kr',
        'Growsome Admin',
        '010-0000-0000',
        'Growsome',
        'AI Blogger',
        'admin',
        'active'
      ]);
      
      const newUser = createUserResult.rows[0];
      console.log(`✅ 기본 사용자 생성됨: ID ${newUser.id}, ${newUser.email}`);
      
    } else {
      console.log('📋 기존 사용자들:');
      usersResult.rows.forEach(user => {
        console.log(`   ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

    // 2. 블로그 카테고리 확인
    console.log('\n📂 블로그 카테고리 확인:');
    const categoriesResult = await dbClient.query('SELECT id, name, slug FROM blog_categories ORDER BY id LIMIT 10');
    
    if (categoriesResult.rows.length === 0) {
      console.log('❌ 블로그 카테고리가 존재하지 않습니다!');
      
      // 기본 카테고리 생성
      console.log('📁 기본 카테고리들 생성 중...');
      const categories = [
        { name: 'AI', slug: 'ai', description: 'AI 및 머신러닝 관련 글' },
        { name: '마케팅', slug: 'marketing', description: '디지털 마케팅 전략' },
        { name: '스타트업', slug: 'startup', description: '스타트업 성장 이야기' },
        { name: '데이터', slug: 'data', description: '데이터 분석 및 활용' },
        { name: '성장', slug: 'growth', description: '비즈니스 성장 전략' }
      ];

      for (const category of categories) {
        await dbClient.query(`
          INSERT INTO blog_categories (name, slug, description, is_visible, sort_order)
          VALUES ($1, $2, $3, true, $4)
        `, [category.name, category.slug, category.description, categories.indexOf(category)]);
      }
      
      console.log('✅ 기본 카테고리들 생성 완료');
      
    } else {
      console.log('📋 기존 카테고리들:');
      categoriesResult.rows.forEach(category => {
        console.log(`   ID: ${category.id}, Name: ${category.name}, Slug: ${category.slug}`);
      });
    }

    // 3. 최신 데이터 다시 조회
    const finalUsersResult = await dbClient.query('SELECT id, email, username, role FROM users ORDER BY id LIMIT 5');
    const finalCategoriesResult = await dbClient.query('SELECT id, name, slug FROM blog_categories ORDER BY id LIMIT 5');
    
    const validAuthorId = finalUsersResult.rows[0]?.id;
    const validCategoryId = finalCategoriesResult.rows[0]?.id;

    if (!validAuthorId || !validCategoryId) {
      throw new Error('사용자 또는 카테고리 설정 실패');
    }

    console.log(`\n🎯 사용할 Author ID: ${validAuthorId}`);
    console.log(`🎯 사용할 Category ID: ${validCategoryId}`);

    return { validAuthorId, validCategoryId };

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
  checkUsersAndCreateBlog()
    .then(result => {
      console.log('\n✅ 준비 완료! 이제 하이브리드 블로그 스크립트를 실행할 수 있습니다.');
      console.log(`📝 Author ID: ${result.validAuthorId}, Category ID: ${result.validCategoryId}`);
      console.log('\n다음 단계:');
      console.log('node hybrid-blog-fixed.js');
      process.exit(0);
    })
    .catch(error => {
      console.error('실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { checkUsersAndCreateBlog };
