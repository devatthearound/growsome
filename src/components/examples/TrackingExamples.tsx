import React from 'react';
import { useEnhancedGA4 } from '../../hooks/useEnhancedGA4';
import { withClickTracking } from '../common/TrackingHOCs';

// 추적이 적용된 버튼 컴포넌트 예시
const TrackedButton = withClickTracking(
  ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  'generic_button'
);

// 사용 예시 컴포넌트
export function TrackingExamples() {
  const { 
    trackFormStart, 
    trackFormSubmit, 
    trackSearch,
    trackAuth,
    trackEcommerce,
    trackMedia,
    trackCustomEvent 
  } = useEnhancedGA4();

  // 로그인 예시
  const handleLogin = async () => {
    try {
      trackAuth('login', 'email', undefined, undefined);
      // 로그인 로직...
      trackAuth('login', 'email', true);
    } catch (error: any) {
      trackAuth('login', 'email', false, error.message);
    }
  };

  // 검색 예시
  const handleSearch = (searchTerm: string) => {
    trackSearch(searchTerm, 'global', undefined, ['category', 'price']);
  };

  // 구매 예시
  const handlePurchase = () => {
    trackEcommerce('purchase', 
      {
        item_id: 'course_123',
        item_name: 'React 마스터 코스',
        item_category: 'programming',
        price: 50000,
        currency: 'KRW'
      },
      {
        transaction_id: 'txn_' + Date.now(),
        value: 50000,
        tax: 5000
      }
    );
  };

  // 비디오 재생 예시
  const handleVideoPlay = () => {
    trackMedia('play', 'video', 'React 기초 강의 1편', 0, 1200);
  };

  // 폼 상호작용 예시
  const handleFormFocus = () => {
    trackFormStart('contact_form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackFormSubmit('contact_form');
  };

  // 커스텀 이벤트 예시
  const handleCustomAction = () => {
    trackCustomEvent('special_promotion_clicked', {
      promotion_name: '신년 할인 이벤트',
      discount_percentage: 30,
      button_location: 'main_banner'
    });
  };

  return (
    <div className="tracking-examples">
      <h2>GA4 추적 기능 예시</h2>
      
      {/* 자동 클릭 추적 버튼 */}
      <TrackedButton 
        trackingName="header_login_button"
        trackingCategory="authentication"
        onClick={handleLogin}
      >
        로그인 (자동 추적)
      </TrackedButton>

      {/* 수동 추적 버튼들 */}
      <button onClick={handleSearch.bind(null, '리액트 강의')}>
        검색 추적 테스트
      </button>

      <button onClick={handlePurchase}>
        구매 추적 테스트
      </button>

      <button onClick={handleVideoPlay}>
        비디오 재생 추적 테스트
      </button>

      <button onClick={handleCustomAction}>
        커스텀 이벤트 추적 테스트
      </button>

      {/* 폼 추적 예시 */}
      <form onSubmit={handleFormSubmit}>
        <input 
          type="email" 
          placeholder="이메일"
          onFocus={handleFormFocus}
        />
        <button type="submit">제출 (폼 추적)</button>
      </form>
    </div>
  );
}
