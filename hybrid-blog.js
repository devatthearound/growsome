#!/usr/bin/env node

// 🚀 개선된 그로우썸 블로그 자동화 시스템
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🔄 그로우썸 전문 블로그 자동화 시스템');
console.log('📚 구조화된 콘텐츠 + 신뢰도 높은 글쓰기\n');

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome 전문 블로거',
    icon_emoji: ':writing_hand:',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : [],
      footer: '📝 Growsome 전문 블로거 | 자동화',
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

// 그로우썸 서비스 연결 포인트 생성
const generateGrowsomeConnection = (category, content) => {
  const serviceConnections = {
    'AI': {
      service: '스마트 어필리에이트',
      connection: 'AI 기반 개인화 추천으로 더 높은 수익을 만들어보세요',
      cta: 'AI 추천 시스템으로 수익 늘리기',
      link: '/affiliate-smart'
    },
    '마케팅': {
      service: '성장 분석 도구',
      connection: '데이터 기반 마케팅으로 비즈니스를 성장시키세요',
      cta: '성장 분석으로 마케팅 최적화하기',
      link: '/growth-analytics'
    },
    '이커머스': {
      service: '쇼핑몰 최적화',
      connection: '전환율 높은 쇼핑몰로 매출을 극대화하세요',
      cta: '쇼핑몰 전환율 향상시키기',
      link: '/ecommerce-optimize'
    },
    '스타트업': {
      service: '비즈니스 성장 컨설팅',
      connection: '검증된 성장 전략으로 스타트업을 확장하세요',
      cta: '성장 전략 컨설팅 받기',
      link: '/growth-consulting'
    }
  };

  const defaultConnection = {
    service: '성장 솔루션',
    connection: '그로우썸과 함께 비즈니스를 한 단계 높여보세요',
    cta: '그로우썸 솔루션 알아보기',
    link: '/solutions'
  };

  return serviceConnections[category] || defaultConnection;
};

// 개선된 AI 프롬프트 생성
const createEnhancedPrompt = (selectedItem, category) => {
  return `당신은 Growsome의 수석 테크 블로거로서, 비즈니스 성장과 기술 트렌드를 전문적으로 다루는 글을 씁니다. 반드시 유효한 JSON 형식으로만 응답하세요.

**원본 기사 정보:**
- 제목: ${selectedItem.title}
- URL: ${selectedItem.url}
- 내용: ${selectedItem.description}
- 카테고리: ${category}

**그로우썸 관점과 서비스 연결:**
- 이 뉴스가 한국 비즈니스에 미치는 영향
- 그로우썸의 경험과 인사이트 추가
- 실무진들이 활용할 수 있는 실용적 팁
- 그로우썸 서비스와의 자연스러운 연결

**글 구조 요구사항:**
1. 흥미로운 도입부 (문제 제기 또는 트렌드 소개) - # 제목으로 시작
2. 핵심 내용 분석 (3-4개 섹션으로 구분) - ## 소제목 활용
3. 그로우썸의 관점과 경험 - ## 그로우썸이 보는 관점
4. 실무 활용 방안 - ## 실무 적용 가이드
5. 결론 및 앞으로의 전망 - ## 결론: 앞으로의 전망
6. 그로우썸 서비스 연결은 별도 처리

응답 형식 (반드시 JSON):
{
  "title": "SEO 최적화된 50자 내외 제목",
  "content": "구조화된 4000-6000자 마크다운 본문 (# ## ### 활용, 목록과 강조 포함)",
  "summary": "핵심 인사이트를 담은 150자 요약",
  "tags": ["관련태그1", "관련태그2", "관련태그3", "관련태그4"],
  "category": "${category}",
  "readingTime": "예상 읽기 시간(분)",
  "keyInsights": ["핵심 인사이트 3가지"],
  "sourceUrl": "${selectedItem.url}",
  "sourceTitle": "${selectedItem.title}",
  "growsomeConnection": "그로우썸 서비스와의 연결 포인트"
}`;
};

// 개선된 콘텐츠 후처리
const enhanceContent = (parsedContent, selectedItem, growsomeConnection) => {
  let enhancedContent = parsedContent.content;
  
  // 출처 정보 추가
  const sourceInfo = `
## 📰 이 글의 배경

이 인사이트는 [${parsedContent.sourceTitle}](${parsedContent.sourceUrl})에서 다룬 내용을 바탕으로, 그로우썸의 관점에서 한국 비즈니스 환경에 맞게 분석한 것입니다.

---
`;

  // 그로우썸 서비스 연결 섹션 추가
  const serviceConnection = `
## 🚀 그로우썸과 함께하는 다음 단계

${growsomeConnection.connection}

**${parsedContent.growsomeConnection || '실무에 바로 적용할 수 있는 솔루션을 찾고 계신가요?'}**

그로우썸은 이런 최신 트렌드를 실제 비즈니스 성장으로 연결하는 전문성을 가지고 있습니다.

[${growsomeConnection.cta}](https://growsome.kr${growsomeConnection.link})

---

*💡 더 많은 비즈니스 인사이트가 필요하시다면? [그로우썸 블로그](https://growsome.kr/blog)에서 매주 새로운 글을 만나보세요.*
`;

  // 구조화된 콘텐츠 조합
  enhancedContent = sourceInfo + enhancedContent + serviceConnection;
  
  return enhancedContent;
};

// 메인 실행 함수
async function generateEnhancedBlogPost() {
  let dbClient = null;
  
  try {
    console.log('1️⃣ 신뢰도 높은 뉴스 소스에서 콘텐츠 수집 중...');
    
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Bot/2.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (rssResponse.statusCode !== 200) {
      throw new Error(`RSS 피드 가져오기 실패: ${rssResponse.statusCode}`);
    }

    const xml = rssResponse.body;
    console.log('✅ TechCrunch RSS 피드 수집 완료');

    console.log('2️⃣ 고품질 콘텐츠 선별 및 분석 중...');
    
    // 향상된 RSS 파싱 및 관련성 분석
    const items = [];
    const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 10)) {
        const titleMatch = item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || item.match(/<title>([^<]+)<\/title>/);
        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || item.match(/<description>([^<]+)<\/description>/);
        const dateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/);
        
        if (titleMatch && linkMatch) {
          const title = titleMatch[1];
          const description = descMatch ? descMatch[1] : '';
          const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();
          
          // 더 정교한 관련성 분석
          const businessKeywords = [
            'AI', 'artificial intelligence', 'machine learning', 'automation',
            'startup', 'business', 'growth', 'marketing', 'strategy', 'innovation',
            'data', 'analytics', 'digital transformation', 'SaaS', 'platform',
            'investment', 'funding', 'venture capital', 'scale', 'revenue',
            'customer', 'user experience', 'conversion', 'optimization',
            'ecommerce', 'online business', 'digital marketing', 'SEO'
          ];
          
          const content = (title + ' ' + description).toLowerCase();
          let relevanceScore = 0;
          const foundKeywords = [];
          
          businessKeywords.forEach(keyword => {
            const count = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
            if (count > 0) {
              relevanceScore += count * (keyword.length > 5 ? 2 : 1);
              foundKeywords.push(keyword);
            }
          });
          
          // 최신성 보너스
          const hoursAgo = (new Date() - pubDate) / (1000 * 60 * 60);
          if (hoursAgo < 24) relevanceScore += 3;
          else if (hoursAgo < 72) relevanceScore += 1;
          
          if (relevanceScore >= 3) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 1000),
              pubDate: pubDate,
              relevanceScore: relevanceScore,
              foundKeywords: foundKeywords,
              source: 'TechCrunch'
            });
          }
        }
      }
    }

    if (items.length === 0) {
      throw new Error('비즈니스 관련 고품질 기사를 찾을 수 없습니다');
    }

    items.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedItem = items[0];
    
    console.log(`✅ 최적 기사 선별: "${selectedItem.title.substring(0, 50)}..."`);
    console.log(`📊 관련성: ${selectedItem.relevanceScore}점, 키워드: ${selectedItem.foundKeywords.slice(0, 5).join(', ')}`);

    console.log('3️⃣ 그로우썸 전문 AI로 고품질 콘텐츠 생성 중...');
    
    // 카테고리 자동 분류
    const category = selectedItem.foundKeywords.some(k => ['AI', 'artificial intelligence', 'machine learning'].includes(k)) ? 'AI' :
                    selectedItem.foundKeywords.some(k => ['marketing', 'SEO', 'conversion'].includes(k)) ? '마케팅' :
                    selectedItem.foundKeywords.some(k => ['ecommerce', 'online business'].includes(k)) ? '이커머스' :
                    selectedItem.foundKeywords.some(k => ['startup', 'venture', 'funding'].includes(k)) ? '스타트업' : 'AI';

    const enhancedPrompt = createEnhancedPrompt(selectedItem, category);
    
    const openaiPayload = {
      model: "gpt-4o-mini", // 안정적인 모델 사용
      messages: [{
        role: "system",
        content: "당신은 Growsome의 수석 테크 블로거입니다. 비즈니스 성장에 도움이 되는 인사이트를 제공하며, 항상 신뢰할 수 있는 정보와 실용적인 조언을 제공합니다. 출처를 명확히 밝히고 그로우썸의 전문성을 자연스럽게 녹여내세요. 마크다운 형식으로 구조화된 글을 작성하세요."
      }, {
        role: "user",
        content: enhancedPrompt
      }],
      max_tokens: 6000,
      temperature: 0.6
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
    });

    if (openaiResponse.statusCode !== 200) {
      throw new Error(`OpenAI API 오류: ${openaiResponse.statusCode}`);
    }

    const aiContent = openaiResponse.body.choices[0].message.content;
    console.log('✅ 전문가급 AI 콘텐츠 생성 완료');

    console.log('4️⃣ 구조화된 블로그 데이터 처리 중...');
    
    let parsedContent;
    try {
      const jsonMatch = aiContent.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiContent.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }

      // 필수 필드 검증
      if (!parsedContent.title) parsedContent.title = selectedItem.title;
      if (!parsedContent.content) parsedContent.content = aiContent;
      if (!parsedContent.tags) parsedContent.tags = ['기술뉴스', category];
      if (!parsedContent.category) parsedContent.category = category;
      if (!parsedContent.readingTime) parsedContent.readingTime = Math.ceil(parsedContent.content.length / 600);
      if (!parsedContent.sourceUrl) parsedContent.sourceUrl = selectedItem.url;
      if (!parsedContent.sourceTitle) parsedContent.sourceTitle = selectedItem.title;

    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 대체 방법 사용');
      parsedContent = {
        title: selectedItem.title.length > 50 ? 
               selectedItem.title.substring(0, 47) + '...' : 
               selectedItem.title,
        content: aiContent.replace(/```json[\s\S]*?```/g, '').trim(),
        summary: selectedItem.description.substring(0, 150) + '...',
        tags: ['기술뉴스', category, '그로우썸'],
        category: category,
        readingTime: Math.ceil(aiContent.length / 600),
        sourceUrl: selectedItem.url,
        sourceTitle: selectedItem.title
      };
    }

    // 그로우썸 서비스 연결
    const growsomeConnection = generateGrowsomeConnection(category, parsedContent.content);
    const enhancedContent = enhanceContent(parsedContent, selectedItem, growsomeConnection);

    // SEO 슬러그 생성
    const createSeoSlug = (title, originalTitle, category) => {
      const categoryKeywords = {
        'AI': 'ai-tech',
        '마케팅': 'marketing', 
        '이커머스': 'ecommerce',
        '스타트업': 'startup'
      };

      const originalWords = originalTitle.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2)
        .slice(0, 4);
      
      const categorySlug = categoryKeywords[category] || 'business';
      const timestamp = Date.now().toString().slice(-4);
      
      if (originalWords.length >= 2) {
        return `${categorySlug}-${originalWords.join('-')}-${timestamp}`;
      } else {
        return `${categorySlug}-post-${timestamp}`;
      }
    };
    
    const slug = createSeoSlug(parsedContent.title, selectedItem.title, category);

    // 카테고리 ID 매핑
    const categoryIds = {
      'AI': 10,
      '마케팅': 11, 
      '이커머스': 12,
      '스타트업': 13
    };

    const blogPost = {
      title: parsedContent.title,
      content: enhancedContent,
      slug: slug,
      category_id: categoryIds[category] || 10,
      meta_title: `${parsedContent.title} | 그로우썸`,
      meta_description: parsedContent.summary,
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      word_count: enhancedContent.length,
      reading_time: parsedContent.readingTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ 블로그 데이터 준비: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time}분)`);

    console.log('5️⃣ 데이터베이스 연결 중...');
    
    dbClient = createDatabaseClient();
    await dbClient.connect();
    console.log('✅ 데이터베이스 연결 성공');

    console.log('6️⃣ 블로그 포스트 저장 중...');
    
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
      0, 0, 0,
      blogPost.created_at,
      blogPost.updated_at,
      new Date().toISOString()
    ]);

    const savedPost = result.rows[0];
    console.log('✅ 블로그 포스트 저장 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: '📝 그로우썸 전문 블로그 발행 완료!',
      message: '구조화된 고품질 콘텐츠가 성공적으로 생성되어 발행되었습니다.',
      details: {
        '제목': blogPost.title,
        '카테고리': `${category} (${parsedContent.tags.join(', ')})`,
        '글자 수': `${blogPost.word_count.toLocaleString()}자`,
        '읽기 시간': `${blogPost.reading_time}분`,
        '관련성 점수': `${selectedItem.relevanceScore}점`,
        '라이브 링크': `https://growsome.kr/blog/${savedPost.slug}`,
        '원본 기사': selectedItem.url,
        '포스트 ID': savedPost.id
      }
    });

    console.log('\n🎉 그로우썸 전문 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📰 제목: ${blogPost.title}`);
    console.log(`📂 카테고리: ${category} (ID: ${blogPost.category_id})`);
    console.log(`🏷️ 태그: ${parsedContent.tags.join(', ')}`);
    console.log(`📄 콘텐츠: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time}분 읽기)`);
    console.log(`📊 품질 점수: ${selectedItem.relevanceScore}점`);
    console.log(`🔗 원본: ${selectedItem.url}`);
    console.log(`🚀 발행 링크: https://growsome.kr/blog/${savedPost.slug}`);
    console.log(`🆔 포스트 ID: ${savedPost.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { 
      success: true, 
      blogPost, 
      savedPost, 
      selectedItem, 
      category,
      tags: parsedContent.tags,
      readingTime: blogPost.reading_time,
      growsomeConnection
    };

  } catch (error) {
    console.error('\n❌ 블로그 생성 오류:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: '📝 그로우썸 블로그 자동화 오류',
      message: `전문 블로그 생성 중 오류가 발생했습니다.`,
      details: {
        '오류 내용': error.message,
        '발생 시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        '조치 사항': '로그 확인 후 재시도 필요'
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
  generateEnhancedBlogPost()
    .then(result => {
      console.log(result.success ? '\n✅ 모든 작업이 성공적으로 완료되었습니다!' : '\n❌ 작업 중 오류가 발생했습니다.');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateEnhancedBlogPost };