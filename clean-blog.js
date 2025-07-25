#!/usr/bin/env node

// 🚀 가독성 완벽 개선 블로그 자동화 시스템
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('📖 가독성 완벽 최적화 블로그 시스템');
console.log('✨ JSON 데이터 완전 차단 + 구조화된 콘텐츠\n');

// AI 제공자 설정
const AI_PROVIDERS = {
  OPENAI: 'openai',
  CLAUDE: 'claude', 
  AUTO: 'auto'
};

const CURRENT_AI_PROVIDER = process.env.AI_PROVIDER || AI_PROVIDERS.AUTO;
console.log(`🎯 AI 제공자: ${CURRENT_AI_PROVIDER.toUpperCase()}`);

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
  console.log('🔵 OpenAI 가독성 최적화 콘텐츠 생성 중...');
  
  const openaiPayload = {
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: `당신은 Growsome의 전문 콘텐츠 라이터입니다.

핵심 원칙:
1. 읽기 쉬운 구조화된 글 작성 (명확한 헤더, 짧은 문단)
2. 실무진이 바로 활용할 수 있는 구체적인 정보 제공
3. 그로우썸의 전문성과 서비스를 자연스럽게 연결
4. 한국 비즈니스 환경에 맞는 관점 제시

중요: JSON 형식이 아닌 마크다운 형식으로만 응답하세요.
절대 JSON 코드 블록을 사용하지 마세요.

글 작성 가이드:
- 각 문단은 3-4줄로 제한
- 핵심 포인트는 불릿 포인트로 정리
- 실제 사례나 수치 포함
- Call-to-Action 자연스럽게 삽입`
    }, {
      role: "user",
      content: prompt
    }],
    max_tokens: 4000,
    temperature: 0.7
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
    console.log('✅ OpenAI 가독성 최적화 콘텐츠 생성 완료');
    return {
      success: true,
      content: response.body.choices[0].message.content,
      provider: 'OpenAI GPT-4o-mini (가독성 최적화)'
    };
  } else {
    throw new Error(`OpenAI API 오류: ${response.statusCode}`);
  }
};

// Claude API 호출
const callClaude = async (prompt) => {
  console.log('🟣 Claude 가독성 최적화 콘텐츠 생성 중...');
  
  const claudePayload = {
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4000,
    temperature: 0.7,
    messages: [{
      role: "user", 
      content: prompt
    }],
    system: `당신은 Growsome의 전문 콘텐츠 라이터입니다.

핵심 원칙:
1. 읽기 쉬운 구조화된 글 작성 (명확한 헤더, 짧은 문단)
2. 실무진이 바로 활용할 수 있는 구체적인 정보 제공
3. 그로우썸의 전문성과 서비스를 자연스럽게 연결
4. 한국 비즈니스 환경에 맞는 관점 제시

중요: JSON 형식이 아닌 마크다운 형식으로만 응답하세요.
절대 JSON 코드 블록을 사용하지 마세요.

글 작성 가이드:
- 각 문단은 3-4줄로 제한
- 핵심 포인트는 불릿 포인트로 정리  
- 실제 사례나 수치 포함
- Call-to-Action 자연스럽게 삽입
- 마크다운 형식으로 구조화`
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
    console.log('✅ Claude 가독성 최적화 콘텐츠 생성 완료');
    return {
      success: true,
      content: response.body.content[0].text,
      provider: 'Claude 3.5 Haiku (가독성 최적화)'
    };
  } else {
    throw new Error(`Claude API 오류: ${response.statusCode}`);
  }
};

// 다중 AI 호출
const callAI = async (prompt, preferredProvider = CURRENT_AI_PROVIDER) => {
  try {
    if (preferredProvider === AI_PROVIDERS.AUTO) {
      if (process.env.CLAUDE_API_KEY && !process.env.CLAUDE_API_KEY.includes('여기에')) {
        try {
          return await callClaude(prompt);
        } catch (error) {
          console.log('⚠️ Claude 실패, OpenAI로 전환...');
        }
      }
      
      if (process.env.OPENAI_API_KEY) {
        return await callOpenAI(prompt);
      }
    }
    else if (preferredProvider === AI_PROVIDERS.CLAUDE) {
      return await callClaude(prompt);
    } 
    else if (preferredProvider === AI_PROVIDERS.OPENAI) {
      return await callOpenAI(prompt);
    }
    
    throw new Error('사용 가능한 AI 제공자가 없습니다');
  } catch (error) {
    throw error;
  }
};

// 가독성 최적화 프롬프트 생성
const createReadablePrompt = (selectedItem, category) => {
  return `다음 기사를 바탕으로 그로우썸 블로그용 읽기 쉬운 글을 작성해주세요.

**원본 기사:**
제목: ${selectedItem.title}
URL: ${selectedItem.url}
내용: ${selectedItem.description}
카테고리: ${category}

**글 작성 요구사항:**

📝 **구조화 원칙:**
- 명확한 제목 구조 (# 메인 제목, ## 소제목, ### 세부 제목)
- 각 문단은 3-4줄로 제한 (가독성 최우선)
- 핵심 내용은 불릿 포인트나 번호로 정리
- 중요한 키워드나 수치는 **볼드** 처리

📊 **내용 구성:**
1. **흥미로운 도입** (2-3문단)
   - 현재 트렌드나 문제 제기
   - 독자의 관심을 끄는 질문이나 통계

2. **핵심 분석** (3-4개 섹션)
   - 각 섹션마다 명확한 소제목
   - 구체적인 사례나 데이터 포함
   - 한국 시장 관점에서 해석

3. **실무 활용 가이드** (1-2섹션)
   - 바로 적용 가능한 실용적 팁
   - 단계별 체크리스트나 가이드

4. **그로우썸 전문가 의견** (1섹션)
   - 이 트렌드에 대한 그로우썸의 인사이트
   - 서비스와 자연스러운 연결

5. **마무리 및 전망** (1-2문단)
   - 핵심 내용 요약
   - 향후 전망이나 액션 아이템

🎯 **그로우썸 연결 포인트:**
- ${category} 분야에서 그로우썸의 전문성 언급
- 관련 서비스나 솔루션 자연스럽게 소개
- 독자가 다음 단계로 진행할 수 있는 CTA 포함

**중요: 마크다운 형식으로만 응답하고, 절대 JSON 코드 블록을 사용하지 마세요.**

글의 제목은 "${category} 분야 전문가가 분석하는 2025년 최신 트렌드"와 같은 형태로 시작해주세요.`;
};

// 콘텐츠 완전 정리 함수
const cleanAndStructureContent = (rawContent, selectedItem, category) => {
  let content = rawContent;
  
  // 1단계: JSON 및 메타데이터 완전 제거
  content = content
    .replace(/```json[\s\S]*?```/g, '') // JSON 블록 제거
    .replace(/```[\s\S]*?```/g, '') // 모든 코드 블록 제거
    .replace(/\{[\s\S]*?\}/g, '') // JSON 객체 제거
    .replace(/"[^"]*":/g, '') // JSON 키 제거
    .replace(/---[\s\S]*?---/g, '') // 메타데이터 제거
    .replace(/^\s*,\s*/gm, '') // 줄 시작의 콤마 제거
    .replace(/^\s*\[|\]\s*$/gm, '') // 배열 브래킷 제거
    .replace(/^\s*\d+\.\s*$/gm, '') // 홀로 있는 숫자 제거
    .trim();

  // 2단계: 문단 정리
  content = content
    .replace(/\n{3,}/g, '\n\n') // 과도한 줄바꿈 정리
    .replace(/^([^#\n-\*•].{100,}?)([.!?])\s*$/gm, (match, text, punct) => {
      // 긴 문단을 적절히 나누기
      if (text.length > 200) {
        return text.replace(/([.!?])\s+/g, '$1\n\n') + punct;
      }
      return match;
    });

  // 3단계: 제목 구조 확인 및 추가
  if (!content.includes('#')) {
    const mainTitle = `# ${category} 전문가가 분석하는 2025년 최신 트렌드`;
    content = mainTitle + '\n\n' + content;
  }

  // 4단계: 출처 정보 추가
  const sourceSection = `
---

## 📚 이 글의 배경

이 분석은 **[${selectedItem.title}](${selectedItem.url})**의 내용을 바탕으로 그로우썸 전문가팀이 한국 비즈니스 환경에 맞게 재구성한 것입니다.

**그로우썸 전문가팀 소개:**

- ✅ ${category} 분야 10년+ 경험
- ✅ 500+ 기업 컨설팅 실적  
- ✅ 검증된 성장 방법론 보유

`;

  // 5단계: 그로우썸 서비스 연결
  const serviceConnections = {
    'AI': {
      title: '🚀 AI로 비즈니스 성장 가속화하기',
      content: `이런 **AI 트렌드를 실제 비즈니스 성과로** 연결하고 싶으시다면?

그로우썸의 **AI 기반 스마트 어필리에이트 시스템**이 도움이 될 수 있습니다:

- ✅ **개인화된 추천 엔진**으로 전환율 30% 향상
- ✅ **자동화된 최적화**로 운영 비용 50% 절감  
- ✅ **실시간 성과 분석**으로 ROI 극대화

[**무료 AI 컨설팅 신청하기**](https://growsome.kr/ai-consultation) 👈 AI 전문가와 1:1 상담`
    },
    '마케팅': {
      title: '📊 데이터로 마케팅 성과 극대화하기',
      content: `이런 **마케팅 인사이트를 실제 성과로** 만들고 싶으시다면?

그로우썸의 **성장 분석 도구**가 답입니다:

- ✅ **고객 여정 분석**으로 전환 포인트 최적화
- ✅ **A/B 테스트 자동화**로 최적 전략 발굴
- ✅ **ROI 실시간 추적**으로 예산 효율 극대화

[**마케팅 진단 받기**](https://growsome.kr/marketing-audit) 👈 무료 마케팅 성과 분석`
    }
  };

  const serviceInfo = serviceConnections[category] || {
    title: '🎯 그로우썸과 함께 비즈니스 성장하기',
    content: `**최신 비즈니스 트렌드를 실제 성과로 연결**하고 싶으시다면 그로우썸이 도움이 될 수 있습니다.

[**무료 상담 신청**](https://growsome.kr/consultation) 👈 성장 전문가와 1:1 맞춤 상담`
  };

  const growsomeSection = `
---

## ${serviceInfo.title}

${serviceInfo.content}

---

💡 **더 많은 비즈니스 인사이트가 필요하다면?** 
[그로우썸 블로그](https://growsome.kr/blog)에서 매주 새로운 전문 콘텐츠를 만나보세요! 📈

`;

  // 최종 조합
  return sourceSection + content + growsomeSection;
};

// 제목 추출 함수
const extractTitle = (content, category) => {
  // H1 제목 찾기
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 기본 제목 생성
  return `${category} 전문가가 분석하는 2025년 최신 트렌드`;
};

// SEO 친화적 슬러그 생성
const createSEOSlug = (title, category) => {
  const categoryMap = {
    'AI': 'ai-trend',
    '마케팅': 'marketing-insight',
    '이커머스': 'ecommerce-guide',
    '스타트업': 'startup-growth'
  };

  const categorySlug = categoryMap[category] || 'business';
  const timestamp = Date.now().toString().slice(-4);
  
  return `${categorySlug}-${timestamp}`;
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

// 메인 실행 함수
async function generateCleanBlog() {
  let dbClient = null;
  let aiProvider = 'Unknown';
  
  try {
    console.log('1️⃣ 고품질 뉴스 소스 수집 중...');
    
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Clean-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (rssResponse.statusCode !== 200) {
      throw new Error(`RSS 피드 오류: ${rssResponse.statusCode}`);
    }

    console.log('✅ TechCrunch RSS 수집 완료');

    console.log('2️⃣ 비즈니스 관련 기사 선별 중...');
    
    const items = [];
    const itemMatches = rssResponse.body.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 15)) {
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
            'investment', 'funding', 'venture capital', 'ecommerce', 'fintech'
          ];
          
          const content = (title + ' ' + description).toLowerCase();
          let relevanceScore = 0;
          const foundKeywords = [];
          
          businessKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
            const matches = content.match(regex);
            if (matches) {
              const weight = keyword.length > 8 ? 3 : keyword.length > 5 ? 2 : 1;
              relevanceScore += matches.length * weight;
              foundKeywords.push(keyword);
            }
          });
          
          if (relevanceScore >= 4) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 800),
              relevanceScore: relevanceScore,
              foundKeywords: [...new Set(foundKeywords)]
            });
          }
        }
      }
    }

    if (items.length === 0) {
      throw new Error('적합한 비즈니스 기사를 찾을 수 없습니다');
    }

    items.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedItem = items[0];
    
    console.log(`✅ 선별된 기사: "${selectedItem.title.substring(0, 60)}..."`);
    console.log(`📊 관련성: ${selectedItem.relevanceScore}점`);

    // 카테고리 분류
    const category = selectedItem.foundKeywords.some(k => 
      ['AI', 'artificial intelligence', 'machine learning', 'automation'].includes(k)
    ) ? 'AI' :
    selectedItem.foundKeywords.some(k => 
      ['marketing', 'analytics', 'growth'].includes(k)
    ) ? '마케팅' :
    selectedItem.foundKeywords.some(k => 
      ['ecommerce', 'fintech', 'platform'].includes(k)
    ) ? '이커머스' :
    selectedItem.foundKeywords.some(k => 
      ['startup', 'venture', 'funding', 'investment'].includes(k)
    ) ? '스타트업' : 'AI';

    console.log(`🎯 분류된 카테고리: ${category}`);

    console.log('3️⃣ AI로 가독성 최적화 콘텐츠 생성 중...');
    
    const readablePrompt = createReadablePrompt(selectedItem, category);
    const aiResult = await callAI(readablePrompt);
    aiProvider = aiResult.provider;
    
    console.log(`✅ ${aiResult.provider}로 가독성 최적화 콘텐츠 생성 완료`);

    console.log('4️⃣ 콘텐츠 완전 정리 및 구조화 중...');
    
    // 콘텐츠 완전 정리
    const cleanContent = cleanAndStructureContent(aiResult.content, selectedItem, category);
    const title = extractTitle(cleanContent, category);
    const slug = createSEOSlug(title, category);

    const categoryIds = { 'AI': 10, '마케팅': 11, '이커머스': 12, '스타트업': 13 };

    const blogPost = {
      title: title,
      content: cleanContent,
      slug: slug,
      category_id: categoryIds[category] || 10,
      meta_title: `${title} | 그로우썸`,
      meta_description: `${category} 전문가가 분석하는 2025년 최신 트렌드와 실무 활용법. 그로우썸의 전문 인사이트를 확인하세요.`,
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      word_count: cleanContent.length,
      reading_time: Math.ceil(cleanContent.length / 600) + '분',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ 완전 정리된 콘텐츠 준비 완료`);
    console.log(`📝 총 글자수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`⏱️ 읽기 시간: ${blogPost.reading_time}`);
    console.log(`🎯 카테고리: ${category}`);

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
    console.log('✅ 가독성 최적화 블로그 포스트 저장 완료!');

    console.log('\n🎉 가독성 완벽 최적화 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🤖 AI 제공자: ${aiProvider}`);
    console.log(`📰 제목: ${blogPost.title}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`📝 콘텐츠: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time})`);
    console.log(`🔗 원본: ${selectedItem.url}`);
    console.log(`🚀 발행 링크: https://growsome.kr/blog/${savedPost.slug}`);
    console.log(`🆔 포스트 ID: ${savedPost.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { 
      success: true, 
      blogPost, 
      savedPost, 
      selectedItem, 
      aiProvider,
      category
    };

  } catch (error) {
    console.error('\n❌ 가독성 최적화 블로그 생성 오류:', error.message);
    return { success: false, error: error.message };
    
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

// 실행
if (require.main === module) {
  generateCleanBlog()
    .then(result => {
      console.log(result.success ? '\n✅ 가독성 완벽 최적화 시스템 작업 완료!' : '\n❌ 작업 중 오류 발생');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateCleanBlog };