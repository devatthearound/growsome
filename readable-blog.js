#!/usr/bin/env node

// 🚀 가독성 개선된 블로그 자동화 시스템
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('📖 가독성 최적화 블로그 자동화 시스템');
console.log('✨ 구조화 + 읽기 쉬운 콘텐츠 생성\n');

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
  console.log('🔵 OpenAI API 호출 중...');
  
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
    console.log('✅ OpenAI API 호출 성공');
    return {
      success: true,
      content: response.body.choices[0].message.content,
      provider: 'OpenAI GPT-4o-mini'
    };
  } else {
    throw new Error(`OpenAI API 오류: ${response.statusCode}`);
  }
};

// Claude API 호출
const callClaude = async (prompt) => {
  console.log('🟣 Claude API 호출 중...');
  
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
    console.log('✅ Claude API 호출 성공');
    return {
      success: true,
      content: response.body.content[0].text,
      provider: 'Claude 3.5 Haiku'
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

// 개선된 프롬프트 생성 (가독성 중심)
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

**응답 형식 (JSON):**
{
  "title": "흥미롭고 SEO 친화적인 제목 (45자 내외)",
  "content": "가독성 최적화된 마크다운 콘텐츠 (4000-5000자)",
  "summary": "핵심 내용을 담은 매력적인 요약 (140자 내외)", 
  "tags": ["${category}", "관련태그2", "관련태그3", "그로우썸"],
  "category": "${category}",
  "readingTime": "예상 읽기 시간",
  "keyTakeaways": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "sourceUrl": "${selectedItem.url}",
  "sourceTitle": "${selectedItem.title}",
  "growsomeValue": "이 글을 통해 독자가 얻을 수 있는 그로우썸만의 가치"
}`;
};

// 콘텐츠 후처리 (가독성 개선)
const enhanceReadability = (parsedContent, selectedItem, category) => {
  let content = parsedContent.content;

  // 출처 정보를 더 자연스럽게 추가
  const sourceSection = `
---

## 📚 이 글의 배경

이 분석은 **[${parsedContent.sourceTitle}](${parsedContent.sourceUrl})**의 내용을 바탕으로 그로우썸 전문가팀이 한국 비즈니스 환경에 맞게 재구성한 것입니다.

`;

  // 그로우썸 서비스 연결을 더 자연스럽게
  const serviceConnections = {
    'AI': {
      title: '🚀 AI로 비즈니스 성장 가속화하기',
      content: `이런 **AI 트렌드를 실제 비즈니스 성과로** 연결하고 싶으시다면?

그로우썸의 **AI 기반 스마트 어필리에이트 시스템**이 도움이 될 수 있습니다:

- ✅ **개인화된 추천 엔진**으로 전환율 30% 향상
- ✅ **자동화된 최적화**로 운영 비용 50% 절감  
- ✅ **실시간 성과 분석**으로 ROI 극대화

[**무료 컨설팅 신청하기**](https://growsome.kr/ai-consultation) 👈 AI 전문가와 1:1 상담`,
      cta: 'AI 비즈니스 솔루션 알아보기'
    },
    '마케팅': {
      title: '📊 데이터로 마케팅 성과 극대화하기', 
      content: `이런 **마케팅 인사이트를 실제 성과로** 만들고 싶으시다면?

그로우썸의 **성장 분석 도구**가 답입니다:

- ✅ **고객 여정 분석**으로 전환 포인트 최적화
- ✅ **A/B 테스트 자동화**로 최적 전략 발굴
- ✅ **ROI 실시간 추적**으로 예산 효율 극대화

[**마케팅 진단 받기**](https://growsome.kr/marketing-audit) 👈 무료 마케팅 성과 분석`,
      cta: '마케팅 최적화 솔루션 체험하기'
    }
  };

  const serviceInfo = serviceConnections[category] || {
    title: '🎯 그로우썸과 함께 비즈니스 성장하기',
    content: `**${parsedContent.growsomeValue || '최신 비즈니스 트렌드를 실제 성과로 연결'}**하고 싶으시다면 그로우썸이 도움이 될 수 있습니다.

[**무료 상담 신청**](https://growsome.kr/consultation) 👈 성장 전문가와 1:1 맞춤 상담`,
    cta: '비즈니스 성장 상담받기'
  };

  const growsomeSection = `
---

## ${serviceInfo.title}

${serviceInfo.content}

---

💡 **더 많은 비즈니스 인사이트가 필요하다면?** 
[그로우썸 블로그](https://growsome.kr/blog)에서 매주 새로운 전문 콘텐츠를 만나보세요! 📈

`;

  // 최종 콘텐츠 조합
  return sourceSection + content + growsomeSection;
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
async function generateReadableBlog() {
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
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Bot/3.0)',
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
    console.log(`📊 관련성 점수: ${selectedItem.relevanceScore}점`);
    console.log(`🏷️ 발견된 키워드: ${selectedItem.foundKeywords.slice(0, 5).join(', ')}`);

    // 스마트 카테고리 분류
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

    console.log('4️⃣ 콘텐츠 구조화 및 최종 처리 중...');
    
    let parsedContent;
    try {
      // JSON 추출 및 파싱
      const jsonMatch = aiResult.content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiResult.content.match(/(\{[\s\S]*?\})/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1].trim();
        parsedContent = JSON.parse(jsonStr);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }

      // 데이터 검증 및 기본값 설정
      parsedContent.title = parsedContent.title || selectedItem.title.substring(0, 50);
      parsedContent.content = parsedContent.content || aiResult.content.replace(/```json[\s\S]*?```/g, '').trim();
      parsedContent.summary = parsedContent.summary || selectedItem.description.substring(0, 140) + '...';
      parsedContent.tags = parsedContent.tags || [category, '비즈니스', '트렌드', '그로우썸'];
      parsedContent.category = parsedContent.category || category;
      parsedContent.readingTime = parsedContent.readingTime || Math.ceil(parsedContent.content.length / 600) + '분';
      parsedContent.sourceUrl = parsedContent.sourceUrl || selectedItem.url;
      parsedContent.sourceTitle = parsedContent.sourceTitle || selectedItem.title;

    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 안전 모드로 전환');
      parsedContent = {
        title: selectedItem.title.length > 50 ? selectedItem.title.substring(0, 47) + '...' : selectedItem.title,
        content: aiResult.content.replace(/```json[\s\S]*?```/g, '').trim(),
        summary: selectedItem.description.substring(0, 140) + '...',
        tags: [category, '비즈니스', '트렌드', '그로우썸'],
        category: category,
        readingTime: Math.ceil(aiResult.content.length / 600) + '분',
        sourceUrl: selectedItem.url,
        sourceTitle: selectedItem.title,
        keyTakeaways: ['주요 트렌드 분석', '실무 적용 방안', '비즈니스 기회']
      };
    }

    // 가독성 최적화 콘텐츠 생성
    const finalContent = enhanceReadability(parsedContent, selectedItem, category);
    
    // 슬러그 생성
    const categoryMap = {
      'AI': 'ai-insight',
      '마케팅': 'marketing-guide', 
      '이커머스': 'ecommerce-tips',
      '스타트업': 'startup-growth'
    };

    const cleanTitle = selectedItem.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join('-');
      
    const categorySlug = categoryMap[category] || 'business';
    const timestamp = Date.now().toString().slice(-4);
    const slug = `${categorySlug}-${cleanTitle}-${timestamp}`;

    const categoryIds = { 'AI': 10, '마케팅': 11, '이커머스': 12, '스타트업': 13 };

    const blogPost = {
      title: parsedContent.title,
      content: finalContent,
      slug: slug,
      category_id: categoryIds[category] || 10,
      meta_title: `${parsedContent.title} | 그로우썸`,
      meta_description: parsedContent.summary,
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      word_count: finalContent.length,
      reading_time: parsedContent.readingTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ 최종 콘텐츠 준비 완료`);
    console.log(`📝 총 글자수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`⏱️ 예상 읽기 시간: ${blogPost.reading_time}`);
    console.log(`🏷️ 태그: ${parsedContent.tags.join(', ')}`);

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

    console.log('\n🎉 가독성 최적화 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🤖 AI 제공자: ${aiProvider}`);
    console.log(`📰 제목: ${blogPost.title}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`🏷️ 태그: ${parsedContent.tags.join(', ')}`);
    console.log(`📝 콘텐츠: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time})`);
    console.log(`💡 핵심 포인트: ${(parsedContent.keyTakeaways || []).join(' / ')}`);
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
      category,
      readabilityScore: '최적화됨'
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
  generateReadableBlog()
    .then(result => {
      console.log(result.success ? '\n✅ 가독성 최적화 시스템 작업 완료!' : '\n❌ 작업 중 오류 발생');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateReadableBlog };