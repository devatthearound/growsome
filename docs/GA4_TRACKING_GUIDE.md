# GA4 고급 추적 기능 사용 가이드

## 🎯 개요
이 프로젝트에는 GA4(Google Analytics 4)를 활용한 고급 사용자 추적 기능이 구현되어 있습니다. 기본적인 페이지뷰부터 상세한 사용자 행동 분석까지 포괄적인 데이터를 수집할 수 있습니다.

## 🚀 자동으로 추적되는 기능들

### 1. **향상된 페이지뷰 추적**
- 기본 페이지뷰 + 사용자 속성
- 페이지 카테고리 자동 분류
- 화면 해상도, 뷰포트 크기
- 로그인 상태, 리퍼러 정보

### 2. **스크롤 깊이 추적**
- 25%, 50%, 75%, 90%, 100% 지점 자동 추적
- 최대 스크롤 깊이 기록
- 페이지별 참여도 측정

### 3. **페이지 체류시간**
- 실시간 체류시간 측정
- 5초 이상 머문 페이지만 추적
- 분 단위 시간 변환 자동 계산

### 4. **자동 에러 추적**
- JavaScript 런타임 에러
- Promise rejection 에러
- Network 요청 실패 (4xx, 5xx)
- 에러 위치와 스택 트레이스

### 5. **성능 메트릭 추적**
- 페이지 로드 시간
- DOM 준비 시간
- 첫 바이트까지의 시간
- Core Web Vitals (CLS, FID, FCP, LCP, TTFB)

## 📱 수동 추적 사용법

### 기본 훅 가져오기
```tsx
import { useEnhancedGA4 } from '../hooks/useEnhancedGA4';

function MyComponent() {
  const { 
    trackClick, 
    trackFormSubmit, 
    trackAuth, 
    trackEcommerce,
    trackCustomEvent 
  } = useEnhancedGA4();
  
  // 사용 예시들...
}
```

### 1. **버튼/링크 클릭 추적**
```tsx
const handleButtonClick = () => {
  trackClick('subscribe_button', 'button', 'header', {
    promotion: 'new_year_sale',
    discount: 30
  });
};

// 또는 편의 함수 사용
const { trackButtonClick } = useEnhancedGA4();
trackButtonClick('newsletter_signup', 'footer');
```

### 2. **폼 상호작용 추적**
```tsx
const handleFormStart = () => {
  trackFormStart('contact_form');
};

const handleFormSubmit = () => {
  trackFormSubmit('contact_form');
};

const handleFormError = (fieldName: string, errorMessage: string) => {
  trackFormError('contact_form', fieldName, errorMessage);
};
```

### 3. **사용자 인증 추적**
```tsx
// 로그인
const handleLogin = async () => {
  try {
    trackAuth('login', 'email');
    // 로그인 로직...
    trackAuth('login', 'email', true); // 성공
  } catch (error) {
    trackAuth('login', 'email', false, error.message); // 실패
  }
};

// 회원가입
trackAuth('register', 'google', true);
```

### 4. **전자상거래 추적**
```tsx
// 상품 조회
trackEcommerce('view_item', {
  item_id: 'course_123',
  item_name: 'React 마스터 코스',
  item_category: 'programming',
  price: 50000,
  currency: 'KRW'
});

// 구매 완료
trackEcommerce('purchase', 
  {
    item_id: 'course_123',
    item_name: 'React 마스터 코스',
    price: 50000,
    currency: 'KRW'
  },
  {
    transaction_id: 'txn_12345',
    value: 50000,
    tax: 5000
  }
);
```

### 5. **콘텐츠 상호작용 추적**
```tsx
// 블로그 조회
trackBlogView('blog_123', '리액트 훅스 완전 정복');

// 비디오 재생
trackVideoPlay('React 기초 강의 1편', 1200); // 1200초 길이

// 콘텐츠 공유
trackContentInteraction('blog', 'share', 'blog_123', '리액트 훅스 완전 정복');
```

### 6. **검색 추적**
```tsx
trackSearch('리액트 강의', 'course', 15, ['difficulty:beginner', 'price:free']);
```

### 7. **커스텀 이벤트**
```tsx
trackCustomEvent('special_promotion_viewed', {
  promotion_name: '신년 할인 이벤트',
  discount_percentage: 30,
  promotion_location: 'main_banner',
  user_segment: 'returning_customer'
});
```

## 🎬 블로그 전용 추적

블로그 페이지에서 상세한 읽기 패턴을 추적하려면:

```tsx
import { BlogTracking, useBlogInteractions } from '../components/common/BlogTracking';

function BlogPost({ blog }) {
  const { trackBlogShare, trackBlogLike } = useBlogInteractions(blog.id, blog.title);

  return (
    <>
      <BlogTracking
        blogId={blog.id}
        blogTitle={blog.title}
        blogCategory={blog.category}
        author={blog.author}
        publishDate={blog.publishDate}
        readingTime={blog.estimatedReadingTime}
      />
      
      <div>
        {/* 블로그 콘텐츠 */}
        <button onClick={() => trackBlogLike()}>좋아요</button>
        <button onClick={() => trackBlogShare('twitter')}>트위터 공유</button>
      </div>
    </>
  );
}
```

## 🔧 HOC를 활용한 자동 추적

### 클릭 자동 추적
```tsx
import { withClickTracking } from '../components/common/TrackingHOCs';

const TrackedButton = withClickTracking(Button, 'header_cta_button');

// 사용시 자동으로 클릭 이벤트가 GA4로 전송됨
<TrackedButton trackingData={{ campaign: 'summer_sale' }}>
  지금 시작하기
</TrackedButton>
```

### 뷰포트 진입 추적
```tsx
import { withVisibilityTracking } from '../components/common/TrackingHOCs';

const TrackedSection = withVisibilityTracking(PricingSection, 'pricing_section');

// 사용자가 해당 섹션을 보면 자동으로 추적됨
<TrackedSection />
```

## 📊 GA4 대시보드에서 확인할 수 있는 데이터

### 1. **기본 리포트**
- **실시간**: 현재 활성 사용자, 페이지뷰
- **획득**: 사용자 유입 경로, 캠페인 효과
- **참여도**: 페이지별 조회수, 체류시간, 이벤트
- **전환**: 설정된 목표 달성률

### 2. **커스텀 이벤트들**
- `enhanced_page_view`: 향상된 페이지뷰 데이터
- `scroll_depth`: 스크롤 깊이별 사용자 참여도
- `page_timing`: 페이지별 체류시간 분석
- `form_interaction`: 폼 사용 패턴
- `content_interaction`: 콘텐츠 인터랙션
- `blog_reading_progress`: 블로그 읽기 패턴
- `user_authentication`: 로그인/회원가입 패턴
- `error_occurred`: 에러 발생 빈도 및 유형

### 3. **사용자 속성**
- `user_type`: registered / anonymous
- `company_name`: 사용자 회사명
- `position`: 사용자 직책
- `page_category`: 페이지 카테고리

## 🔍 디버깅 및 테스트

### 개발 환경에서 확인
브라우저 개발자 도구 → Console에서 다음 명령어로 테스트:
```javascript
// 테스트 이벤트 전송
gtag('event', 'test_event', { test_parameter: 'test_value' });

// 데이터 레이어 확인
console.log(window.dataLayer);
```

### 실시간 디버그
GA4 대시보드 → 실시간 → 이벤트에서 실시간으로 이벤트 전송 확인 가능

## ⚙️ 설정 방법

1. `.env` 파일에 GA4 측정 ID 설정:
```
NEXT_PUBLIC_GA4_MEASUREMENT_ID='G-487002679'
```

2. Layout에 추적 컴포넌트들이 자동으로 로드됨:
- `EnhancedGoogleAnalytics`: 기본 추적 기능
- `ErrorTracker`: 에러 자동 추적

3. 필요한 페이지에서 훅 사용:
```tsx
import { useEnhancedGA4 } from '../hooks/useEnhancedGA4';
```

## 📈 추천 KPI 설정

GA4 대시보드에서 다음 전환 이벤트들을 설정해보세요:
- `user_register`: 회원가입 완료
- `purchase`: 결제 완료  
- `blog_read_complete`: 블로그 완독
- `course_complete`: 강의 완료
- `newsletter_signup`: 뉴스레터 구독

이렇게 설정하면 사용자의 모든 행동을 상세히 추적하고 분석할 수 있습니다! 🚀
