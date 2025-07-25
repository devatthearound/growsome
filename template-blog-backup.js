#!/usr/bin/env node

// 🚀 템플릿 기반 가독성 완벽 보장 시스템
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('📚 템플릿 기반 가독성 완벽 보장 시스템');
console.log('🔧 구조화된 템플릿으로 100% 가독성 보장\n');

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

// Claude API 호출 (간단한 요약만)
const callClaude = async (prompt) => {
  console.log('🟣 Claude로 핵심 내용 요약 중...');
  
  const claudePayload = {
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1500,
    temperature: 0.6,
    messages: [{
      role: "user", 
      content: prompt
    }],
    system: `당신은 간결한 요약 전문가입니다. 

요구사항:
1. 3-4문장으로 핵심 내용만 요약
2. 한국어로 응답
3. 마크다운이나 특수문자 사용 금지
4. 평문 텍스트로만 응답
5. JSON 형식 절대 사용 금지`
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
    console.log('✅ Claude 핵심 요약 완료');
    return response.body.content[0].text.trim();
  } else {
    throw new Error(`Claude API 오류: ${response.statusCode}`);
  }
};

// OpenAI API 호출 (간단한 요약만)
const callOpenAI = async (prompt) => {
  console.log('🔵 OpenAI로 핵심 내용 요약 중...');
  
  const openaiPayload = {
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: `당신은 간결한 요약 전문가입니다. 

요구사항:
1. 3-4문장으로 핵심 내용만 요약
2. 한국어로 응답
3. 마크다운이나 특수문자 사용 금지
4. 평문 텍스트로만 응답
5. JSON 형식 절대 사용 금지`
    }, {
      role: "user",
      content: prompt
    }],
    max_tokens: 1000,
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
    console.log('✅ OpenAI 핵심 요약 완료');
    return response.body.choices[0].message.content.trim();
  } else {
    throw new Error(`OpenAI API 오류: ${response.statusCode}`);
  }
};

// AI 요약 호출
const getAISummary = async (prompt) => {
  try {
    if (process.env.CLAUDE_API_KEY && !process.env.CLAUDE_API_KEY.includes('여기에')) {
      return await callClaude(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      return await callOpenAI(prompt);
    }
    throw new Error('사용 가능한 AI 제공자가 없습니다');
  } catch (error) {
    console.log('⚠️ AI 요약 실패, 기본 요약 사용');
    return '최신 AI 기술 트렌드가 비즈니스 환경을 변화시키고 있습니다. 새로운 혁신 기술들이 다양한 산업 분야에서 활용되면서 기업들의 디지털 전환이 가속화되고 있습니다. 이러한 변화는 새로운 비즈니스 기회를 창출하고 있습니다.';
  }
};

// 구조화된 템플릿 생성
const createStructuredBlog = (selectedItem, aiSummary, category) => {
  const categoryInfo = {
    'AI': {
      title: 'AI 기술 전문가가 분석하는 2025년 최신 트렌드',
      expertise: 'AI 및 머신러닝',
      solution: 'AI 기반 비즈니스 자동화',
      benefit: '업무 효율성 40% 향상',
      cta: 'AI 컨설팅 받기'
    },
    '마케팅': {
      title: '마케팅 전문가가 분석하는 2025년 최신 트렌드',
      expertise: '디지털 마케팅 및 성장 전략',
      solution: '데이터 기반 마케팅 최적화',
      benefit: 'ROI 200% 증가',
      cta: '마케팅 진단 받기'
    },
    '이커머스': {
      title: '이커머스 전문가가 분석하는 2025년 최신 트렌드',
      expertise: '온라인 비즈니스 및 전자상거래',
      solution: '쇼핑몰 전환율 최적화',
      benefit: '매출 300% 증가',
      cta: '이커머스 컨설팅 받기'
    },
    '스타트업': {
      title: '스타트업 전문가가 분석하는 2025년 최신 트렌드',
      expertise: '창업 및 비즈니스 성장',
      solution: '스타트업 성장 전략 수립',
      benefit: '투자 유치 성공률 80%',
      cta: '창업 컨설팅 받기'
    }
  };

  const info = categoryInfo[category] || categoryInfo['AI'];
  
  return `# ${info.title}

현재 비즈니스 환경은 빠르게 변화하고 있습니다.

최신 기술 트렌드를 정확히 파악하고 활용하는 것이 성공의 핵심이 되었습니다.

## 🔍 최신 트렌드 분석

${aiSummary}

이러한 변화는 기업들에게 새로운 기회와 도전을 동시에 제공하고 있습니다.

특히 한국 시장에서는 디지털 전환의 속도가 더욱 빨라지고 있어 주목할 필요가 있습니다.

## 📊 핵심 포인트

### 1. 기술 도입의 중요성

최신 기술을 빠르게 도입하는 기업들이 경쟁에서 앞서나가고 있습니다.

단순한 기술 도입을 넘어서 비즈니스 전략과 연계한 활용이 중요합니다.

### 2. 시장 변화 대응

변화하는 고객 니즈에 맞춰 서비스를 개선하는 것이 필수가 되었습니다.

데이터 기반의 의사결정으로 더 정확한 시장 대응이 가능합니다.

### 3. 경쟁력 확보 방안

차별화된 서비스로 고객 만족도를 높이는 것이 핵심입니다.

지속적인 혁신을 통해 시장에서의 위치를 강화할 수 있습니다.

## 🚀 실무 적용 가이드

### 즉시 적용 가능한 전략

다음과 같은 단계로 최신 트렌드를 비즈니스에 적용할 수 있습니다.

**1단계: 현황 분석**
- 현재 비즈니스 상태 점검
- 시장 트렌드 조사 및 분석
- 경쟁사 동향 파악

**2단계: 전략 수립**
- 목표 설정 및 로드맵 작성
- 필요 자원 및 예산 계획
- 위험 요소 사전 점검

**3단계: 실행 및 모니터링**
- 단계별 실행 계획 수행
- 성과 측정 및 분석
- 지속적 개선 및 최적화

## 💼 그로우썸 전문가 인사이트

그로우썸은 ${info.expertise} 분야에서 10년 이상의 경험을 보유하고 있습니다.

500개 이상의 기업과 함께 성공적인 디지털 전환을 이루어냈습니다.

최신 트렌드를 실제 비즈니스 성과로 연결하는 검증된 방법론을 제공합니다.

## 📈 성공 사례

그로우썸과 함께한 기업들은 평균적으로 다음과 같은 성과를 거두었습니다.

- **${info.benefit}**: 체계적인 전략 수립과 실행
- **고객 만족도 25% 증가**: 개선된 서비스 품질
- **운영 비용 30% 절감**: 효율적인 프로세스 최적화

이러한 성과는 단순한 기술 도입이 아닌 전략적 접근의 결과입니다.

## 🎯 다음 단계

최신 트렌드를 여러분의 비즈니스에 적용하고 싶으시다면?

그로우썸의 ${info.solution} 서비스가 도움이 될 수 있습니다.

### 무료 상담 신청

전문가와의 1:1 상담을 통해 맞춤형 솔루션을 받아보세요.

**${info.cta}**: [https://growsome.kr/consultation](https://growsome.kr/consultation)

---

## 📚 이 글의 배경

이 분석은 [${selectedItem.title}](${selectedItem.url})의 내용을 바탕으로 작성되었습니다.

그로우썸 전문가팀이 한국 비즈니스 환경에 맞게 재해석한 내용입니다.

**그로우썸 전문가팀 소개**

- ✅ ${info.expertise} 분야 10년+ 경험
- ✅ 500+ 기업 성공 사례 보유
- ✅ 검증된 성장 방법론 제공

---

💡 **더 많은 전문 인사이트가 필요하다면?**

[그로우썸 블로그](https://growsome.kr/blog)에서 매주 새로운 전문 콘텐츠를 만나보세요!`;
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
async function generateTemplateBlog() {
  let dbClient = null;
  
  try {
    console.log('1️⃣ 최신 비즈니스 뉴스 수집 중...');
    
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Template-Bot/1.0)',
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
            'investment', 'funding', 'venture capital', 'ecommerce', 'fintech'
          ];
          
          const content = (title + ' ' + description).toLowerCase();
          let relevanceScore = 0;
          const foundKeywords = [];
          
          businessKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
            const matches = content.match(regex);
            if (matches) {
              relevanceScore += matches.length;
              foundKeywords.push(keyword);
            }
          });
          
          if (relevanceScore >= 2) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 500),
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

    console.log('3️⃣ AI로 핵심 내용 요약 중...');
    
    const summaryPrompt = `다음 기사의 핵심 내용을 3-4문장으로 요약해주세요.

제목: ${selectedItem.title}
내용: ${selectedItem.description}

한국어로 간결하게 요약하되, 마크다운이나 특수문자는 사용하지 마세요.`;

    const aiSummary = await getAISummary(summaryPrompt);
    
    console.log('✅ AI 핵심 요약 완료');

    console.log('4️⃣ 구조화된 템플릿 블로그 생성 중...');
    
    const structuredContent = createStructuredBlog(selectedItem, aiSummary, category);
    
    // 제목 추출
    const titleMatch = structuredContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${category} 전문가가 분석하는 2025년 최신 트렌드`;
    
    const slug = `${category.toLowerCase().replace(/[^a-z]/g, '')}-trend-${Date.now().toString().slice(-4)}`;

    const categoryIds = { 'AI': 10, '마케팅': 11, '이커머스': 12, '스타트업': 13 };

    const blogPost = {
      title: title,
      content: structuredContent,
      slug: slug,
      category_id: categoryIds[category] || 10,
      meta_title: `${title} | 그로우썸`,
      meta_description: `${category} 전문가가 분석하는 2025년 최신 트렌드와 실무 활용법. 그로우썸의 검증된 인사이트를 확인하세요.`,
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      word_count: structuredContent.length,
      reading_time: Math.ceil(structuredContent.length / 600) + '분',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ 구조화된 템플릿 블로그 준비 완료`);
    console.log(`📝 총 글자수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`⏱️ 읽기 시간: ${blogPost.reading_time}`);

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
    console.log('✅ 템플릿 기반 블로그 포스트 저장 완료!');

    console.log('\n🎉 템플릿 기반 완벽 가독성 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
      category
    };

  } catch (error) {
    console.error('\n❌ 템플릿 블로그 생성 오류:', error.message);
    return { success: false, error: error.message };
    
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

// 실행
if (require.main === module) {
  generateTemplateBlog()
    .then(result => {
      console.log(result.success ? '\n✅ 템플릿 기반 완벽 가독성 시스템 작업 완료!' : '\n❌ 작업 중 오류 발생');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateTemplateBlog };