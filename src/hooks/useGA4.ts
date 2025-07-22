import { useCallback } from 'react';
import { trackEvent, trackUserAction } from '../components/common/GoogleAnalytics';

export const useGA4 = () => {
  // 일반적인 이벤트 추적
  const track = useCallback((
    action: string, 
    category: string, 
    label?: string, 
    value?: number
  ) => {
    trackEvent(action, category, label, value);
  }, []);

  // 사용자 액션 추적
  const trackAction = useCallback((action: string, parameters?: Record<string, any>) => {
    trackUserAction(action, parameters);
  }, []);

  // 특정 이벤트들을 위한 편의 함수들
  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    track('click', 'button', buttonName);
    trackAction('button_click', { button_name: buttonName, location });
  }, [track, trackAction]);

  const trackFormSubmit = useCallback((formName: string) => {
    track('submit', 'form', formName);
    trackAction('form_submit', { form_name: formName });
  }, [track, trackAction]);

  const trackDownload = useCallback((fileName: string, fileType?: string) => {
    track('download', 'file', fileName);
    trackAction('file_download', { file_name: fileName, file_type: fileType });
  }, [track, trackAction]);

  const trackLogin = useCallback((method: string) => {
    track('login', 'user', method);
    trackAction('user_login', { login_method: method });
  }, [track, trackAction]);

  const trackSignup = useCallback((method: string) => {
    track('sign_up', 'user', method);
    trackAction('user_signup', { signup_method: method });
  }, [track, trackAction]);

  const trackPurchase = useCallback((
    transactionId: string, 
    value: number, 
    currency: string = 'KRW'
  ) => {
    track('purchase', 'ecommerce', transactionId, value);
    trackAction('purchase', { 
      transaction_id: transactionId, 
      value, 
      currency 
    });
  }, [track, trackAction]);

  const trackSearch = useCallback((searchTerm: string, category?: string) => {
    track('search', 'content', searchTerm);
    trackAction('search', { search_term: searchTerm, category });
  }, [track, trackAction]);

  return {
    track,
    trackAction,
    trackButtonClick,
    trackFormSubmit,
    trackDownload,
    trackLogin,
    trackSignup,
    trackPurchase,
    trackSearch,
  };
};
