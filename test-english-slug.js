#!/usr/bin/env node

// 🚀 영문 슬러그 블로그 생성 (웹 접근 테스트용)
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const { Client } = require('pg');

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome 테스트봇',
    icon_emoji: ':test_tube:',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : [],
      footer: '🧪 영문 슬러그 테스트 | Growsome',
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  try {
    const url = new URL(webhookUrl);
    
    return new Promise((resolve) => {
      const req = https.request({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(payload))
        }
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.write(JSON.stringify(payload));
      req.end();
    });
  } catch (error) {
    return false;
  }
};

// 데이터베이스 클라이언트
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

// 영문 슬러그 생성 함수
const createEnglishSlug = (title) => {
  const englishWords = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .slice(0, 6) // 최대 6개 단어
    .join('-');
    
  const timestamp = Date.now().toString().slice(-6);
  return `${englishWords}-${timestamp}`;
};

async function createTestBlogPost() {
  let dbClient = null;
  
  try {
    console.log('🧪 영문 슬러그 테스트 포스트 생성 중...\n');

    // 테스트 포스트 데이터
    const testPost = {
      title: 'AI Startup Email Agents - Testing English Slug',
      content: `# AI Startup Revolutionizes Email Agent Technology

## 🚀 Introduction

This startup is pioneering a new approach to AI agents through email integration. Their innovative platform allows users to interact with AI agents directly through familiar communication channels.

## 💡 Key Features

### Email Integration
- Direct AI agent communication via email
- No additional apps or interfaces required
- Seamless workflow integration

### Advanced AI Capabilities  
- Natural language processing
- Context-aware responses
- Multi-task handling

## 🎯 Business Impact

The platform addresses the key challenge of AI agent usability by leveraging existing communication infrastructure. This approach significantly reduces user friction and adoption barriers.

## 📈 Market Potential

With the growing demand for AI automation tools, this email-centric approach positions the startup uniquely in the competitive landscape.

---

*This post demonstrates successful English slug implementation for better web accessibility.*`,
      slug: createEnglishSlug('AI Startup Email Agents Testing English Slug'),
      category_id: 10,
      meta_title: 'AI Startup Email Agents - Testing English Slug',
      meta_description: 'Testing blog post creation with English slug for improved web accessibility and SEO optimization.',
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`📝 테스트 포스트 정보:`);
    console.log(`   제목: ${testPost.title}`);
    console.log(`   슬러그: ${testPost.slug}`);
    console.log(`   카테고리: AI 기술 (ID: 10)`);
    console.log(`   글자 수: ${testPost.content.length}자`);

    // 데이터베이스 연결
    console.log('\n🔌 데이터베이스 연결 중...');
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // 블로그 포스트 저장
    console.log('💾 테스트 포스트 저장 중...');
    const insertQuery = `
      INSERT INTO blog_contents (
        title, content_body, slug, category_id, meta_title, meta_description,
        author_id, status, is_featured, view_count, like_count, comment_count, 
        created_at, updated_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, slug;
    `;

    const result = await dbClient.query(insertQuery, [
      testPost.title,
      testPost.content,
      testPost.slug,
      testPost.category_id,
      testPost.meta_title,
      testPost.meta_description,
      testPost.author_id,
      testPost.status,
      testPost.is_featured,
      0, // view_count
      0, // like_count  
      0, // comment_count
      testPost.created_at,
      testPost.updated_at,
      new Date().toISOString() // published_at
    ]);

    const savedPost = result.rows[0];
    console.log('✅ 테스트 포스트 저장 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: '🧪 영문 슬러그 테스트 포스트 생성 완료!',
      message: '영문 슬러그로 테스트 포스트가 성공적으로 생성되었습니다.',
      details: {
        '제목': testPost.title,
        '슬러그': testPost.slug,
        '글자 수': `${testPost.content.length.toLocaleString()}자`,
        '카테고리': 'AI 기술',
        '저장 ID': savedPost.id,
        'ID 링크': `https://growsome.kr/blog/${savedPost.id}`,
        '슬러그 링크': `https://growsome.kr/blog/${savedPost.slug}`,
        '블로그 홈': 'https://growsome.kr/blog'
      }
    });

    console.log('\n🎉 완료! 테스트 결과:');
    console.log(`🆔 저장된 ID: ${savedPost.id}`);
    console.log(`📝 제목: ${testPost.title}`);
    console.log(`🔗 영문 슬러그: ${testPost.slug}`);
    console.log(`📄 글자 수: ${testPost.content.length.toLocaleString()}자`);
    
    console.log('\n🌐 접근 테스트 URL들:');
    console.log(`   ID로 접근: https://growsome.kr/blog/${savedPost.id}`);
    console.log(`   슬러그로 접근: https://growsome.kr/blog/${savedPost.slug}`);
    console.log(`   블로그 홈: https://growsome.kr/blog`);
    
    console.log('\n🔧 다음 단계:');
    console.log('   1. 위 URL들을 브라우저에서 테스트');
    console.log('   2. 브라우저 캐시 클리어 후 재시도');
    console.log('   3. 개발자 도구에서 네트워크 오류 확인');

    return { success: true, savedPost, testPost };

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: '🧪 영문 슬러그 테스트 실패',
      message: `테스트 포스트 생성 중 오류가 발생했습니다: ${error.message}`,
      details: {
        '시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      }
    });

    return { success: false, error: error.message };
    
  } finally {
    if (dbClient) {
      await dbClient.end();
      console.log('🔌 데이터베이스 연결 종료');
    }
  }
}

// 실행
if (require.main === module) {
  createTestBlogPost()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { createTestBlogPost };
