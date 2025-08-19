'use client'

import { useEffect, useCallback } from 'react';
import { useAuth } from '../../app/contexts/AuthContext';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      target: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: Record<string, any>[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export function EnhancedGoogleAnalytics() {
  const { user, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 사용자 속성 설정
  const setUserProperties = useCallback(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    if (isLoggedIn && user) {
      // 로그인한 사용자의 속성 설정
      window.gtag('config', GA_MEASUREMENT_ID, {
        user_id: user.id.toString(),
        custom_map: {
          custom_parameter_1: 'user_type',
          custom_parameter_2: 'company_name',
          custom_parameter_3: 'position'
        }
      });

      // 사용자 속성 이벤트
      window.gtag('event', 'user_properties', {
        user_type: 'registered',
        company_name: user.company_name || 'unknown',
        position: user.position || 'unknown',
        user_email: user.email || 'unknown'
      });
    } else {
      // 비로그인 사용자
      window.gtag('event', 'user_properties', {
        user_type: 'anonymous'
      });
    }
  }, [isLoggedIn, user]);

  // 페이지 카테고리 분석
  const getPageCategory = useCallback((path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/courses')) return 'courses';
    if (path.startsWith('/pricing')) return 'pricing';
    if (path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/admin')) return 'admin';
    return 'other';
  }, []);

  // 향상된 페이지뷰 추적
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const pageCategory = getPageCategory(pathname);
    
    // 기본 페이지뷰 설정
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: window.location.href,
      page_title: document.title,
      page_path: pathname
    });

    // 향상된 페이지뷰 이벤트
    window.gtag('event', 'enhanced_page_view', {
      page_location: url,
      page_category: pageCategory,
      page_title: document.title,
      user_logged_in: isLoggedIn,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });

    // 사용자 속성 설정
    setUserProperties();

  }, [pathname, searchParams, isLoggedIn, getPageCategory, setUserProperties]);

  // 스크롤 깊이 추적
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    let maxScrollDepth = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }

      // 스크롤 마일스톤 추적
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          window.gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: `${milestone}%`,
            value: milestone,
            page_path: pathname
          });
        }
      });
    };

    const handleBeforeUnload = () => {
      if (maxScrollDepth > 0) {
        window.gtag('event', 'max_scroll_depth', {
          event_category: 'engagement',
          value: maxScrollDepth,
          page_path: pathname
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  // 페이지 체류시간 추적
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // 초 단위

      if (timeSpent > 5) { // 5초 이상 머문 경우만 추적
        window.gtag('event', 'page_timing', {
          event_category: 'engagement',
          name: 'page_view_duration',
          value: timeSpent,
          page_path: pathname,
          custom_parameter: {
            time_spent_seconds: timeSpent,
            time_spent_minutes: Math.round(timeSpent / 60)
          }
        });
      }
    };
  }, [pathname]);

  return null;
}

// 성능 추적을 위한 유틸리티
export const trackPerformance = () => {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  // 페이지 로드 성능 추적
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        window.gtag('event', 'page_performance', {
          event_category: 'performance',
          page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
          first_byte: Math.round(perfData.responseStart - perfData.fetchStart),
          dom_interactive: Math.round(perfData.domInteractive - perfData.fetchStart)
        });
      }

      // Core Web Vitals 추적 (web-vitals 패키지 문제로 임시 비활성화)
      // if ('web-vitals' in window) {
      //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      //     getCLS((metric) => {
      //       window.gtag('event', 'web_vitals', {
      //         event_category: 'performance',
      //         event_label: 'CLS',
      //         value: Math.round(metric.value * 1000)
      //       });
      //     });

      //     getFID((metric) => {
      //       window.gtag('event', 'web_vitals', {
      //         event_category: 'performance',
      //         event_label: 'FID',
      //         value: Math.round(metric.value)
      //       });
      //     });

      //     getFCP((metric) => {
      //       window.gtag('event', 'web_vitals', {
      //         event_category: 'performance',
      //         event_label: 'FCP',
      //         value: Math.round(metric.value)
      //       });
      //     });

      //     getLCP((metric) => {
      //       window.gtag('event', 'web_vitals', {
      //         event_category: 'performance',
      //         event_label: 'LCP',
      //         value: Math.round(metric.value)
      //       });
      //     });

      //     getTTFB((metric) => {
      //       window.gtag('event', 'web_vitals', {
      //         event_category: 'performance',
      //         event_label: 'TTFB',
      //         value: Math.round(metric.value)
      //       });
      //     });
      //   });
      // }
    }, 0);
  });
};
