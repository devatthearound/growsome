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
    Clarity.init("sc5g8v1frb");
    
    // 쿠키 동의가 필요한 경우 (GDPR 등)
    // Clarity.consent(true);
    
  }, []);

  // 사용자 인증 상태가 변경될 때마다 식별 정보 업데이트
  useEffect(() => {
    if (isLoggedIn && user) {
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
    } else {
      // 비로그인 사용자
      Clarity.identify("anonymous", undefined, pathname, "Anonymous User");
      Clarity.setTag("userType", "anonymous");
    }
  }, [isLoggedIn, user, pathname]);

  // 페이지 변경 시 페이지 ID 업데이트
  useEffect(() => {
    if (pathname) {
      Clarity.setTag("currentPage", pathname);
      Clarity.event("page_viewed");
    }
  }, [pathname]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
};

export default ClarityAnalytics; 