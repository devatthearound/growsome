#!/usr/bin/env node

// 🚀 하이브리드 블로그 자동화 (로컬 API + 라이브 데이터베이스)
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🔄 하이브리드 모드: 로컬 API + 라이브 데이터베이스');
console.log('🌐 최종 발행: https://growsome.kr (데이터베이스 직접 연결)\n');

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome 하이브리드 봇',
    icon_emoji: ':hybrid:',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : [],
      footer: '🔄 하이브리드 모드 | Growsome 자동화',
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  try {
    const url = new URL(webhookUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    return new Promise((resolve) => {
      const req = protocol.request({
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

// HTTP 요청 함수
const makeRequest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.headers['content-type']?.includes('json')) {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } else {
            resolve({ statusCode: res.statusCode, body: data });
          }
        } catch (error) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
};

// 데이터베이스 직접 연결
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

// 메인 실행 함수
async function generateBlogPost() {
  let dbClient = null;
  
  try {
    console.log('1️⃣ TechCrunch RSS 피드 가져오는 중...');
    
    // RSS 피드 가져오기
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (rssResponse.statusCode !== 200) {
      throw new Error(`RSS 피드 가져오기 실패: ${rssResponse.statusCode}`);
    }

    const xml = rssResponse.body;
    console.log('✅ RSS 피드 가져오기 성공');

    console.log('2️⃣ RSS 데이터 파싱 중...');
    
    // RSS 파싱
    const items = [];
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 5)) {
        const titleMatch = item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || item.match(/<title>([^<]+)<\/title>/);
        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || item.match(/<description>([^<]+)<\/description>/);
        
        if (titleMatch && linkMatch) {
          const title = titleMatch[1];
          const description = descMatch ? descMatch[1] : '';
          
          const keywords = [
            'AI', 'artificial intelligence', 'machine learning', 'automation',
            'startup', 'tech', 'innovation', 'business', 'marketing', 'growth',
            'data', 'analytics', 'digital', 'platform', 'SaaS', 'cloud',
            'investment', 'funding', 'venture', 'strategy', 'future',
            'Amazon', 'Google', 'Microsoft', 'Apple', 'Tesla', 'Meta'
          ];
          
          const content = (title + ' ' + description).toLowerCase();
          const relevanceScore = keywords.reduce((score, keyword) => {
            const count = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
            return score + count;
          }, 0);
          
          if (relevanceScore >= 2) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 800),
              relevanceScore: relevanceScore
            });
          }
        }
      }
    }

    if (items.length === 0) {
      throw new Error('관련 기사를 찾을 수 없습니다');
    }

    items.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedItem = items[0];
    
    console.log(`✅ RSS 파싱 완료: ${selectedItem.title} (관련도: ${selectedItem.relevanceScore})`);

    console.log('3️⃣ ChatGPT로 블로그 콘텐츠 생성 중...');
    
    // OpenAI API 호출
    const openaiPayload = {
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "당신은 Growsome의 전문 테크 블로거입니다. 반드시 유효한 JSON 형식으로만 응답하세요."
      }, {
        role: "user",
        content: `다음 기술 뉴스를 한국 독자를 위한 블로그로 변환해주세요:

제목: ${selectedItem.title}
URL: ${selectedItem.url}
내용: ${selectedItem.description}

응답 형식 (반드시 JSON):
{
  "title": "50자 내외 한국어 제목",
  "content": "2500-4000자 마크다운 본문",
  "summary": "150자 요약",
  "tags": ["태그1", "태그2", "태그3"],
  "category": "AI"
}`
      }],
      max_tokens: 4000,
      temperature: 0.7
    };

    const openaiResponse = await makeRequest({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      protocol: 'https:',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, openaiPayload);

    if (openaiResponse.statusCode !== 200) {
      throw new Error(`OpenAI API 오류: ${openaiResponse.statusCode}`);
    }

    const aiContent = openaiResponse.body.choices[0].message.content;
    console.log('✅ AI 콘텐츠 생성 완료');

    console.log('4️⃣ 블로그 데이터 처리 중...');
    
    let parsedContent;
    try {
      const jsonMatch = aiContent.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiContent.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }
    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 대체 방법 사용');
      parsedContent = {
        title: selectedItem.title.length > 50 ? 
               selectedItem.title.substring(0, 47) + '...' : 
               selectedItem.title,
        content: aiContent.replace(/```json[\s\S]*?```/g, '').trim(),
        summary: selectedItem.description.substring(0, 150) + '...',
        tags: ['기술뉴스', 'AI', '혁신'],
        category: 'AI'
      };
    }

    // SEO 친화적 영문 슬러그 생성
    const createSeoSlug = (title, originalTitle) => {
      // 원본 영문 제목에서 키워드 추출
      const titleWords = originalTitle.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2)
        .slice(0, 5);
      
      // 기본 영문 슬러그 생성
      let baseSlug;
      if (titleWords.length >= 3) {
        baseSlug = titleWords.join('-');
      } else {
        // 한글 제목에서 영문 키워드 매핑
        baseSlug = title
          .replace(/스타트업/g, 'startup')
          .replace(/이메일/g, 'email')
          .replace(/AI|인공지능/g, 'ai')
          .replace(/에이전트/g, 'agent')
          .replace(/핵심/g, 'key')
          .replace(/기술/g, 'tech')
          .replace(/마케팅/g, 'marketing')
          .replace(/비즈니스/g, 'business')
          .replace(/데이터/g, 'data')
          .replace(/분석/g, 'analytics')
          .replace(/[^a-z0-9\s-]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 0)
          .slice(0, 4)
          .join('-');
      }
      
      const timestamp = Date.now().toString().slice(-6);
      return `${baseSlug}-${timestamp}`.replace(/^-|-$/g, '');
    };
    
    const slug = createSeoSlug(parsedContent.title, selectedItem.title);

    const blogPost = {
      title: parsedContent.title,
      content: parsedContent.content, // content_body 에 매핑
      slug: slug,
      category_id: 10, // AI 카테고리
      meta_title: parsedContent.title,
      meta_description: parsedContent.summary,
      author_id: 6, // master@growsome.kr
      status: 'PUBLISHED', // Prisma 스키마에 맞게 대문자
      is_featured: true,
      word_count: parsedContent.content.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ 블로그 데이터 처리 완료 (${blogPost.word_count.toLocaleString()}자)`);

    console.log('5️⃣ 데이터베이스 직접 연결 중...');
    
    // 데이터베이스 연결
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    console.log('6️⃣ 블로그 포스트 직접 저장 중...');
    
    // 직접 SQL로 블로그 포스트 저장
    const insertQuery = `
      INSERT INTO blog_contents (
        title, content_body, slug, category_id, meta_title, meta_description,
        author_id, status, is_featured, view_count, like_count, comment_count, 
        created_at, updated_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, slug;
    `;

    const result = await dbClient.query(insertQuery, [
      blogPost.title,
      blogPost.content, 
      blogPost.slug,
      blogPost.category_id,
      blogPost.meta_title,
      blogPost.meta_description,
      blogPost.author_id,
      blogPost.status,
      blogPost.is_featured,
      0, // view_count
      0, // like_count  
      0, // comment_count
      blogPost.created_at,
      blogPost.updated_at,
      new Date().toISOString() // published_at
    ]);

    const savedPost = result.rows[0];
    console.log('✅ 블로그 포스트 직접 저장 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: '🔄 하이브리드 블로그 자동 생성 완료!',
      message: '로컬 API + 라이브 DB로 블로그 포스트가 성공적으로 생성되었습니다.',
      details: {
        '제목': blogPost.title,
        '글자 수': `${blogPost.word_count.toLocaleString()}자`,
        '카테고리': parsedContent.category,
        '관련도': `${selectedItem.relevanceScore}점`,
        '라이브 링크': `https://growsome.kr/blog/${savedPost.slug}`,
        '원본': selectedItem.url,
        '저장 ID': savedPost.id
      }
    });

    console.log('\n🎉 완료! 결과:');
    console.log(`🔄 모드: 하이브리드 (로컬 API + 라이브 DB)`);
    console.log(`📝 제목: ${blogPost.title}`);
    console.log(`📄 글자 수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`📂 카테고리: AI (ID: 10)`);
    console.log(`⭐ 특집: 예`);
    console.log(`📊 관련성: ${selectedItem.relevanceScore}점`);
    console.log(`🆔 저장된 ID: ${savedPost.id}`);
    console.log(`🔗 라이브 링크: https://growsome.kr/blog/${savedPost.slug}`);
    console.log(`📰 원본: ${selectedItem.url}`);

    return { success: true, blogPost, savedPost, selectedItem };

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: '🔄 하이브리드 블로그 자동화 오류',
      message: `하이브리드 모드에서 오류가 발생했습니다.`,
      details: {
        '오류': error.message,
        '시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        '조치': '로그 확인 및 재시도 필요'
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
  generateBlogPost()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateBlogPost };
