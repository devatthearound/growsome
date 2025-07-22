#!/usr/bin/env node

// 🚀 즉시 블로그 생성 스크립트 (간단 버전)
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🚀 즉시 블로그 생성 시작...\n');

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome 봇',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : []
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

// 메인 실행 함수
async function generateBlogPost() {
  try {
    console.log('1️⃣ TechCrunch RSS 피드 가져오는 중...');
    
    // RSS 피드 가져오기
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Bot/1.0)' }
    });

    if (rssResponse.statusCode !== 200) {
      throw new Error('RSS 피드 가져오기 실패');
    }

    const xml = rssResponse.body;
    console.log('✅ RSS 피드 가져오기 성공');

    console.log('2️⃣ RSS 데이터 파싱 중...');
    
    // RSS 파싱
    const items = [];
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 3)) {
        const titleMatch = item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || item.match(/<title>([^<]+)<\/title>/);
        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || item.match(/<description>([^<]+)<\/description>/);
        
        if (titleMatch && linkMatch) {
          const title = titleMatch[1];
          const description = descMatch ? descMatch[1] : '';
          const keywords = ['AI', 'startup', 'tech', 'innovation', 'business', 'marketing', 'automation'];
          const content = (title + ' ' + description).toLowerCase();
          const relevanceScore = keywords.reduce((score, keyword) => score + (content.includes(keyword.toLowerCase()) ? 1 : 0), 0);
          
          if (relevanceScore >= 2) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 600),
              relevanceScore: relevanceScore
            });
            break; // 첫 번째 관련 기사만 사용
          }
        }
      }
    }

    if (items.length === 0) {
      throw new Error('관련 기사를 찾을 수 없습니다');
    }

    const selectedItem = items[0];
    console.log('✅ RSS 파싱 완료:', selectedItem.title);

    console.log('3️⃣ ChatGPT로 블로그 콘텐츠 생성 중...');
    
    // OpenAI API 호출
    const openaiPayload = {
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "당신은 Growsome의 전문 테크 블로거입니다. 한국 비즈니스 환경에 맞는 실용적인 인사이트를 제공하며, 반드시 JSON 형식으로만 응답합니다."
      }, {
        role: "user",
        content: `다음 기술 뉴스를 한국 독자를 위한 블로그 포스트로 변환해주세요:

제목: ${selectedItem.title}
URL: ${selectedItem.url}
내용: ${selectedItem.description}

요구사항:
1. 50자 내외의 SEO 최적화된 한국어 제목
2. 2000-3000자 마크다운 본문 (## 헤딩, 이모지 활용)
3. 한국 비즈니스 관점에서 해석
4. 실무진을 위한 실용적 조언 포함

응답 형식 (반드시 JSON):
{
  "title": "제목",
  "content": "마크다운 본문",
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
    
    // AI 응답 파싱
    let parsedContent;
    try {
      if (aiContent.includes('{')) {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 대체 방법 사용');
    }

    if (!parsedContent) {
      parsedContent = {
        title: '기술 뉴스: ' + selectedItem.title.substring(0, 40),
        content: aiContent,
        summary: selectedItem.description.substring(0, 150),
        tags: ['기술뉴스', 'AI'],
        category: 'AI'
      };
    }

    // 슬러그 생성
    const slug = parsedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50) + '-' + Date.now().toString().slice(-6);

    const blogPost = {
      title: parsedContent.title,
      content: parsedContent.content,
      slug: slug,
      category_id: 10, // AI 카테고리
      meta_title: parsedContent.title,
      meta_description: parsedContent.summary,
      tags: parsedContent.tags || ['기술'],
      original_url: selectedItem.url,
      is_featured: true,
      status: 'published',
      author_id: 1,
      word_count: parsedContent.content.length
    };

    console.log('✅ 블로그 데이터 처리 완료');

    console.log('5️⃣ JWT 토큰 발급 중...');
    
    // JWT 토큰 발급
    const tokenResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/generate-token',
      method: 'POST',
      protocol: 'http:',
      headers: { 'Content-Type': 'application/json' }
    }, {
      apiKey: 'growsome-n8n-secure-key-2025',
      purpose: 'blog_automation'
    });

    if (tokenResponse.statusCode !== 200) {
      throw new Error('JWT 토큰 발급 실패');
    }

    const token = tokenResponse.body.token;
    console.log('✅ JWT 토큰 발급 완료');

    console.log('6️⃣ 블로그 포스트 발행 중...');
    
    // 블로그 포스트 발행
    const publishResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/blog',
      method: 'POST',
      protocol: 'http:',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, blogPost);

    if (publishResponse.statusCode !== 200) {
      throw new Error(`블로그 발행 실패: ${publishResponse.statusCode}`);
    }

    console.log('✅ 블로그 포스트 발행 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: '즉시 블로그 생성 완료!',
      message: '새로운 블로그 포스트가 성공적으로 생성되었습니다.',
      details: {
        '제목': blogPost.title,
        '글자 수': `${blogPost.word_count.toLocaleString()}자`,
        '링크': `http://localhost:3000/blog/${blogPost.slug}`,
        '원본': selectedItem.url
      }
    });

    console.log('\n🎉 완료! 결과:');
    console.log(`📝 제목: ${blogPost.title}`);
    console.log(`📄 글자 수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`🔗 링크: http://localhost:3000/blog/${blogPost.slug}`);
    console.log(`📰 원본: ${selectedItem.url}`);

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: '즉시 블로그 생성 실패',
      message: `오류가 발생했습니다: ${error.message}`,
      details: {
        '시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        '조치': '로그 확인 필요'
      }
    });
  }
}

// 실행
generateBlogPost();
