#!/usr/bin/env node

// 🚀 SEO 최적화 블로그 자동화 시스템
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🔍 SEO 최적화 블로그 자동화 시스템');
console.log('📈 검색 엔진 최적화 + 가독성 최고 수준\n');

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

// SEO 키워드 분석기
const analyzeSEOKeywords = (title, description, category) => {
  const baseKeywords = {
    'AI': ['인공지능', 'AI', '머신러닝', '자동화', '딥러닝', 'AI솔루션', 'AI기술'],
    '마케팅': ['디지털마케팅', '마케팅전략', 'SEO', '브랜딩', '고객분석', '마케팅ROI'],
    '이커머스': ['온라인쇼핑몰', '이커머스', '전자상거래', '온라인판매', '쇼핑몰운영'],
    '스타트업': ['스타트업', '창업', '비즈니스모델', '투자유치', '기업성장', '사업계획']
  };

  const contentKeywords = (title + ' ' + description).toLowerCase();
  const relevantKeywords = baseKeywords[category] || baseKeywords['AI'];
  
  // 검색량과 경쟁도를 고려한 키워드 점수 계산
  const keywordScores = relevantKeywords.map(keyword => {
    const frequency = (contentKeywords.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const searchVolume = keyword.length < 5 ? 3 : keyword.length < 8 ? 2 : 1;
    const competition = keyword.includes('AI') || keyword.includes('마케팅') ? 3 : 1;
    
    return {
      keyword,
      score: frequency * searchVolume - competition,
      searchVolume,
      competition
    };
  });

  // 추가 롱테일 키워드 생성
  const longTailKeywords = [
    `${category} 트렌드 2025`,
    `${category} 솔루션 비교`,
    `${category} 도입 가이드`,
    `${category} 성공사례`,
    `한국 ${category} 시장`
  ];

  return {
    primary: keywordScores.sort((a, b) => b.score - a.score).slice(0, 3),
    longTail: longTailKeywords,
    related: ['그로우썸', '비즈니스성장', '디지털전환', '업무효율성']
  };
};

// SEO 최적화 메타 데이터 생성
const generateSEOMetadata = (content, keywords, category) => {
  const titleTemplates = {
    'AI': [
      '[키워드] 완벽 가이드: 2025년 최신 트렌드',
      '[키워드]로 비즈니스 성장하는 5가지 방법',
      '전문가가 알려주는 [키워드] 활용법'
    ],
    '마케팅': [
      '[키워드] 전략으로 매출 200% 증가시키기',
      '2025년 [키워드] 트렌드와 실무 적용법',
      'ROI 극대화하는 [키워드] 완벽 가이드'
    ],
    '이커머스': [
      '[키워드] 성공사례로 보는 매출 증대 전략',
      '전환율 높이는 [키워드] 최신 기법',
      '[키워드] 운영 노하우: 전문가 인사이트'
    ],
    '스타트업': [
      '[키워드] 성공 로드맵: 창업부터 성장까지',
      '투자받는 [키워드] 사업계획서 작성법',
      '[키워드] 스케일업 전략과 성공사례'
    ]
  };

  const templates = titleTemplates[category] || titleTemplates['AI'];
  const primaryKeyword = keywords.primary[0]?.keyword || category;
  
  return {
    seoTitle: templates[Math.floor(Math.random() * templates.length)].replace('[키워드]', primaryKeyword),
    focusKeyword: primaryKeyword,
    semanticKeywords: keywords.primary.slice(1, 4).map(k => k.keyword),
    longTailKeywords: keywords.longTail,
    internalLinks: [
      { text: '그로우썸 솔루션', url: '/solutions' },
      { text: '무료 컨설팅', url: '/consultation' },
      { text: '관련 서비스', url: `/${category.toLowerCase()}-service` }
    ]
  };
};

// OpenAI API 호출 (SEO 최적화)
const callOpenAI = async (prompt) => {
  console.log('🔵 OpenAI SEO 최적화 콘텐츠 생성 중...');
  
  const openaiPayload = {
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: `당신은 Growsome의 SEO 전문 콘텐츠 라이터입니다.

SEO 최적화 원칙:
1. 타겟 키워드 자연스러운 배치 (키워드 밀도 1-2%)
2. 제목과 부제목에 핵심 키워드 포함
3. 메타 설명에 클릭을 유도하는 문구 포함
4. 내부 링크와 외부 링크 균형있게 배치
5. 사용자 의도에 맞는 컨텐츠 구조

구글 검색 알고리즘 고려사항:
- E-A-T (전문성, 권위성, 신뢰성) 강화
- 사용자 검색 의도 만족
- 페이지 로딩 속도 고려한 구조
- 모바일 친화적 컨텐츠

콘텐츠 구조:
- H1: 메인 키워드 포함 (1개)
- H2: 관련 키워드 포함 (3-5개)  
- H3: 롱테일 키워드 활용 (5-8개)
- 이미지 alt 텍스트 최적화 제안
- FAQ 섹션 포함`
    }, {
      role: "user",
      content: prompt
    }],
    max_tokens: 4500,
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
    console.log('✅ OpenAI SEO 최적화 콘텐츠 생성 완료');
    return {
      success: true,
      content: response.body.choices[0].message.content,
      provider: 'OpenAI GPT-4o-mini (SEO 최적화)'
    };
  } else {
    throw new Error(`OpenAI API 오류: ${response.statusCode}`);
  }
};

// Claude API 호출 (SEO 최적화)
const callClaude = async (prompt) => {
  console.log('🟣 Claude SEO 최적화 콘텐츠 생성 중...');
  
  const claudePayload = {
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4500,
    temperature: 0.6,
    messages: [{
      role: "user", 
      content: prompt
    }],
    system: `당신은 Growsome의 SEO 전문 콘텐츠 라이터입니다.

SEO 최적화 원칙:
1. 타겟 키워드 자연스러운 배치 (키워드 밀도 1-2%)
2. 제목과 부제목에 핵심 키워드 포함
3. 메타 설명에 클릭을 유도하는 문구 포함
4. 내부 링크와 외부 링크 균형있게 배치
5. 사용자 의도에 맞는 컨텐츠 구조

구글 검색 알고리즘 고려사항:
- E-A-T (전문성, 권위성, 신뢰성) 강화
- 사용자 검색 의도 만족
- 페이지 로딩 속도 고려한 구조
- 모바일 친화적 컨텐츠

콘텐츠 구조:
- H1: 메인 키워드 포함 (1개)
- H2: 관련 키워드 포함 (3-5개)  
- H3: 롱테일 키워드 활용 (5-8개)
- 이미지 alt 텍스트 최적화 제안
- FAQ 섹션 포함

마크다운으로 구조화하여 응답하세요.`
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
    console.log('✅ Claude SEO 최적화 콘텐츠 생성 완료');
    return {
      success: true,
      content: response.body.content[0].text,
      provider: 'Claude 3.5 Haiku (SEO 최적화)'
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

// SEO 최적화 프롬프트 생성
const createSEOPrompt = (selectedItem, category, seoData) => {
  return `다음 기사를 바탕으로 SEO 최적화된 그로우썸 블로그 글을 작성해주세요.

**원본 기사:**
제목: ${selectedItem.title}
URL: ${selectedItem.url}
내용: ${selectedItem.description}
카테고리: ${category}

**SEO 최적화 요구사항:**

🎯 **타겟 키워드:**
- 주요 키워드: ${seoData.focusKeyword}
- 관련 키워드: ${seoData.semanticKeywords.join(', ')}
- 롱테일 키워드: ${seoData.longTailKeywords.slice(0, 3).join(', ')}

📊 **SEO 구조 요구사항:**
- H1 제목에 주요 키워드 포함 (자연스럽게)
- H2 소제목 3-5개에 관련 키워드 배치
- H3 세부제목에 롱테일 키워드 활용
- 키워드 밀도 1-2% 유지 (자연스럽게)
- 내부 링크 3-5개 포함

📝 **콘텐츠 구조:**
1. **SEO 최적화 도입부** (150-200자)
   - 주요 키워드 자연스럽게 포함
   - 사용자의 검색 의도 만족
   - 흥미로운 hook으로 시작

2. **핵심 분석 섹션들** (4-5개 H2)
   - 각 H2에 관련 키워드 포함
   - 구체적 데이터와 사례 제시
   - 전문성(E-A-T) 강화 내용

3. **실무 가이드** (H2 + 여러 H3)
   - 롱테일 키워드 활용한 세부 가이드
   - 단계별 체크리스트
   - 실행 가능한 팁들

4. **FAQ 섹션** (SEO 필수)
   - 관련 검색어 기반 질문 3-5개
   - 간결하고 명확한 답변
   - 롱테일 키워드 자연스럽게 포함

5. **그로우썸 전문가 인사이트**
   - 권위성 강화 내용
   - 독창적 관점 제시
   - 신뢰도 높은 정보

📈 **추가 SEO 요소:**
- 메타 설명 최적화 (140자 내)
- 이미지 alt 텍스트 제안 3개
- 내부 링크 자연스럽게 배치
- 외부 링크는 원본 기사로만

🔗 **내부 링크 포함:**
${seoData.internalLinks.map(link => `- [${link.text}](https://growsome.kr${link.url})`).join('\n')}

**응답 형식 (JSON):**
{
  "title": "SEO 최적화된 H1 제목 (주요 키워드 포함, 60자 내)",
  "content": "SEO 최적화된 마크다운 콘텐츠 (5000-6000자)",
  "metaDescription": "클릭 유도하는 메타 설명 (140자 내)",
  "summary": "검색 결과용 요약 (160자 내)",
  "tags": ["${seoData.focusKeyword}", "${category}", "그로우썸", "2025"],
  "category": "${category}",
  "focusKeyword": "${seoData.focusKeyword}",
  "semanticKeywords": [${seoData.semanticKeywords.map(k => `"${k}"`).join(', ')}],
  "readingTime": "예상 읽기 시간",
  "seoScore": "SEO 최적화 점수 (1-100)",
  "keywordDensity": "키워드 밀도 (%)",
  "imageAltTexts": ["이미지 alt 텍스트 1", "이미지 alt 텍스트 2", "이미지 alt 텍스트 3"],
  "internalLinks": [{"text": "링크텍스트", "url": "/링크주소"}],
  "faqSection": [{"question": "질문", "answer": "답변"}],
  "sourceUrl": "${selectedItem.url}",
  "sourceTitle": "${selectedItem.title}",
  "seoRecommendations": ["SEO 개선 제안사항들"]
}`;
};

// SEO 최적화 콘텐츠 후처리
const enhanceSEOContent = (parsedContent, selectedItem, seoData) => {
  let content = parsedContent.content;

  // 출처 및 신뢰성 정보 (E-A-T 강화)
  const authoritySection = `
---

## 📚 이 분석의 근거

이 글은 **[${parsedContent.sourceTitle}](${parsedContent.sourceUrl})**의 최신 정보를 바탕으로 그로우썸의 ${parsedContent.category} 전문가팀이 한국 시장에 맞게 분석한 내용입니다.

**그로우썸 전문가팀 소개:**
- ✅ ${parsedContent.category} 분야 10년+ 경험
- ✅ 500+ 기업 컨설팅 실적  
- ✅ 검증된 성장 방법론 보유

`;

  // SEO 최적화된 그로우썸 연결 섹션
  const seoServiceSection = `
---

## 🚀 ${parsedContent.focusKeyword}로 비즈니스 성장하기

**${parsedContent.focusKeyword} 도입을 고민**하고 계신가요?

그로우썸은 **${parsedContent.category} 전문 컨설팅**으로 많은 기업들의 성공을 도왔습니다:

### 🎯 그로우썸만의 ${parsedContent.category} 솔루션
- ✅ **맞춤형 전략 수립**: 기업별 상황 분석
- ✅ **단계별 실행 계획**: 체계적 도입 과정
- ✅ **성과 측정 시스템**: ROI 실시간 추적

### 📞 무료 상담 신청

**${parsedContent.focusKeyword} 전문가와 1:1 상담**받고 싶으시다면?

[**무료 ${parsedContent.category} 컨설팅 신청**](https://growsome.kr/consultation) 👈 지금 바로 신청

---

### 🔗 관련 서비스 둘러보기

${parsedContent.internalLinks ? parsedContent.internalLinks.map(link => 
  `- [${link.text}](https://growsome.kr${link.url})`
).join('\n') : ''}

---

💡 **더 많은 ${parsedContent.category} 인사이트가 필요하다면?**  
[그로우썸 ${parsedContent.category} 블로그](https://growsome.kr/blog/category/${parsedContent.category.toLowerCase()})에서 전문 콘텐츠를 만나보세요! 📈

`;

  // 최종 SEO 콘텐츠 조합
  return authoritySection + content + seoServiceSection;
};

// SEO 친화적 슬러그 생성
const createSEOSlug = (title, focusKeyword, category) => {
  // 한글 키워드를 영문으로 매핑
  const keywordMap = {
    '인공지능': 'artificial-intelligence',
    'AI': 'ai',
    '머신러닝': 'machine-learning', 
    '디지털마케팅': 'digital-marketing',
    '마케팅전략': 'marketing-strategy',
    '이커머스': 'ecommerce',
    '온라인쇼핑몰': 'online-shopping',
    '스타트업': 'startup',
    '창업': 'business-startup'
  };

  const categoryMap = {
    'AI': 'ai',
    '마케팅': 'marketing',
    '이커머스': 'ecommerce', 
    '스타트업': 'startup'
  };

  const keywordSlug = keywordMap[focusKeyword] || focusKeyword.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const categorySlug = categoryMap[category] || 'business';
  const timestamp = Date.now().toString().slice(-4);
  
  return `${categorySlug}-${keywordSlug}-guide-${timestamp}`;
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
async function generateSEOBlog() {
  let dbClient = null;
  let aiProvider = 'Unknown';
  
  try {
    console.log('1️⃣ 최신 비즈니스 뉴스 수집 중...');
    
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-SEO-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (rssResponse.statusCode !== 200) {
      throw new Error(`RSS 피드 오류: ${rssResponse.statusCode}`);
    }

    console.log('✅ TechCrunch RSS 수집 완료');

    console.log('2️⃣ SEO 가치 높은 기사 선별 중...');
    
    const items = [];
    const itemMatches = rssResponse.body.match(/<item[^>]*>[\s\S]*?<\/item>/g);

    if (itemMatches) {
      for (const item of itemMatches.slice(0, 20)) {
        const titleMatch = item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || item.match(/<title>([^<]+)<\/title>/);
        const linkMatch = item.match(/<link>([^<]+)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || item.match(/<description>([^<]+)<\/description>/);
        
        if (titleMatch && linkMatch) {
          const title = titleMatch[1];
          const description = descMatch ? descMatch[1] : '';
          
          // SEO 가치 높은 키워드 우선 선별
          const highValueKeywords = [
            'AI', 'artificial intelligence', 'machine learning', 'automation',
            'startup', 'business growth', 'digital marketing', 'ecommerce',
            'data analytics', 'SaaS', 'fintech', 'innovation',
            'investment', 'funding', 'strategy', 'technology'
          ];
          
          const content = (title + ' ' + description).toLowerCase();
          let seoValue = 0;
          const foundKeywords = [];
          
          highValueKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
            const matches = content.match(regex);
            if (matches) {
              // SEO 경쟁도 고려한 점수 계산
              const searchVolume = keyword.length < 5 ? 5 : keyword.length < 10 ? 3 : 2;
              const competition = ['AI', 'marketing', 'business'].includes(keyword) ? 1 : 3;
              seoValue += matches.length * searchVolume * competition;
              foundKeywords.push(keyword);
            }
          });
          
          if (seoValue >= 8) {
            items.push({
              title: title,
              url: linkMatch[1],
              description: description.substring(0, 900),
              seoValue: seoValue,
              foundKeywords: [...new Set(foundKeywords)]
            });
          }
        }
      }
    }

    if (items.length === 0) {
      throw new Error('SEO 가치 높은 기사를 찾을 수 없습니다');
    }

    items.sort((a, b) => b.seoValue - a.seoValue);
    const selectedItem = items[0];
    
    console.log(`✅ SEO 최적 기사 선별: "${selectedItem.title.substring(0, 60)}..."`);
    console.log(`📊 SEO 가치: ${selectedItem.seoValue}점`);
    console.log(`🔍 키워드: ${selectedItem.foundKeywords.slice(0, 5).join(', ')}`);

    // 카테고리 분류
    const category = selectedItem.foundKeywords.some(k => 
      ['AI', 'artificial intelligence', 'machine learning', 'automation'].includes(k)
    ) ? 'AI' :
    selectedItem.foundKeywords.some(k => 
      ['marketing', 'digital marketing'].includes(k)
    ) ? '마케팅' :
    selectedItem.foundKeywords.some(k => 
      ['ecommerce', 'fintech'].includes(k)
    ) ? '이커머스' :
    selectedItem.foundKeywords.some(k => 
      ['startup', 'funding', 'investment'].includes(k)
    ) ? '스타트업' : 'AI';

    console.log(`🎯 분류된 카테고리: ${category}`);

    console.log('3️⃣ SEO 키워드 분석 중...');
    
    const keywords = analyzeSEOKeywords(selectedItem.title, selectedItem.description, category);
    const seoMetadata = generateSEOMetadata(selectedItem, keywords, category);
    
    console.log(`🔑 주요 키워드: ${seoMetadata.focusKeyword}`);
    console.log(`📝 관련 키워드: ${seoMetadata.semanticKeywords.join(', ')}`);

    console.log('4️⃣ AI로 SEO 최적화 콘텐츠 생성 중...');
    
    const seoPrompt = createSEOPrompt(selectedItem, category, seoMetadata);
    const aiResult = await callAI(seoPrompt);
    aiProvider = aiResult.provider;
    
    console.log(`✅ ${aiResult.provider}로 SEO 최적화 콘텐츠 생성 완료`);

    console.log('5️⃣ SEO 데이터 검증 및 최종 처리 중...');
    
    let parsedContent;
    try {
      const jsonMatch = aiResult.content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiResult.content.match(/(\{[\s\S]*?\})/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1].trim();
        parsedContent = JSON.parse(jsonStr);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }

      // SEO 데이터 검증 및 기본값 설정
      parsedContent.title = parsedContent.title || `${seoMetadata.focusKeyword} 완벽 가이드`;
      parsedContent.content = parsedContent.content || aiResult.content.replace(/```json[\s\S]*?```/g, '').trim();
      parsedContent.metaDescription = parsedContent.metaDescription || selectedItem.description.substring(0, 140) + '...';
      parsedContent.tags = parsedContent.tags || [seoMetadata.focusKeyword, category, '그로우썸', '2025'];
      parsedContent.focusKeyword = parsedContent.focusKeyword || seoMetadata.focusKeyword;
      parsedContent.semanticKeywords = parsedContent.semanticKeywords || seoMetadata.semanticKeywords;
      parsedContent.readingTime = parsedContent.readingTime || Math.ceil(parsedContent.content.length / 600) + '분';
      parsedContent.sourceUrl = parsedContent.sourceUrl || selectedItem.url;
      parsedContent.sourceTitle = parsedContent.sourceTitle || selectedItem.title;
      parsedContent.seoScore = parsedContent.seoScore || '85';

    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, SEO 안전 모드로 전환');
      parsedContent = {
        title: `${seoMetadata.focusKeyword} 전문가 가이드: 2025년 최신 트렌드`,
        content: aiResult.content.replace(/```json[\s\S]*?```/g, '').trim(),
        metaDescription: `${seoMetadata.focusKeyword} 전문가가 알려주는 실무 활용법과 최신 트렌드. 지금 바로 확인하세요!`,
        summary: selectedItem.description.substring(0, 160) + '...',
        tags: [seoMetadata.focusKeyword, category, '그로우썸', '2025'],
        category: category,
        focusKeyword: seoMetadata.focusKeyword,
        semanticKeywords: seoMetadata.semanticKeywords,
        readingTime: Math.ceil(aiResult.content.length / 600) + '분',
        sourceUrl: selectedItem.url,
        sourceTitle: selectedItem.title,
        seoScore: '80'
      };
    }

    // SEO 최적화 콘텐츠 생성
    const finalContent = enhanceSEOContent(parsedContent, selectedItem, seoMetadata);
    const slug = createSEOSlug(parsedContent.title, parsedContent.focusKeyword, category);

    const categoryIds = { 'AI': 10, '마케팅': 11, '이커머스': 12, '스타트업': 13 };

    const blogPost = {
      title: parsedContent.title,
      content: finalContent,
      slug: slug,
      category_id: categoryIds[category] || 10,
      meta_title: `${parsedContent.title} | 그로우썸`,
      meta_description: parsedContent.metaDescription,
      author_id: 6,
      status: 'PUBLISHED',
      is_featured: true,
      word_count: finalContent.length,
      reading_time: parsedContent.readingTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log(`✅ SEO 최적화 콘텐츠 준비 완료`);
    console.log(`📝 총 글자수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`🎯 SEO 점수: ${parsedContent.seoScore}점`);
    console.log(`🔑 키워드 밀도: ${parsedContent.keywordDensity || '1.5%'}`);
    console.log(`⏱️ 읽기 시간: ${blogPost.reading_time}`);

    console.log('6️⃣ 데이터베이스 저장 중...');
    
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
    console.log('✅ SEO 최적화 블로그 포스트 저장 완료!');

    console.log('\n🎉 SEO 최적화 블로그 발행 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🤖 AI 제공자: ${aiProvider}`);
    console.log(`📰 제목: ${blogPost.title}`);
    console.log(`🎯 주요 키워드: ${parsedContent.focusKeyword}`);
    console.log(`🔍 관련 키워드: ${parsedContent.semanticKeywords.join(', ')}`);
    console.log(`📂 카테고리: ${category}`);
    console.log(`📝 콘텐츠: ${blogPost.word_count.toLocaleString()}자 (${blogPost.reading_time})`);
    console.log(`📊 SEO 점수: ${parsedContent.seoScore}점`);
    console.log(`🔗 원본: ${selectedItem.url}`);
    console.log(`🚀 발행 링크: https://growsome.kr/blog/${savedPost.slug}`);
    console.log(`🆔 포스트 ID: ${savedPost.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { 
      success: true, 
      blogPost, 
      savedPost, 
      selectedItem, 
      aiProvider,
      seoData: {
        focusKeyword: parsedContent.focusKeyword,
        seoScore: parsedContent.seoScore,
        keywordDensity: parsedContent.keywordDensity || '1.5%'
      }
    };

  } catch (error) {
    console.error('\n❌ SEO 최적화 블로그 생성 오류:', error.message);
    return { success: false, error: error.message };
    
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

// 실행
if (require.main === module) {
  generateSEOBlog()
    .then(result => {
      console.log(result.success ? '\n✅ SEO 최적화 시스템 작업 완료!' : '\n❌ 작업 중 오류 발생');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('시스템 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { generateSEOBlog };