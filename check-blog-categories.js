#!/usr/bin/env node

// 🔍 블로그 카테고리 확인 및 생성 스크립트

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

async function checkAndCreateCategories() {
  console.log('📂 블로그 카테고리 확인 및 생성 중...\n');
  
  try {
    const client = await dbPool.connect();
    
    try {
      // 1. 기존 카테고리 확인
      console.log('📋 기존 카테고리 목록:');
      const categoriesResult = await client.query(`
        SELECT id, slug, name, description, is_visible, sort_order
        FROM blog_categories 
        ORDER BY sort_order, id
      `);
      
      if (categoriesResult.rows.length > 0) {
        categoriesResult.rows.forEach(cat => {
          console.log(`   ${cat.id}: ${cat.name} (${cat.slug}) - ${cat.is_visible ? '공개' : '비공개'}`);
        });
      } else {
        console.log('   (카테고리가 없습니다)');
      }
      console.log('');
      
      // 2. 기본 카테고리 생성 (없는 경우만)
      const basicCategories = [
        {
          slug: 'general',
          name: '일반',
          description: '일반적인 블로그 포스트',
          is_visible: true,
          sort_order: 1
        },
        {
          slug: 'ai-tech',
          name: 'AI/기술',
          description: 'AI 및 기술 관련 뉴스와 정보',
          is_visible: true,
          sort_order: 2
        },
        {
          slug: 'business',
          name: '비즈니스',
          description: '비즈니스 및 창업 관련 콘텐츠',
          is_visible: true,
          sort_order: 3
        },
        {
          slug: 'tutorial',
          name: '튜토리얼',
          description: '각종 튜토리얼 및 가이드',
          is_visible: true,
          sort_order: 4
        }
      ];
      
      console.log('📝 기본 카테고리 생성 중...');
      
      for (const category of basicCategories) {
        // 이미 존재하는지 확인
        const existingCategory = await client.query(
          'SELECT id FROM blog_categories WHERE slug = $1',
          [category.slug]
        );
        
        if (existingCategory.rows.length === 0) {
          // 새 카테고리 생성
          const result = await client.query(`
            INSERT INTO blog_categories (slug, name, description, is_visible, sort_order, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, name
          `, [
            category.slug,
            category.name,
            category.description,
            category.is_visible,
            category.sort_order
          ]);
          
          console.log(`   ✅ 생성: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
        } else {
          console.log(`   ⏭️ 이미 존재: ${category.name}`);
        }
      }
      
      // 3. 최종 카테고리 목록 출력
      console.log('\n📋 최종 카테고리 목록:');
      const finalCategoriesResult = await client.query(`
        SELECT id, slug, name, description, is_visible, sort_order
        FROM blog_categories 
        ORDER BY sort_order, id
      `);
      
      finalCategoriesResult.rows.forEach(cat => {
        console.log(`   ${cat.id}: ${cat.name} (${cat.slug}) - ${cat.is_visible ? '공개' : '비공개'}`);
      });
      
      // 4. 기본 카테고리 ID 추천
      if (finalCategoriesResult.rows.length > 0) {
        const defaultCategory = finalCategoriesResult.rows[0];
        console.log(`\n💡 추천 기본 카테고리 ID: ${defaultCategory.id} (${defaultCategory.name})`);
      }
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 카테고리 확인/생성 실패:', error.message);
  } finally {
    await dbPool.end();
  }
}

// 스크립트 실행
if (require.main === module) {
  checkAndCreateCategories();
}

module.exports = { checkAndCreateCategories };
