'use client'

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { useAuth } from '../../app/contexts/AuthContext';
import { usePathname } from 'next/navigation';

const ClarityAnalytics = () => {
  const { user, isLoggedIn } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Clarity 초기화
    try {
      Clarity.init("sc5g8v1frb");
      
      // Clarity가 로드될 때까지 잠시 기다린 후 사용
      const checkClarityReady = () => {
        if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
          console.log('Clarity 초기화 완료');
        } else {
          // 100ms 후 다시 확인
          setTimeout(checkClarityReady, 100);
        }
      };
      
      checkClarityReady();
    } catch (error) {
      console.warn('Clarity 초기화 실패:', error);
    }
    
    // 쿠키 동의가 필요한 경우 (GDPR 등)
    // Clarity.consent(true);
    
  }, []);

  // 사용자 인증 상태가 변경될 때마다 식별 정보 업데이트
  useEffect(() => {
    try {
      if (isLoggedIn && user && typeof window !== 'undefined' && typeof window.clarity === 'function') {
        // 로그인한 사용자 식별
        Clarity.identify(
          user.id.toString(), // custom-id
          undefined, // custom-session-id (자동 생성됨)
          pathname, // custom-page-id
          user.username || user.email // friendly-name
        );
        
        // 사용자 타입 태그 설정
        Clarity.setTag("userType", "authenticated");
        Clarity.setTag("userCompany", user.company_name || "unknown");
        Clarity.setTag("userPosition", user.position || "unknown");
        
        // 로그인 이벤트 추적
        Clarity.event("user_logged_in");
      } else if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        // 비로그인 사용자
        Clarity.identify("anonymous", undefined, pathname, "Anonymous User");
        Clarity.setTag("userType", "anonymous");
      }
    } catch (error) {
      console.warn('Clarity 사용자 식별 실패:', error);
    }
  }, [isLoggedIn, user, pathname]);

  // 페이지 변경 시 페이지 ID 업데이트
  useEffect(() => {
    try {
      if (pathname && typeof window !== 'undefined' && typeof window.clarity === 'function') {
        Clarity.setTag("currentPage", pathname);
        Clarity.event("page_viewed");
      }
    } catch (error) {
      console.warn('Clarity 페이지 추적 실패:', error);
    }
  }, [pathname]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
};

export default ClarityAnalytics; 