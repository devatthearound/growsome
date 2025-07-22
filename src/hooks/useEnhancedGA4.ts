import { useCallback } from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export const useEnhancedGA4 = () => {
  const { user, isLoggedIn } = useAuth();
  const pathname = usePathname();

  // 기본 이벤트 추적
  const track = useCallback((
    action: string, 
    category: string, 
    label?: string, 
    value?: number,
    customParameters?: Record<string, any>
  ) => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      page_path: pathname,
      user_logged_in: isLoggedIn,
      user_id: isLoggedIn ? user?.id : null,
      timestamp: Date.now(),
      ...customParameters
    });
  }, [pathname, isLoggedIn, user]);

  // 버튼/링크 클릭 추적
  const trackClick = useCallback((
    elementName: string, 
    elementType: 'button' | 'link' | 'tab' | 'menu',
    location?: string,
    additionalData?: Record<string, any>
  ) => {
    track('click', 'ui_interaction', `${elementType}_${elementName}`, 1, {
      element_name: elementName,
      element_type: elementType,
      element_location: location || 'unknown',
      ...additionalData
    });
  }, [track]);

  // 폼 상호작용 추적
  const trackFormInteraction = useCallback((
    formName: string,
    action: 'start' | 'submit' | 'abandon' | 'error',
    fieldName?: string,
    errorMessage?: string
  ) => {
    track(`form_${action}`, 'form_interaction', formName, 1, {
      form_name: formName,
      form_action: action,
      field_name: fieldName,
      error_message: errorMessage,
      completion_time: action === 'submit' ? Date.now() : undefined
    });
  }, [track]);

  // 검색 추적
  const trackSearch = useCallback((
    searchTerm: string,
    searchType: 'global' | 'blog' | 'course' | 'product',
    resultsCount?: number,
    filterUsed?: string[]
  ) => {
    track('search', 'search_interaction', searchTerm, resultsCount, {
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
      filters_used: filterUsed?.join(',') || 'none',
      search_location: pathname
    });
  }, [track, pathname]);

  // 콘텐츠 상호작용 추적
  const trackContentInteraction = useCallback((
    contentType: 'blog' | 'course' | 'video' | 'pdf' | 'image',
    action: 'view' | 'share' | 'download' | 'like' | 'comment',
    contentId: string,
    contentTitle?: string
  ) => {
    track(`content_${action}`, 'content_interaction', contentTitle || contentId, 1, {
      content_type: contentType,
      content_id: contentId,
      content_title: contentTitle,
      interaction_type: action
    });
  }, [track]);

  // 전자상거래 추적
  const trackEcommerce = useCallback((
    action: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase',
    itemData: {
      item_id: string;
      item_name: string;
      item_category?: string;
      price: number;
      currency?: string;
      quantity?: number;
    },
    transactionData?: {
      transaction_id: string;
      value: number;
      tax?: number;
      shipping?: number;
    }
  ) => {
    const eventData: any = {
      event_category: 'ecommerce',
      currency: itemData.currency || 'KRW',
      items: [{
        item_id: itemData.item_id,
        item_name: itemData.item_name,
        item_category: itemData.item_category || 'unknown',
        price: itemData.price,
        quantity: itemData.quantity || 1
      }]
    };

    if (transactionData) {
      eventData.transaction_id = transactionData.transaction_id;
      eventData.value = transactionData.value;
      eventData.tax = transactionData.tax;
      eventData.shipping = transactionData.shipping;
    } else {
      eventData.value = itemData.price * (itemData.quantity || 1);
    }

    window.gtag('event', action, eventData);
  }, []);

  // 사용자 인증 추적
  const trackAuth = useCallback((
    action: 'login' | 'register' | 'logout' | 'password_reset',
    method?: 'email' | 'google' | 'kakao' | 'naver',
    success?: boolean,
    errorMessage?: string
  ) => {
    track(`user_${action}`, 'authentication', method || 'unknown', success ? 1 : 0, {
      auth_method: method,
      success: success,
      error_message: errorMessage,
      user_type: isLoggedIn ? 'returning' : 'new'
    });
  }, [track, isLoggedIn]);

  // 비디오/미디어 추적
  const trackMedia = useCallback((
    action: 'play' | 'pause' | 'complete' | 'seek' | 'speed_change',
    mediaType: 'video' | 'audio',
    mediaTitle: string,
    currentTime?: number,
    duration?: number,
    playbackRate?: number
  ) => {
    track(`media_${action}`, 'media_interaction', mediaTitle, currentTime, {
      media_type: mediaType,
      media_title: mediaTitle,
      current_time: currentTime,
      duration: duration,
      playback_rate: playbackRate,
      completion_rate: duration ? Math.round((currentTime || 0) / duration * 100) : 0
    });
  }, [track]);

  // 에러 추적
  const trackError = useCallback((
    errorType: 'javascript' | 'network' | 'form_validation' | 'payment' | 'auth',
    errorMessage: string,
    errorLocation?: string,
    additionalContext?: Record<string, any>
  ) => {
    track('error_occurred', 'error', errorType, 1, {
      error_type: errorType,
      error_message: errorMessage,
      error_location: errorLocation || pathname,
      user_agent: navigator.userAgent,
      ...additionalContext
    });
  }, [track, pathname]);

  // 사용자 참여도 추적
  const trackEngagement = useCallback((
    action: 'newsletter_signup' | 'social_share' | 'comment_posted' | 'feedback_given',
    details?: string,
    rating?: number
  ) => {
    track(`engagement_${action}`, 'user_engagement', details, rating, {
      engagement_type: action,
      details: details,
      rating: rating
    });
  }, [track]);

  // 커스텀 이벤트 추적
  const trackCustomEvent = useCallback((
    eventName: string,
    parameters: Record<string, any>
  ) => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    window.gtag('event', eventName, {
      ...parameters,
      page_path: pathname,
      user_logged_in: isLoggedIn,
      timestamp: Date.now()
    });
  }, [pathname, isLoggedIn]);

  return {
    // 기본 추적
    track,
    trackClick,
    trackFormInteraction,
    trackSearch,
    trackContentInteraction,
    
    // 전문 추적
    trackEcommerce,
    trackAuth,
    trackMedia,
    trackError,
    trackEngagement,
    trackCustomEvent,

    // 편의 함수들
    trackButtonClick: (buttonName: string, location?: string) => 
      trackClick(buttonName, 'button', location),
    
    trackLinkClick: (linkName: string, destination?: string) => 
      trackClick(linkName, 'link', undefined, { destination }),
    
    trackFormStart: (formName: string) => 
      trackFormInteraction(formName, 'start'),
    
    trackFormSubmit: (formName: string) => 
      trackFormInteraction(formName, 'submit'),
    
    trackFormError: (formName: string, fieldName: string, errorMessage: string) => 
      trackFormInteraction(formName, 'error', fieldName, errorMessage),
    
    trackPageError: (errorMessage: string, additionalContext?: Record<string, any>) => 
      trackError('javascript', errorMessage, pathname, additionalContext),
    
    trackBlogView: (blogId: string, blogTitle: string) => 
      trackContentInteraction('blog', 'view', blogId, blogTitle),
    
    trackCourseView: (courseId: string, courseTitle: string) => 
      trackContentInteraction('course', 'view', courseId, courseTitle),
    
    trackVideoPlay: (videoTitle: string, duration?: number) => 
      trackMedia('play', 'video', videoTitle, 0, duration),
    
    trackVideoComplete: (videoTitle: string, duration: number) => 
      trackMedia('complete', 'video', videoTitle, duration, duration)
  };
};
