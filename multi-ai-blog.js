#!/usr/bin/env node

// 🚀 다중 AI 제공자 블로그 자동화 시스템 (OpenAI + Claude)
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🤖 다중 AI 제공자 블로그 자동화 시스템');
console.log('🔄 OpenAI + Claude API 지원');
console.log('📚 구조화된 콘텐츠 + 신뢰도 높은 글쓰기\n');

// AI 제공자 설정
const AI_PROVIDERS = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  AUTO: 'auto' // 자동 선택 (Claude 우선, 실패 시 OpenAI)
};

// 현재 사용할 AI 제공자 (환경변수로 설정 가능)
const CURRENT_AI_PROVIDER = process.env.AI_PROVIDER || AI_PROVIDERS.AUTO;

console.log(`🎯 AI 제공자: ${CURRENT_AI_PROVIDER.toUpperCase()}`);

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome AI 블로거',
    icon_emoji: ':robot_face:',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : [],
      footer: `🤖 ${options.aiProvider || 'AI'} 블로거 | Growsome 자동화`,
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

// OpenAI API 호출
const callOpenAI = async (prompt) => {
  console.log('🔵 OpenAI API 호출 중...');
  
  const openaiPayload = {
    model: "gpt-4o-mini", // 더 안정적인 모델 사용
    messages: [{
      role: "system",
      content: "당신은 Growsome의 수석 테크 블로거입니다. 비즈니스 성장에 도움이 되는 인사이트를 제공하며, 항상 신뢰할 수 있는 정보와 실용적인 조언을 제공합니다. 출처를 명확히 밝히고 그로우썸의 전문성을 자연스럽게 녹여내세요."
    }, {
      role: "user",
      content: prompt
    }],
    max_tokens: 4000,
    temperature: 0.6
  };

  const response = await makeRequest({
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    protocol: 'https:',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }, openaiPayload);

  if (response.statusCode === 200) {
    console.log('✅ OpenAI API 호출 성공');
    return {
      success: true,
      content: response.body.choices[0].message.content,
      provider: 'OpenAI GPT-4o-mini'
    };
  } else {
    console.log('❌ OpenAI API 오류:', response.statusCode, response.body?.error?.message);
    throw new Error(`OpenAI API 오류: ${response.statusCode} - ${response.body?.error?.message || 'Unknown error'}`);
  }
};

// Claude API 호출
const callClaude = async (prompt) => {
  console.log('🟣 Claude API 호출 중...');
  
  const claudePayload = {
    model: "claude-3-5-haiku-20241022", // 빠르고 효율적인 모델
    max_tokens: 4000,
    temperature: 0.6,
    messages: [{
      role: "user", 
      content: prompt
    }],
    system: "당신은 Growsome의 수석 테크 블로거입니다. 비즈니스 성장에 도움이 되는 인사이트를 제공하며, 항상 신뢰할 수 있는 정보와 실용적인 조언을 제공합니다. 출처를 명확히 밝히고 그로우썸의 전문성을 자연스럽게 녹여내세요. 마크다운 형식으로 구조화된 글을 작성하세요."
  };

  const response = await makeRequest({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    protocol: 'https:',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }
  }, claudePayload);

  if (response.statusCode === 200) {
    console.log('✅ Claude API 호출 성공');
    return {
      success: true,
      content: response.body.content[0].text,
      provider: 'Claude 3.5 Haiku'
    };
  } else {
    console.log('❌ Claude API 오류:', response.statusCode, response.body?.error?.message);
    throw new Error(`Claude API 오류: ${response.statusCode} - ${response.body?.error?.message || 'Unknown error'}`);
  }
};

// 다중 AI 제공자 호출 함수
const callAI = async (prompt, preferredProvider = CURRENT_AI_PROVIDER) => {
  const attempts = [];
  
  try {
    // AUTO 모드인 경우 Claude 우선 시도
    if (preferredProvider === AI_PROVIDERS.AUTO) {
      if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'sk-ant-api03-여기에_Claude_API_키를_입력하세요') {
        try {
          const result = await callClaude(prompt);
          attempts.push({ provider: 'Claude', success: true });
          return result;
        } catch (error) {
          console.log('⚠️ Claude API 실패, OpenAI로 전환 중...');
          attempts.push({ provider: 'Claude', success: false, error: error.message });
        }
      }
      
      if (process.env.OPENAI_API_KEY) {
        try {
          const result = await callOpenAI(prompt);
          attempts.push({ provider: 'OpenAI', success: true });
          return result;
        } catch (error) {
          attempts.push({ provider: 'OpenAI', success: false, error: error.message });
          throw error;
        }
      }
    }
    // 특정 제공자 지정
    else if (preferredProvider === AI_PROVIDERS.CLAUDE) {
      return await callClaude(prompt);
    } 
    else if (preferredProvider === AI_PROVIDERS.OPENAI) {
      return await callOpenAI(prompt);
    }
    
    throw new Error('사용 가능한 AI 제공자가 없습니다');
    
  } catch (error) {
    console.log('📊 API 호출 시도 결과:', attempts);
    throw error;
  }
};

// 데이터베이스 연결
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
const generateGrowsomeConnection = (category) => {
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

  return serviceConnections[category] || {
    service: '성장 솔루션',
    connection: '그로우썸과 함께 비즈니스를 한 단계 높여보세요',
    cta: '그로우썸 솔루션 알아보기',
    link: '/solutions'
  };
};

// 향상된 AI 프롬프트 생성
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

응답 형식 (반드시 JSON):
{
  "title": "SEO 최적화된 50자 내외 제목",
  "content": "구조화된 4000-6000자 마크다운 본문 (# ## ### 활용)",
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

// 콘텐츠 후처리
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

  return sourceInfo + enhancedContent + serviceConnection;
};

// 메인 실행 함수
async function generateMultiAIBlogPost() {
  let dbClient = null;
  let aiProvider = 'Unknown';
  
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

    console.log('✅ TechCrunch RSS 피드 수집 완료');

    console.log('2️⃣ 고품질 콘텐츠 선별 중...');
    
    // RSS 파싱 및 관련성 분석
    const items = [];
    const itemMatches = rssResponse.body.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 10)) {
        const titleMatch = item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || item.match(/<title>([^<]+)<\/title>/);
        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || item.match(/<description>([^<]+)<\/description>/);
        
        if (titleMatch && linkMatch) {
          const title = titleMatch[1];
          const description = descMatch ? descMatch[1] : '';
          
          const businessKeywords = [
            'AI', 'artificial intelligence', 'machine learning', 'automation',
            'startup', 'business', 'growth', 'marketing', 'strategy', 'innovation',
            'data', 'analytics', 'digital transformation', 'SaaS', 'platform',
            'investment', 'funding', 'venture capital', 'ecommerce'
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
          
          if (relevanceScore >= 3) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 1000),
              relevanceScore: relevanceScore,
              foundKeywords: foundKeywords
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
    console.log(`📊 관련성: ${selectedItem.relevanceScore}점`);

    // 카테고리 분류
    const category = selectedItem.foundKeywords.some(k => ['AI', 'artificial intelligence', 'machine learning'].includes(k)) ? 'AI' :
                    selectedItem.foundKeywords.some(k => ['marketing'].includes(k)) ? '마케팅' :
                    selectedItem.foundKeywords.some(k => ['ecommerce'].includes(k)) ? '이커머스' :
                    selectedItem.foundKeywords.some(k => ['startup', 'venture', 'funding'].includes(k)) ? '스타트업' : 'AI';

    console.log('3️⃣ 다중 AI로 고품질 콘텐츠 생성 중...');
    
    const enhancedPrompt = createEnhancedPrompt(selectedItem, category);
    const aiResult = await callAI(enhancedPrompt);
    aiProvider = aiResult.provider;
    
    console.log(`✅ ${aiResult.provider}로 콘텐츠 생성 완료`);

    console.log('4️⃣ 구조화된 블로그 데이터 처리 중...');
    
    let parsedContent;
    try {
      const jsonMatch = aiResult.content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiResult.content.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }

      // 필수 필드 검증
      if (!parsedContent.title) parsedContent.title = selectedItem.title;
      if (!parsedContent.content) parsedContent.content = aiResult.content;
      if (!parsedContent.tags) parsedContent.tags = ['기술뉴스', category];
      if (!parsedContent.category) parsedContent.category = category;
      if (!parsedContent.readingTime) parsedContent.readingTime = Math.ceil(parsedContent.content.length / 600);
      if (!parsedContent.sourceUrl) parsedContent.sourceUrl = selectedItem.url;
      if (!parsedContent.sourceTitle) parsedContent.sourceTitle = selectedItem.title;

    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 대체 방법 사용');
      parsedContent = {
        title: selectedItem.title.length > 50 ? selectedItem.title.substring(0, 47) + '...' : selectedItem.title,
        content: aiResult.content.replace(/```json[\s\S]*?```/g, '').trim(),
        summary: selectedItem.description.substring(0, 150) + '...',
        tags: ['기술뉴스', category, '그로우썸'],
        category: category,
        readingTime: Math.ceil(aiResult.content.length / 600),
        sourceUrl: selectedItem.url,
        sourceTitle: selectedItem.title
      };
    }

    const growsomeConnection = generateGrowsomeConnection(category);
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

    const categoryIds = { 'AI': 10, '마케팅': 11, '이커머스': 12, '스타트업': 13 };

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

    console.log(`✅ 블로그 데이터 준비: ${blogPost.word_count.toLocaleString()}자`);

    console.log('5️⃣ 데이터베이스 저장 중...');
    
    dbClient = createDatabaseClient();
    await dbClient.connect();

    const insertQuery = `
      INSERT INTO blog_contents (
        title, content_body, slug, category_id, meta_title, meta_description,
        author_id, status, is_featured, view_count, like_count, comment_count, 
        created_at, updated_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, slug;
    `;

    const result = await dbClient.query(insertQuery, [
      blogPost.title, blogPost.content, blogPost.slug, blogPost.category_id,
      blogPost.meta_title, blogPost.meta_description, blogPost.author_id,
      blogPost.status, blogPost.is_featured, 0, 0, 0,
      blogPost.created_at, blogPost.updated_at, new Date().toISOString()
    ]);

    const savedPost = result.rows[0];
    console.log('✅ 블로그 포스트 저장 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: '🤖 다중 AI 블로그 발행 완료!',
      message: '다중 AI 시스템으로 고품질 콘텐츠가 성공적으로 생성되었습니다.',
      aiProvider: aiProvider,
      details: {
        'AI 제공자': aiProvider,
        '제목': blogPost.title,
        '카테고리': `${category} (${parsedContent.tags.join(', ')})`,
        '글자 수': `${blogPost.word_count.toLocaleString()}자`,
        '읽기 시간': `${blogPost.reading_time}분`,
        '라이브 링크': `https://growsome.kr/blog/${savedPost.slug}`,
        '원본 기사': selectedItem.url,
        '포스트 ID': savedPost.id
      }
    });

    console.log('\n🎉 다중 AI 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🤖 AI 제공자: ${aiProvider}`);
    console.log(`📰 제목: ${blogPost.title}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`📄 콘텐츠: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time}분)`);
    console.log(`🚀 발행 링크: https://growsome.kr/blog/${savedPost.slug}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { 
      success: true, 
      blogPost, 
      savedPost, 
      selectedItem, 
      aiProvider
    };

  } catch (error) {
    console.error('\n❌ 블로그 생성 오류:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: '🤖 다중 AI 블로그 자동화 오류',
      message: `다중 AI 블로그 생성 중 오류가 발생했습니다.`,
      aiProvider: aiProvider,
      details: {
        'AI 제공자': aiProvider,
        '오류 내용': error.message,
        '발생 시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      }
    });

    return { success: false, error: error.message };
    
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

// 실행
if (require.main === module) {
  generateMultiAIBlogPost()
    .then(result => {
      console.log(result.success ? '\n✅ 다중 AI 시스템 작업 완료!' : '\n❌ 작업 중 오류가 발생했습니다.');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateMultiAIBlogPost };