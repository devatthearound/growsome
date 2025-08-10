'use client'

import { useEffect } from 'react';
import { useEnhancedGA4 } from '../../hooks/useEnhancedGA4';

export function ErrorTracker() {
  const { trackError } = useEnhancedGA4();

  useEffect(() => {
    // JavaScript 에러 추적 - 중요한 에러만 추적
    const handleError = (event: ErrorEvent) => {
      // 개발 환경에서는 자세한 로깅, 프로덕션에서는 중요한 에러만
      const isDev = process.env.NODE_ENV === 'development';
      const isImportantError = event.error && (
        event.message.includes('ChunkLoadError') ||
        event.message.includes('TypeError') ||
        event.message.includes('ReferenceError') ||
        event.error.name === 'TypeError'
      );
      
      if (isDev || isImportantError) {
        console.error('자바스크립트 에러:', event.message, event.filename);
        trackError('javascript', event.message, event.filename, {
          line_number: event.lineno,
          column_number: event.colno,
          stack_trace: event.error?.stack?.substring(0, 500)
        });
      }
    };

    // Promise rejection 에러 추적 - 중요한 것만
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || '';
      
      // 인증 관련 Promise rejection은 제외 (정상적인 로그아웃 플로우)
      if (reason.includes('401') || reason.includes('Unauthorized') || 
          reason.includes('인증') || reason.includes('로그인')) {
        return;
      }
      
      // 중요한 에러만 추적
      if (reason.includes('ChunkLoadError') || reason.includes('fetch') || 
          reason.includes('TypeError') || reason.includes('네트워크')) {
        console.error('처리되지 않은 Promise 거부:', reason.substring(0, 200));
        trackError('javascript', 'Unhandled Promise Rejection', 'promise', {
          reason: reason.substring(0, 500)
        });
      }
    };

    // Network 에러 추적 (fetch 래핑) - 심각한 에러만 추적
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const url = args[0]?.toString() || '';
        
        // 심각한 HTTP 에러만 추적 (500번대 서버 오류)
        if (response.status >= 500) {
          console.error(`서버 오류 발생: ${response.status} - ${url}`);
          trackError('network', `HTTP ${response.status}`, url, {
            status_code: response.status,
            status_text: response.statusText,
            url: url
          });
        } else if (response.status === 401 || response.status === 403) {
          // 인증 관련 에러는 공개 페이지가 아닌 경우에만 로깅
          if (!url.includes('/api/auth/') && !window.location.pathname.startsWith('/login')) {
            console.warn(`인증 오류: ${response.status} - ${url}`);
          }
        }
        
        return response;
      } catch (error: any) {
        const url = args[0]?.toString() || '';
        
        // 네트워크 연결 오류만 추적
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error(`네트워크 연결 오류: ${error.message} - ${url}`);
          trackError('network', '네트워크 연결 실패', url, {
            error_name: error.name,
            url: url
          });
        }
        
        throw error;
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      // 정리
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.fetch = originalFetch;
    };
  }, [trackError]);

  return null;
}
