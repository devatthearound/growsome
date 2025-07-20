import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllBlogPosts() {
  console.log('🌱 모든 그로우썸 블로그 포스트 생성 시작...');

  try {
    // 1. 사용자 확인 (블로그 작성자용)
    let author = await prisma.user.findFirst({
      where: { email: 'master@growsome.kr' }
    });

    if (!author) {
      author = await prisma.user.create({
        data: {
          email: 'master@growsome.kr',
          username: '그로우썸 편집팀',
          password: null,
          companyName: '그로우썸',
          position: '편집장',
          phoneNumber: '02-1234-5678',
          status: 'active'
        }
      });
      console.log('✅ 작성자 계정 생성됨');
    }

    // 2. 카테고리 확인/생성
    const categories = await Promise.all([
      prisma.blog_categories.upsert({
        where: { slug: 'business-growth' },
        update: {},
        create: {
          slug: 'business-growth',
          name: '사업성장',
          description: '스타트업과 중소기업의 지속가능한 성장 전략',
          is_visible: true,
          sort_order: 1
        }
      }),
      prisma.blog_categories.upsert({
        where: { slug: 'ai-technology' },
        update: {},
        create: {
          slug: 'ai-technology',
          name: 'AI 기술',
          description: '인공지능과 최신 기술 트렌드',
          is_visible: true,
          sort_order: 2
        }
      }),
      prisma.blog_categories.upsert({
        where: { slug: 'digital-marketing' },
        update: {},
        create: {
          slug: 'digital-marketing',
          name: '디지털 마케팅',
          description: '효과적인 온라인 마케팅 전략과 실무 팁',
          is_visible: true,
          sort_order: 3
        }
      }),
      prisma.blog_categories.upsert({
        where: { slug: 'startup-insights' },
        update: {},
        create: {
          slug: 'startup-insights',
          name: '스타트업 인사이트',
          description: '창업과 스타트업 운영에 대한 실무 경험과 조언',
          is_visible: true,
          sort_order: 4
        }
      }),
      prisma.blog_categories.upsert({
        where: { slug: 'data-analytics' },
        update: {},
        create: {
          slug: 'data-analytics',
          name: '데이터 분석',
          description: '비즈니스 데이터 활용과 분석 방법론',
          is_visible: true,
          sort_order: 5
        }
      })
    ]);

    console.log('✅ 카테고리 준비 완료');

    // 3. 태그 확인/생성
    const tagNames = ['AI', '머신러닝', '스타트업', '마케팅', '데이터분석', 'SEO', '성장전략', '디지털전환', '자동화', '고객경험', '비즈니스모델', '투자', '브랜딩', '콘텐츠마케팅', '웹개발'];
    const tagSlugs = ['ai', 'machine-learning', 'startup', 'marketing', 'data-analysis', 'seo', 'growth-strategy', 'digital-transformation', 'automation', 'customer-experience', 'business-model', 'investment', 'branding', 'content-marketing', 'web-development'];

    for (let i = 0; i < tagNames.length; i++) {
      await prisma.blog_tags.upsert({
        where: { slug: tagSlugs[i] },
        update: {},
        create: {
          name: tagNames[i],
          slug: tagSlugs[i]
        }
      });
    }

    console.log('✅ 태그 준비 완료');

    // 4. 카테고리 ID 가져오기
    const aiTechCat = categories.find(c => c.slug === 'ai-technology');
    const businessGrowthCat = categories.find(c => c.slug === 'business-growth');
    const digitalMarketingCat = categories.find(c => c.slug === 'digital-marketing');
    const startupCat = categories.find(c => c.slug === 'startup-insights');
    const dataAnalyticsCat = categories.find(c => c.slug === 'data-analytics');

    // 5. 전체 블로그 포스트 데이터
    const allBlogPosts = [
      {
        slug: 'ai-powered-business-automation-2025',
        title: '2025년 AI로 변화하는 비즈니스 자동화 트렌드',
        content_body: `
<h2>AI 자동화가 바꾸는 비즈니스 환경</h2>
<p>2025년, 인공지능 기반 자동화는 더 이상 선택이 아닌 필수가 되었습니다. 특히 중소기업과 스타트업에게 AI 자동화는 제한된 리소스로 최대의 효율성을 달성할 수 있는 핵심 전략입니다.</p>

<h3>1. 고객 서비스 자동화</h3>
<p><strong>AI 챗봇과 가상 어시스턴트</strong></p>
<ul>
<li>24시간 고객 응대 가능</li>
<li>FAQ 자동 처리로 상담원 업무 부담 경감</li>
<li>개인화된 고객 경험 제공</li>
<li>다국어 지원으로 글로벌 확장 용이</li>
</ul>

<blockquote>
<p>"AI 챗봇 도입 후 고객 만족도가 35% 향상되었고, 상담 응답 시간이 평균 70% 단축되었습니다." - A사 고객서비스팀</p>
</blockquote>

<h3>2. 마케팅 자동화</h3>
<p><strong>개인화된 마케팅 캠페인</strong></p>
<ul>
<li>고객 행동 데이터 기반 타겟팅</li>
<li>이메일 마케팅 자동화</li>
<li>소셜미디어 콘텐츠 스케줄링</li>
<li>A/B 테스트 자동 실행 및 최적화</li>
</ul>

<p>그로우썸과 함께 여러분의 비즈니스에 맞는 AI 자동화 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: aiTechCat!.id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: true,
        thumbnail_url: '/images/blog/ai-automation-2025.jpg',
        view_count: 1250,
        like_count: 89,
        meta_title: '2025년 AI 비즈니스 자동화 트렌드 | 그로우썸',
        meta_description: 'AI 자동화로 비즈니스 효율성을 극대화하는 방법. 고객 서비스부터 마케팅까지 실무 적용 가이드와 성공 사례를 확인하세요.',
        published_at: new Date('2024-12-01')
      },
      {
        slug: 'startup-growth-strategy-data-driven',
        title: '데이터 기반 스타트업 성장 전략: 숫자로 말하는 성공법칙',
        content_body: `
<h2>데이터가 스타트업 성공의 열쇠인 이유</h2>
<p>많은 스타트업이 "감"에 의존하여 의사결정을 내리다가 실패합니다. 하지만 성공하는 스타트업들은 데이터를 기반으로 한 체계적인 접근을 합니다.</p>

<h3>1. 핵심 지표(KPI) 설정하기</h3>
<p><strong>초기 단계 (PMF 확인)</strong></p>
<ul>
<li><strong>MAU (Monthly Active Users)</strong>: 월간 활성 사용자 수</li>
<li><strong>Retention Rate</strong>: 사용자 유지율 (1일, 7일, 30일)</li>
<li><strong>NPS (Net Promoter Score)</strong>: 고객 만족도</li>
<li><strong>CAC (Customer Acquisition Cost)</strong>: 고객 획득 비용</li>
</ul>

<h3>2. 코호트 분석의 중요성</h3>
<p>동일한 시기에 가입한 사용자 그룹의 행동을 시간별로 추적하여 제품의 진정한 가치를 측정합니다.</p>

<h3>3. 성장 실험 프레임워크</h3>
<p><strong>AARRR 퍼넕 최적화</strong></p>
<ul>
<li><strong>Acquisition</strong>: 고객 획득</li>
<li><strong>Activation</strong>: 활성화</li>
<li><strong>Retention</strong>: 유지</li>
<li><strong>Referral</strong>: 추천</li>
<li><strong>Revenue</strong>: 수익</li>
</ul>

<blockquote>
<p>"데이터 기반 실험을 통해 전환율을 6개월 만에 300% 향상시켰습니다." - B스타트업 대표</p>
</blockquote>

<p>그로우썸과 함께 데이터 기반 성장 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: businessGrowthCat!.id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        thumbnail_url: '/images/blog/data-driven-startup.jpg',
        view_count: 892,
        like_count: 67,
        meta_title: '데이터 기반 스타트업 성장 전략 가이드 | 그로우썸',
        meta_description: '숫자로 증명하는 스타트업 성장법칙. KPI 설정부터 코호트 분석까지, 데이터 드리븐 성장의 모든 것을 알아보세요.',
        published_at: new Date('2024-11-28')
      },
      {
        slug: 'digital-marketing-roi-optimization',
        title: '중소기업을 위한 디지털 마케팅 ROI 극대화 전략',
        content_body: `
<h2>제한된 예산으로 최대 효과를 내는 방법</h2>
<p>중소기업의 마케팅 예산은 한정적입니다. 하지만 올바른 전략과 도구를 활용하면 대기업 못지않은 마케팅 성과를 거둘 수 있습니다.</p>

<h3>1. 마케팅 ROI 계산의 기본</h3>
<p><strong>ROI 공식</strong></p>
<p><strong>마케팅 ROI = (매출 증가분 - 마케팅 비용) / 마케팅 비용 × 100</strong></p>

<h3>2. 채널별 성과 분석 및 최적화</h3>
<p><strong>가성비 높은 마케팅 채널</strong></p>
<ul>
<li><strong>이메일 마케팅</strong>: 평균 ROI 400-500%</li>
<li><strong>SEO</strong>: 평균 ROI 200-300%</li>
<li><strong>구글 애즈</strong>: 평균 ROI 150-250%</li>
<li><strong>콘텐츠 마케팅</strong>: 평균 ROI 300-400%</li>
</ul>

<h3>3. 중소기업 마케팅 성공 사례</h3>
<p><strong>C 제조회사 사례</strong></p>
<ul>
<li>마케팅 예산: 월 300만원</li>
<li>주력 채널: SEO + 콘텐츠 마케팅</li>
<li>6개월 후 결과: 매출 40% 증가, ROI 350%</li>
</ul>

<blockquote>
<p>"체계적인 디지털 마케팅으로 제한된 예산에서도 놀라운 성과를 얻었습니다." - C사 마케팅팀장</p>
</blockquote>

<p>그로우썸 전문가들이 여러분의 마케팅 ROI 최적화를 지원합니다.</p>
        `,
        author_id: author.id,
        category_id: digitalMarketingCat!.id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        thumbnail_url: '/images/blog/digital-marketing-roi.jpg',
        view_count: 756,
        like_count: 54,
        meta_title: '중소기업 디지털 마케팅 ROI 극대화 전략 | 그로우썸',
        meta_description: '제한된 예산으로 최대 마케팅 성과 내는 방법. 채널별 ROI 분석과 실무 적용 가이드, 성공 사례까지 한번에 확인하세요.',
        published_at: new Date('2024-11-25')
      },
      {
        slug: 'small-business-digital-transformation-guide',
        title: '중소기업 디지털 전환 로드맵: 단계별 실행 가이드',
        content_body: `
<h2>디지털 전환, 선택이 아닌 생존의 문제</h2>
<p>코로나19 이후 디지털 전환은 더 이상 대기업만의 이야기가 아닙니다. 중소기업도 디지털 전환 없이는 경쟁에서 살아남기 어려운 시대가 되었습니다.</p>

<h3>1. 디지털 전환이란 무엇인가?</h3>
<p><strong>진정한 디지털 전환의 정의</strong></p>
<p>비즈니스 프로세스, 고객 경험, 조직 문화를 디지털 기술로 근본적으로 변화시켜 경쟁 우위를 확보하는 것</p>

<h3>2. 단계별 디지털 전환 로드맵</h3>
<p><strong>Phase 1: 현황 진단 및 전략 수립 (1-2개월)</strong></p>
<ul>
<li>디지털 성숙도 진단</li>
<li>우선순위 설정</li>
<li>목표 및 KPI 설정</li>
<li>예산 및 리소스 계획</li>
</ul>

<p><strong>Phase 2: Quick Wins 실행 (2-3개월)</strong></p>
<ul>
<li>온라인 존재감 구축 (웹사이트, SNS)</li>
<li>기본 자동화 도구 도입 (CRM, 이메일 마케팅)</li>
<li>고객 소통 채널 디지털화</li>
<li>직원 디지털 교육</li>
</ul>

<p><strong>Phase 3: 핵심 시스템 구축 (3-6개월)</strong></p>
<ul>
<li>ERP/업무 시스템 디지털화</li>
<li>데이터 분석 시스템 구축</li>
<li>고객 경험 최적화</li>
<li>공급망 디지털화</li>
</ul>

<h3>3. 디지털 전환 성공 요인</h3>
<p><strong>D 제조업체 성공 사례</strong></p>
<ul>
<li>투자 규모: 2억원 (18개월)</li>
<li>주요 변화: 제조 공정 IoT화, 온라인 영업 강화</li>
<li>결과: 생산성 25% 향상, 신규 고객 40% 증가</li>
</ul>

<p>그로우썸과 함께 체계적인 디지털 전환을 시작해보세요.</p>
        `,
        author_id: author.id,
        category_id: businessGrowthCat!.id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        thumbnail_url: '/images/blog/digital-transformation.jpg',
        view_count: 634,
        like_count: 42,
        meta_title: '중소기업 디지털 전환 로드맵 완벽 가이드 | 그로우썸',
        meta_description: '중소기업을 위한 단계별 디지털 전환 실행 가이드. 현황 진단부터 시스템 구축까지, 성공 사례와 함께 알아보세요.',
        published_at: new Date('2024-11-22')
      },
      {
        slug: 'startup-funding-preparation-guide',
        title: '스타트업 투자 유치 완벽 가이드: 시드부터 시리즈A까지',
        content_body: `
<h2>투자 유치, 어떻게 준비해야 할까?</h2>
<p>많은 스타트업이 좋은 아이디어와 열정은 있지만, 투자 유치에서 실패합니다. 투자자들이 무엇을 보는지, 어떻게 준비해야 하는지 알아보겠습니다.</p>

<h3>투자 라운드별 특징 이해하기</h3>
<p><strong>Seed 라운드</strong></p>
<ul>
<li>투자 규모: 5-20억원</li>
<li>투자자: 시드 VC, 엔젤</li>
<li>평가 요소: PMF, 초기 트랙션</li>
<li>요구 지표: MAU, 매출 발생</li>
</ul>

<p><strong>Series A 라운드</strong></p>
<ul>
<li>투자 규모: 20-100억원</li>
<li>투자자: 초기 단계 VC</li>
<li>평가 요소: 성장성, 수익성</li>
<li>요구 지표: ARR $1M+, 성장률</li>
</ul>

<h3>투자자가 보는 핵심 요소들</h3>
<p><strong>1. 팀 (40%)</strong></p>
<ul>
<li>도메인 전문성</li>
<li>실행력</li>
<li>상호 보완성</li>
<li>헌신도</li>
</ul>

<p><strong>2. 시장 (30%)</strong></p>
<ul>
<li>시장 규모 (TAM)</li>
<li>성장성</li>
<li>진입 장벽</li>
<li>경쟁 구도</li>
</ul>

<p><strong>3. 제품/서비스 (20%)</strong></p>
<ul>
<li>차별화 요소</li>
<li>기술적 우위</li>
<li>확장성</li>
<li>수익 모델</li>
</ul>

<h3>성공적인 피치덱 구성</h3>
<p><strong>10분 피치덱 필수 요소</strong></p>
<ol>
<li>문제 정의</li>
<li>솔루션 제시</li>
<li>시장 기회</li>
<li>비즈니스 모델</li>
<li>트랙션 및 성과</li>
<li>경쟁 분석</li>
<li>팀 소개</li>
<li>재무 계획</li>
<li>투자 계획</li>
<li>Q&A</li>
</ol>

<blockquote>
<p>"명확한 문제 정의와 검증된 트랙션이 투자 유치의 핵심입니다." - E 벤처캐피탈 대표</p>
</blockquote>

<p>그로우썸은 스타트업의 투자 유치 전 과정을 지원합니다.</p>
        `,
        author_id: author.id,
        category_id: startupCat!.id,
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        thumbnail_url: '/images/blog/startup-funding.jpg',
        view_count: 423,
        like_count: 31,
        meta_title: '스타트업 투자 유치 완벽 가이드 | 시드부터 시리즈A까지',
        meta_description: '성공적인 투자 유치를 위한 단계별 가이드. 피치덱 작성, 투자자 발굴, 협상까지 실전 노하우와 성공 사례를 확인하세요.',
        published_at: new Date('2024-11-20')
      },
      {
        slug: 'data-analytics-business-insights',
        title: '비즈니스 데이터 분석: 인사이트에서 액션까지',
        content_body: `
<h2>데이터는 있는데, 인사이트는 없다?</h2>
<p>많은 기업들이 데이터를 수집하고 있지만, 정작 비즈니스 성장에 도움이 되는 인사이트를 얻지 못하고 있습니다. 수많은 숫자 속에서 진짜 중요한 것을 찾는 방법을 알아보겠습니다.</p>

<h3>비즈니스 데이터 분석 프레임워크</h3>
<p><strong>1단계: 질문 정의</strong></p>
<p>구체적이고 측정 가능한 비즈니스 질문을 먼저 정의하세요.</p>
<ul>
<li>"매출을 늘리려면?" → "어떤 고객 세그먼트가 가장 수익성이 높은가?"</li>
<li>"고객이 왜 떠나지?" → "이탈 고객의 공통 행동 패턴은 무엇인가?"</li>
</ul>

<p><strong>2단계: 데이터 수집 및 정제</strong></p>
<ul>
<li>내부 데이터: 웹 분석, CRM, ERP, POS</li>
<li>외부 데이터: 시장 조사, 경제 지표, 소셜 미디어</li>
<li>데이터 품질 검증: 완정성, 정확성, 일관성</li>
</ul>

<p><strong>3단계: 탐색적 데이터 분석</strong></p>
<ul>
<li>세그멘테이션 분석: 고객/제품/지역별 분류</li>
<li>코호트 분석: 시간별 고객 행동 변화</li>
<li>퍼넷 분석: 고객 여정 최적화 포인트 발견</li>
<li>A/B 테스트: 가설 검증</li>
</ul>

<h3>분석 도구와 기술 스택</h3>
<p><strong>초급자용</strong></p>
<ul>
<li>Google Analytics 4: 웹사이트 분석</li>
<li>Google Data Studio: 대시보드 구축</li>
<li>Excel/Google Sheets: 기본 분석</li>
</ul>

<p><strong>중급자용</strong></p>
<ul>
<li>Tableau: 고급 시각화</li>
<li>Python/R: 통계 분석</li>
<li>SQL: 데이터 추출 및 가공</li>
</ul>

<h3>데이터 기반 의사결정 사례</h3>
<p><strong>F 이커머스 회사 사례</strong></p>
<ul>
<li>문제: 장바구니 이탈률 70%</li>
<li>분석: 결제 단계별 이탈 원인 분석</li>
<li>인사이트: 배송비 표시 시점이 이탈의 주요 원인</li>
<li>액션: 배송비 무료 조건 개선, 결제 UX 최적화</li>
<li>결과: 전환율 35% 향상, 매출 25% 증가</li>
</ul>

<blockquote>
<p>"데이터 분석으로 우리가 놓치고 있던 비즈니스 기회를 발견했습니다." - F사 대표</p>
</blockquote>

<p>그로우썸과 함께 데이터 기반 의사결정 문화를 구축해보세요.</p>
        `,
        author_id: author.id,
        category_id: dataAnalyticsCat!.id,
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        thumbnail_url: '/images/blog/data-analytics.jpg',
        view_count: 312,
        like_count: 28,
        meta_title: '비즈니스 데이터 분석 완벽 가이드 | 인사이트에서 액션까지',
        meta_description: '데이터에서 실행 가능한 인사이트를 도출하는 방법. 분석 프레임워크부터 실전 사례까지, 비즈니스 성장을 위한 데이터 활용법을 알아보세요.',
        published_at: new Date('2024-11-18')
      },
      {
        slug: 'content-marketing-strategy-roi',
        title: '콘텐츠 마케팅으로 ROI 300% 달성하는 전략',
        content_body: `
<h2>콘텐츠 마케팅, 정말 효과가 있을까?</h2>
<p>"콘텐츠가 왕이다"라는 말을 들어보셨죠? 하지만 많은 기업들이 콘텐츠를 만들어도 가시적인 성과를 보지 못하고 있습니다. 어떻게 하면 콘텐츠 마케팅으로 실질적인 비즈니스 성과를 만들 수 있을까요?</p>

<h3>ROI 300% 달성 콘텐츠 전략 프레임워크</h3>
<p><strong>1단계: 전략적 기반 구축</strong></p>
<ul>
<li>콘텐츠 목표 설정: 브랜드 인지도 vs 리드 생성 vs 고객 교육</li>
<li>고객 여정별 콘텐츠 매핑: 인지 → 고려 → 구매 → 충성</li>
<li>타겟 오디언스 정의: 페르소나 기반 콘텐츠 전략</li>
<li>경쟁사 콘텐츠 분석: 차별화 포인트 발견</li>
</ul>

<p><strong>2단계: 콘텐츠 제작 시스템</strong></p>
<ul>
<li>콘텐츠 캘린더 구축: 일관성 있는 발행 스케줄</li>
<li>효율적인 제작 프로세스: 기획 → 제작 → 검토 → 발행</li>
<li>품질 관리 체계: 브랜드 가이드라인 준수</li>
<li>재사용 가능한 콘텐츠: 원소스 멀티유즈</li>
</ul>

<p><strong>3단계: 배포 및 확산 전략</strong></p>
<ul>
<li>멀티채널 배포: 블로그, SNS, 이메일, 유튜브</li>
<li>바이럴 확산 요소: 공유 가치가 있는 콘텐츠</li>
<li>커뮤니티 구축: 팬베이스 형성</li>
<li>인플루언서 협업: 리치 확대</li>
</ul>

<h3>콘텐츠 성과 측정 및 최적화</h3>
<p><strong>핵심 성과 지표 (KPI)</strong></p>
<ul>
<li><strong>노출 지표</strong>: 도달 범위, 조회수, 페이지뷰</li>
<li><strong>참여 지표</strong>: 참여율, 공유율, 댓글, 체류시간</li>
<li><strong>전환 지표</strong>: 리드, 가입, 다운로드, 문의</li>
<li><strong>매출 지표</strong>: 고객 획득, 매출 기여, 고객 생애 가치</li>
</ul>

<h3>콘텐츠 마케팅 성공 사례</h3>
<p><strong>G SaaS 스타트업 사례</strong></p>
<ul>
<li>업종: B2B 마케팅 자동화 툴</li>
<li>콘텐츠 전략: 실무자 대상 가이드 콘텐츠</li>
<li>주요 채널: 블로그, 링크드인, 이메일</li>
<li>투자 규모: 월 200만원 (콘텐츠 제작비)</li>
<li>12개월 후 결과:</li>
<ul>
<li>월간 트래픽: 500% 증가</li>
<li>리드 생성: 월 300개 → 1,500개</li>
<li>고객 획득 비용: 50% 감소</li>
<li>매출 기여: 월 1억원</li>
<li>ROI: 350%</li>
</ul>
</ul>

<h3>콘텐츠 유형별 활용 전략</h3>
<p><strong>블로그 포스트</strong></p>
<ul>
<li>SEO 최적화: 롱테일 키워드 타겟팅</li>
<li>실무 가이드: How-to, 체크리스트, 템플릿</li>
<li>업계 인사이트: 트렌드 분석, 케이스 스터디</li>
</ul>

<p><strong>영상 콘텐츠</strong></p>
<ul>
<li>제품 데모: 기능 소개, 사용법</li>
<li>고객 인터뷰: 성공 사례, 추천사</li>
<li>교육 콘텐츠: 웨비나, 튜토리얼</li>
</ul>

<blockquote>
<p>"체계적인 콘텐츠 마케팅으로 우리 브랜드가 업계 전문가로 인정받게 되었습니다." - G사 마케팅 디렉터</p>
</blockquote>

<p>그로우썸과 함께 체계적인 콘텐츠 마케팅 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: digitalMarketingCat!.id,
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        thumbnail_url: '/images/blog/content-marketing-roi.jpg',
        view_count: 267,
        like_count: 19,
        meta_title: '콘텐츠 마케팅 ROI 300% 달성 전략 완벽 가이드 | 그로우썸',
        meta_description: '콘텐츠 마케팅으로 실질적인 비즈니스 성과를 만드는 방법. 전략 수립부터 성과 측정까지, ROI 300% 달성 노하우를 공개합니다.',
        published_at: new Date('2024-11-15')
      },
      {
        slug: 'saas-business-model-korean-market',
        title: '한국 시장에서 성공하는 SaaS 비즈니스 모델 설계',
        content_body: `
<h2>SaaS, 한국에서도 성공할 수 있을까?</h2>
<p>글로벌 SaaS 시장은 연평균 18% 성장하고 있지만, 한국 시장에서는 여전히 도전적입니다. 구독 결제에 익숙하지 않은 문화, 보수적인 IT 환경, 강력한 로컬 경쟁자들... 이런 장벽을 뛰어넘어 성공하는 SaaS는 어떤 차별점이 있을까요?</p>

<h3>한국 SaaS 시장 현황</h3>
<p><strong>시장 특성</strong></p>
<ul>
<li>시장 규모: $2.1B (2022), 연평균 25% 성장</li>
<li>평균 계약 기간: 연간 계약 선호 (월간 대비 70% 이상)</li>
<li>의사결정: 조직/위계 중심, 긴 판매 사이클 (평균 6-12개월)</li>
<li>주요 도입 분야: HR, 회계, CRM, 협업툴</li>
</ul>

<h3>한국형 SaaS 비즈니스 모델 설계</h3>
<p><strong>1. 한국 고객의 특성 이해</strong></p>
<ul>
<li><strong>안정성 중시</strong>: 검증된 솔루션, 레퍼런스 중시</li>
<li><strong>커스터마이징 요구</strong>: 기업별 특수 요구사항 반영</li>
<li><strong>관계 중심</strong>: 장기적 파트너십, 밀착 지원</li>
<li><strong>ROI 명확성</strong>: 구체적인 비용 절감/효율성 증명</li>
</ul>

<p><strong>2. 현지화 전략</strong></p>
<ul>
<li><strong>한국어 완전 지원</strong>: UI/UX, 문서, 고객지원</li>
<li><strong>한국 비즈니스 관행 반영</strong>: 전자세금계산서, 법인카드 결제</li>
<li><strong>규제 준수</strong>: 개인정보보호법, 전자금융거래법</li>
<li><strong>로컬 파트너십</strong>: 시스템 통합업체, 컨설팅 회사</li>
</ul>

<p><strong>3. 프라이싱 전략</strong></p>
<ul>
<li><strong>연간 할인 강화</strong>: 17-25% 할인으로 장기 계약 유도</li>
<li><strong>초기 도입 지원</strong>: 첫 3개월 50% 할인, 무료 셋업</li>
<li><strong>볼륨 디스카운트</strong>: 사용자 수 기반 단계별 할인</li>
<li><strong>유연한 결제</strong>: 법인카드, 계좌이체, 후불 결제</li>
</ul>

<h3>한국 SaaS 성공 사례</h3>
<p><strong>H 협업툴 사례</strong></p>
<ul>
<li><strong>현지화 포인트</strong>: 메신저 중심 UI, 한국 업무 문화 반영</li>
<li><strong>영업 전략</strong>: 레퍼런스 고객 우선 확보, 입소문 마케팅</li>
<li><strong>고객 성공</strong>: 전담 CSM, 24시간 한국어 지원</li>
<li><strong>성과</strong>: 3년 만에 MAR 50억원 달성, 업계 1위</li>
</ul>

<h3>고객 성공(Customer Success) 전략</h3>
<p><strong>온보딩 최적화</strong></p>
<ul>
<li>도입 컨설팅: 무료 설정 지원</li>
<li>교육 프로그램: 사용자 교육, 관리자 교육</li>
<li>성과 측정: ROI 리포트 제공</li>
</ul>

<p><strong>고객 유지 관리</strong></p>
<ul>
<li>정기 건강 체크: 사용률 모니터링</li>
<li>업그레이드 제안: 성장에 맞는 플랜 제안</li>
<li>커뮤니티 구축: 사용자 모임, 베스트 프랙티스 공유</li>
</ul>

<h3>성장 전략 로드맵</h3>
<p><strong>1단계: PMF 달성 (0-12개월)</strong></p>
<ul>
<li>초기 고객 10-20개 확보</li>
<li>제품 현지화 완성</li>
<li>기본 고객 지원 체계 구축</li>
</ul>

<p><strong>2단계: 확장 (12-24개월)</strong></p>
<ul>
<li>연 매출 10억원 달성</li>
<li>영업팀 구성</li>
<li>파트너 채널 구축</li>
</ul>

<p><strong>3단계: 시장 주도 (24개월+)</strong></p>
<ul>
<li>업계 Top 3 진입</li>
<li>연 매출 100억원 달성</li>
<li>해외 진출 검토</li>
</ul>

<blockquote>
<p>"한국 시장의 특성을 깊이 이해하고 현지화에 집중한 결과, 글로벌 경쟁사들을 제치고 시장을 선도할 수 있었습니다." - H사 대표</p>
</blockquote>

<p>그로우썸과 함께 한국 시장에 최적화된 SaaS 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: startupCat!.id,
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        thumbnail_url: '/images/blog/saas-korea-market.jpg',
        view_count: 189,
        like_count: 15,
        meta_title: '한국 시장 성공 SaaS 비즈니스 모델 설계 가이드 | 그로우썸',
        meta_description: '한국 특화 SaaS 비즈니스 모델 설계 방법. 현지화 전략부터 고객 성공까지, 한국 시장에서 성공하는 SaaS의 모든 것을 알아보세요.',
        published_at: new Date('2024-11-12')
      }
    ];

    // 6. 블로그 포스트 생성 (upsert 사용)
    console.log('\n📝 블로그 포스트 생성 중...');
    
    for (let i = 0; i < allBlogPosts.length; i++) {
      const post = allBlogPosts[i];
      
      try {
        const createdPost = await prisma.blog_contents.upsert({
          where: { slug: post.slug },
          update: {
            title: post.title,
            content_body: post.content_body,
            status: post.status,
            is_featured: post.is_featured,
            is_hero: post.is_hero,
            thumbnail_url: post.thumbnail_url,
            view_count: post.view_count,
            like_count: post.like_count,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            published_at: post.published_at
          },
          create: post
        });
        
        console.log(`✅ [${i + 1}/8] ${createdPost.title}`);
        
      } catch (error) {
        console.error(`❌ [${i + 1}/8] 포스트 생성 실패: ${post.title}`, error.message);
      }
    }

    // 7. 태그 연결
    console.log('\n🏷️ 태그 연결 중...');
    
    const tagMappings = [
      { postSlug: 'ai-powered-business-automation-2025', tagSlugs: ['ai', 'automation', 'digital-transformation'] },
      { postSlug: 'startup-growth-strategy-data-driven', tagSlugs: ['startup', 'data-analysis', 'growth-strategy'] },
      { postSlug: 'digital-marketing-roi-optimization', tagSlugs: ['marketing', 'seo', 'data-analysis'] },
      { postSlug: 'small-business-digital-transformation-guide', tagSlugs: ['digital-transformation', 'business-model'] },
      { postSlug: 'startup-funding-preparation-guide', tagSlugs: ['startup', 'investment'] },
      { postSlug: 'data-analytics-business-insights', tagSlugs: ['data-analysis', 'business-model'] },
      { postSlug: 'content-marketing-strategy-roi', tagSlugs: ['content-marketing', 'marketing', 'seo'] },
      { postSlug: 'saas-business-model-korean-market', tagSlugs: ['startup', 'business-model'] }
    ];

    const posts = await prisma.blog_contents.findMany();
    const allTags = await prisma.blog_tags.findMany();

    for (const mapping of tagMappings) {
      const post = posts.find(p => p.slug === mapping.postSlug);
      if (post) {
        // 기존 태그 연결 삭제
        await prisma.blog_content_tags.deleteMany({
          where: { content_id: post.id }
        });
        
        // 새로운 태그 연결 생성
        for (const tagSlug of mapping.tagSlugs) {
          const tag = allTags.find(t => t.slug === tagSlug);
          if (tag) {
            await prisma.blog_content_tags.upsert({
              where: {
                content_id_tag_id: {
                  content_id: post.id,
                  tag_id: tag.id
                }
              },
              update: {},
              create: {
                content_id: post.id,
                tag_id: tag.id
              }
            });
          }
        }
      }
    }

    // 8. 최종 결과 확인
    const finalPostCount = await prisma.blog_contents.count();
    const publishedCount = await prisma.blog_contents.count({ 
      where: { status: 'PUBLISHED' } 
    });

    console.log('\n🎉 그로우썸 블로그 시딩 완료!');
    console.log(`📝 총 블로그 포스트: ${finalPostCount}개`);
    console.log(`✅ 게시된 포스트: ${publishedCount}개`);
    console.log(`🏷️ 총 태그: ${allTags.length}개`);
    console.log(`📂 총 카테고리: ${categories.length}개`);

    console.log('\n🔗 생성된 블로그 포스트 URL:');
    for (let i = 0; i < allBlogPosts.length; i++) {
      console.log(`${i + 1}. http://localhost:3001/blog/${allBlogPosts[i].slug}`);
    }

  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  seedAllBlogPosts()
    .then(() => {
      console.log('\n✅ 모든 블로그 포스트 생성 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 시딩 실패:', error);
      process.exit(1);
    });
}

export default seedAllBlogPosts;