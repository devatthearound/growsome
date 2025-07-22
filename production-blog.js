#!/usr/bin/env node

// 🚀 라이브 배포용 블로그 자동화 스크립트
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 🎯 배포 환경 설정
const PRODUCTION_MODE = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const BASE_URL = PRODUCTION_MODE ? 'https://growsome.kr' : 'http://localhost:3000';

console.log(`🚀 ${PRODUCTION_MODE ? '라이브 배포' : '로컬 테스트'}용 블로그 생성 시작...`);
console.log(`🌐 대상 URL: ${BASE_URL}\n`);

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const payload = {
    channel: '#growsome-alerts',
    username: 'Growsome 봇',
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
      footer: `${PRODUCTION_MODE ? '🌍 라이브' : '💻 로컬'} | Growsome 자동화`,
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

// HTTP 요청 함수 (프로덕션 환경 지원)
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
    
    // RSS 파싱 (한국 독자용 필터링 강화)
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
          
          // 한국 독자에게 더 유용한 키워드로 확장
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

    // 관련성이 가장 높은 기사 선택
    items.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedItem = items[0];
    
    console.log(`✅ RSS 파싱 완료: ${selectedItem.title} (관련도: ${selectedItem.relevanceScore})`);

    console.log('3️⃣ ChatGPT로 블로그 콘텐츠 생성 중...');
    
    // OpenAI API 호출 (더 상세한 프롬프트)
    const openaiPayload = {
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `당신은 Growsome의 전문 테크 블로거입니다. 
        
**미션**: 글로벌 기술 트렌드를 한국 비즈니스 환경에 맞게 해석하고, 실무진이 바로 활용할 수 있는 실용적인 인사이트를 제공합니다.

**글쓰기 원칙**:
- 한국 독자의 비즈니스 관점에서 해석
- 구체적이고 실무적인 조언 포함
- SEO와 가독성을 고려한 구조
- 전문적이면서도 친근한 톤앤매너
- 반드시 유효한 JSON 형식으로만 응답`
      }, {
        role: "user",
        content: `다음 글로벌 기술 뉴스를 한국 독자를 위한 프리미엄 블로그 포스트로 변환해주세요:

**원본 정보:**
- 제목: ${selectedItem.title}
- URL: ${selectedItem.url}  
- 내용: ${selectedItem.description}

**변환 요구사항:**

1. **제목 (title)**: 
   - 50자 내외의 매력적이고 SEO 최적화된 한국어 제목
   - 클릭을 유도하는 호기심 자극 요소 포함

2. **본문 (content)**:
   - 2500-4000자 분량의 마크다운 형식
   - 구조: 도입부(호기심 유발) → 본론(3-4개 섹션) → 결론(실무 액션 플랜)
   - ## 헤딩 사용, 적절한 이모지와 **볼드** 활용
   - 한국 시장 상황과 연결된 인사이트 제공
   - 구체적인 비즈니스 적용 방안 제시

3. **요약 (summary)**: 
   - 150자 내외의 핵심 메시지
   - 메타 디스크립션으로 활용 가능한 수준

4. **태그 (tags)**: 
   - 검색에 유리한 3-5개의 한국어 태그
   - 관련 키워드와 트렌드 반영

5. **카테고리 (category)**:
   - "AI", "마케팅", "스타트업", "데이터", "성장" 중 가장 적합한 것

**응답 형식 (반드시 유효한 JSON):**
\`\`\`json
{
  "title": "제목",
  "content": "마크다운 본문",
  "summary": "요약",
  "tags": ["태그1", "태그2", "태그3"],
  "category": "카테고리명"
}
\`\`\``
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
      throw new Error(`OpenAI API 오류: ${openaiResponse.statusCode} - ${JSON.stringify(openaiResponse.body)}`);
    }

    const aiContent = openaiResponse.body.choices[0].message.content;
    console.log('✅ AI 콘텐츠 생성 완료');

    console.log('4️⃣ 블로그 데이터 처리 중...');
    
    // AI 응답 파싱
    let parsedContent;
    try {
      // JSON 추출 개선
      const jsonMatch = aiContent.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                       aiContent.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('JSON 형식을 찾을 수 없음');
      }
    } catch (parseError) {
      console.warn('⚠️ JSON 파싱 실패, 대체 방법 사용');
      // 대체 파싱 로직
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

    // 카테고리 ID 매핑
    const categoryMap = {
      'AI': 10,
      '마케팅': 11, 
      '스타트업': 12,
      '데이터': 13,
      '성장': 9,
      '기술': 15
    };

    // SEO 친화적 슬러그 생성 (한영 혼합 처리)
    const slug = parsedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60) + '-' + Date.now().toString().slice(-6);

    const blogPost = {
      title: parsedContent.title,
      content: parsedContent.content,
      slug: slug,
      category_id: categoryMap[parsedContent.category] || 15,
      meta_title: parsedContent.title,
      meta_description: parsedContent.summary,
      tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : ['기술'],
      original_url: selectedItem.url,
      is_featured: parsedContent.title.includes('AI') || 
                   parsedContent.title.includes('혁신') || 
                   parsedContent.title.includes('아마존') ||
                   selectedItem.relevanceScore >= 5,
      status: 'published',
      author_id: 1,
      word_count: parsedContent.content.length,
      created_at: new Date().toISOString()
    };

    console.log(`✅ 블로그 데이터 처리 완료 (${blogPost.word_count.toLocaleString()}자)`);

    console.log('5️⃣ JWT 토큰 발급 중...');
    
    // JWT 토큰 발급 (프로덕션 환경 대응)
    const baseUrl = new URL(BASE_URL);
    const tokenResponse = await makeRequest({
      hostname: baseUrl.hostname,
      port: baseUrl.port || (baseUrl.protocol === 'https:' ? 443 : 80),
      path: '/api/auth/generate-token',
      method: 'POST',
      protocol: baseUrl.protocol,
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Growsome-Automation/1.0'
      }
    }, {
      apiKey: 'growsome-n8n-secure-key-2025',
      purpose: 'blog_automation'
    });

    if (tokenResponse.statusCode !== 200) {
      throw new Error(`JWT 토큰 발급 실패: ${tokenResponse.statusCode} - ${JSON.stringify(tokenResponse.body)}`);
    }

    const token = tokenResponse.body.token;
    console.log('✅ JWT 토큰 발급 완료');

    console.log('6️⃣ 블로그 포스트 발행 중...');
    
    // 블로그 포스트 발행
    const publishResponse = await makeRequest({
      hostname: baseUrl.hostname,
      port: baseUrl.port || (baseUrl.protocol === 'https:' ? 443 : 80),
      path: '/api/admin/blog',
      method: 'POST',
      protocol: baseUrl.protocol,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Growsome-Automation/1.0'
      }
    }, blogPost);

    if (publishResponse.statusCode !== 200) {
      throw new Error(`블로그 발행 실패: ${publishResponse.statusCode} - ${JSON.stringify(publishResponse.body)}`);
    }

    console.log('✅ 블로그 포스트 발행 완료!');

    // 성공 알림
    await sendSlackNotification({
      level: 'success',
      title: `${PRODUCTION_MODE ? '🌍 라이브' : '💻 로컬'} 블로그 자동 생성 완료!`,
      message: '새로운 프리미엄 블로그 포스트가 성공적으로 발행되었습니다.',
      details: {
        '제목': blogPost.title,
        '글자 수': `${blogPost.word_count.toLocaleString()}자`,
        '카테고리': parsedContent.category,
        '특집': blogPost.is_featured ? '⭐ 특집글' : '일반글',
        '관련도': `${selectedItem.relevanceScore}점`,
        '링크': `${BASE_URL}/blog/${blogPost.slug}`,
        '원본': selectedItem.url
      }
    });

    console.log('\n🎉 완료! 결과:');
    console.log(`🌐 환경: ${PRODUCTION_MODE ? '라이브 배포' : '로컬 테스트'}`);
    console.log(`📝 제목: ${blogPost.title}`);
    console.log(`📄 글자 수: ${blogPost.word_count.toLocaleString()}자`);
    console.log(`📂 카테고리: ${parsedContent.category} (ID: ${blogPost.category_id})`);
    console.log(`⭐ 특집 여부: ${blogPost.is_featured ? '예' : '아니오'}`);
    console.log(`📊 관련성: ${selectedItem.relevanceScore}점`);
    console.log(`🔗 링크: ${BASE_URL}/blog/${blogPost.slug}`);
    console.log(`📰 원본: ${selectedItem.url}`);

    return { success: true, blogPost, originalItem: selectedItem };

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    
    await sendSlackNotification({
      level: 'error',
      title: `${PRODUCTION_MODE ? '🌍 라이브' : '💻 로컬'} 블로그 자동화 오류`,
      message: `블로그 자동 생성 중 오류가 발생했습니다.`,
      details: {
        '환경': PRODUCTION_MODE ? '라이브' : '로컬',
        '오류': error.message,
        '시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        '조치': '로그 확인 및 재시도 필요'
      }
    });

    return { success: false, error: error.message };
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
