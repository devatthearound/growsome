'use client'

import { useEffect } from 'react';
import { useEnhancedGA4 } from '../../hooks/useEnhancedGA4';

export function ErrorTracker() {
  const { trackError } = useEnhancedGA4();

  useEffect(() => {
    // JavaScript 에러 추적
    const handleError = (event: ErrorEvent) => {
      trackError('javascript', event.message, event.filename, {
        line_number: event.lineno,
        column_number: event.colno,
        stack_trace: event.error?.stack?.substring(0, 500) // 스택 트레이스 일부만
      });
    };

    // Promise rejection 에러 추적
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError('javascript', 'Unhandled Promise Rejection', 'promise', {
        reason: event.reason?.toString()?.substring(0, 500)
      });
    };

    // Network 에러 추적 (fetch 래핑)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // HTTP 에러 상태 추적
        if (!response.ok) {
          trackError('network', `HTTP ${response.status}`, args[0]?.toString(), {
            status_code: response.status,
            status_text: response.statusText,
            url: args[0]?.toString()
          });
        }
        
        return response;
      } catch (error: any) {
        // Network 연결 에러 추적
        trackError('network', error.message, args[0]?.toString(), {
          error_name: error.name,
          url: args[0]?.toString()
        });
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
