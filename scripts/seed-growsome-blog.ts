import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGrowsomeBlog() {
  console.log('🌱 그로우썸 블로그 데이터 시딩 시작...');

  try {
    // 1. 기존 블로그 데이터 정리
    await prisma.blog_content_tags.deleteMany();
    await prisma.blog_comments.deleteMany();
    await prisma.blog_likes.deleteMany();
    await prisma.blog_contents.deleteMany();
    await prisma.blog_categories.deleteMany();
    await prisma.blog_tags.deleteMany();

    // 2. 블로그 카테고리 생성
    const categories = await prisma.blog_categories.createMany({
      data: [
        {
          slug: 'business-growth',
          name: '사업성장',
          description: '스타트업과 중소기업의 지속가능한 성장 전략',
          is_visible: true,
          sort_order: 1
        },
        {
          slug: 'ai-technology',
          name: 'AI 기술',
          description: '인공지능과 최신 기술 트렌드',
          is_visible: true,
          sort_order: 2
        },
        {
          slug: 'digital-marketing',
          name: '디지털 마케팅',
          description: '효과적인 온라인 마케팅 전략과 실무 팁',
          is_visible: true,
          sort_order: 3
        },
        {
          slug: 'startup-insights',
          name: '스타트업 인사이트',
          description: '창업과 스타트업 운영에 대한 실무 경험과 조언',
          is_visible: true,
          sort_order: 4
        },
        {
          slug: 'data-analytics',
          name: '데이터 분석',
          description: '비즈니스 데이터 활용과 분석 방법론',
          is_visible: true,
          sort_order: 5
        }
      ]
    });

    // 3. 블로그 태그 생성
    const tags = await prisma.blog_tags.createMany({
      data: [
        { name: 'AI', slug: 'ai' },
        { name: '머신러닝', slug: 'machine-learning' },
        { name: '스타트업', slug: 'startup' },
        { name: '마케팅', slug: 'marketing' },
        { name: '데이터분석', slug: 'data-analysis' },
        { name: 'SEO', slug: 'seo' },
        { name: '성장전략', slug: 'growth-strategy' },
        { name: '디지털전환', slug: 'digital-transformation' },
        { name: '자동화', slug: 'automation' },
        { name: '고객경험', slug: 'customer-experience' },
        { name: '비즈니스모델', slug: 'business-model' },
        { name: '투자', slug: 'investment' },
        { name: '브랜딩', slug: 'branding' },
        { name: '콘텐츠마케팅', slug: 'content-marketing' },
        { name: '웹개발', slug: 'web-development' }
      ]
    });

    // 4. 사용자 확인 (블로그 작성자용)
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
    }

    // 5. 카테고리 ID 가져오기
    const businessGrowthCategory = await prisma.blog_categories.findUnique({ where: { slug: 'business-growth' } });
    const aiTechCategory = await prisma.blog_categories.findUnique({ where: { slug: 'ai-technology' } });
    const digitalMarketingCategory = await prisma.blog_categories.findUnique({ where: { slug: 'digital-marketing' } });
    const startupCategory = await prisma.blog_categories.findUnique({ where: { slug: 'startup-insights' } });
    const dataAnalyticsCategory = await prisma.blog_categories.findUnique({ where: { slug: 'data-analytics' } });

    // 6. 블로그 포스트 생성 (8개의 고품질 포스트)
    const blogPosts = [
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
        category_id: aiTechCategory!.id,
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

<h3>2. 고객 행동 분석</h3>

<p>사용자 여정 매핑을 통해 각 단계별 최적화 포인트를 찾아보세요.</p>

<p>그로우썸과 함께 데이터 기반 성장 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: businessGrowthCategory!.id,
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

<p>그로우썸 전문가들이 여러분의 마케팅 ROI 최적화를 지원합니다.</p>
        `,
        author_id: author.id,
        category_id: digitalMarketingCategory!.id,
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
</ul>

<p><strong>Phase 2: Quick Wins 실행 (2-3개월)</strong></p>
<ul>
<li>온라인 존재감 구축</li>
<li>기본 자동화 도구 도입</li>
<li>고객 소통 채널 디지털화</li>
</ul>

<p>그로우썸과 함께 체계적인 디지털 전환을 시작해보세요.</p>
        `,
        author_id: author.id,
        category_id: businessGrowthCategory!.id,
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

<p>그로우썸은 스타트업의 투자 유치 전 과정을 지원합니다.</p>
        `,
        author_id: author.id,
        category_id: startupCategory!.id,
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

<p><strong>2단계: 데이터 수집 및 정제</strong></p>
<ul>
<li>내부 데이터: 웹 분석, CRM, ERP</li>
<li>외부 데이터: 시장 조사, 경제 지표</li>
</ul>

<p><strong>3단계: 탐색적 데이터 분석</strong></p>
<ul>
<li>세그멘테이션 분석</li>
<li>코호트 분석</li>
<li>퍼넬 분석</li>
</ul>

<h3>분석 도구와 기술 스택</h3>

<p><strong>초급자용</strong></p>
<ul>
<li>Google Analytics 4</li>
<li>Google Data Studio</li>
<li>Excel, Google Sheets</li>
</ul>

<p>그로우썸과 함께 데이터 기반 의사결정 문화를 구축해보세요.</p>
        `,
        author_id: author.id,
        category_id: dataAnalyticsCategory!.id,
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
<li>콘텐츠 목표 설정</li>
<li>고객 여정별 콘텐츠 매핑</li>
<li>타겟 오디언스 정의</li>
</ul>

<p><strong>2단계: 콘텐츠 제작 시스템</strong></p>
<ul>
<li>콘텐츠 캘린더 구축</li>
<li>효율적인 제작 프로세스</li>
<li>품질 관리 체계</li>
</ul>

<p><strong>3단계: 배포 및 확산 전략</strong></p>
<ul>
<li>멀티채널 배포</li>
<li>바이럴 확산 요소</li>
<li>커뮤니티 구축</li>
</ul>

<h3>콘텐츠 성과 측정 및 최적화</h3>

<p><strong>핵심 성과 지표 (KPI)</strong></p>
<ul>
<li>노출: 도달 범위, 조회수</li>
<li>참여: 참여율, 공유율, 댓글</li>
<li>전환: 리드, 가입, 다운로드</li>
<li>매출: 고객 획득, 매출 기여</li>
</ul>

<p>그로우썸과 함께 체계적인 콘텐츠 마케팅 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: digitalMarketingCategory!.id,
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
<li>평균 계약 기간: 연간 계약 선호</li>
<li>의사결정: 조직/위계 중심, 긴 판매 사이클</li>
</ul>

<h3>한국형 SaaS 비즈니스 모델 설계</h3>

<p><strong>1. 한국 고객의 특성 이해</strong></p>
<ul>
<li>안정성: 검증된 솔루션, 레퍼런스 중시</li>
<li>커스터마이징: 기업별 특수 요구사항 반영</li>
<li>관계 중심: 장기적 파트너십, 밀착 지원</li>
<li>ROI 명확성: 구체적인 비용 절감/효율성 증명</li>
</ul>

<p><strong>2. 프라이싱 전략</strong></p>
<ul>
<li>연간 할인 강화: 17-25% 할인으로 장기 계약 유도</li>
<li>초기 도입 지원: 첫 3개월 50% 할인, 무료 셋업</li>
<li>볼륨 디스카운트: 사용자 수 기반 단계별 할인</li>
</ul>

<p>그로우썸과 함께 한국 시장에 최적화된 SaaS 전략을 수립해보세요.</p>
        `,
        author_id: author.id,
        category_id: startupCategory!.id,
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

    // 태그와 포스트 연결을 위한 매핑
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

    // 블로그 포스트 생성
    for (const post of blogPosts) {
      const createdPost = await prisma.blog_contents.create({
        data: post
      });
      console.log(`✅ 블로그 포스트 생성: ${createdPost.title}`);
    }

    // 태그와 블로그 포스트 연결
    const posts = await prisma.blog_contents.findMany();
    const allTags = await prisma.blog_tags.findMany();

    for (const mapping of tagMappings) {
      const post = posts.find(p => p.slug === mapping.postSlug);
      if (post) {
        for (const tagSlug of mapping.tagSlugs) {
          const tag = allTags.find(t => t.slug === tagSlug);
          if (tag) {
            await prisma.blog_content_tags.create({
              data: {
                content_id: post.id,
                tag_id: tag.id
              }
            });
          }
        }
      }
    }

    console.log('🎉 그로우썸 블로그 데이터 시딩 완료!');
    console.log(`📝 생성된 블로그 포스트: ${blogPosts.length}개`);
    console.log(`🏷️ 생성된 태그: ${15}개`);
    console.log(`📂 생성된 카테고리: ${categories.count}개`);

  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  seedGrowsomeBlog()
    .then(() => {
      console.log('✅ 블로그 시딩 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 시딩 실패:', error);
      process.exit(1);
    });
}

export default seedGrowsomeBlog;