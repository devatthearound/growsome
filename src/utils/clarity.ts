import Clarity from '@microsoft/clarity';

// Clarity 이벤트 추적 유틸리티 함수들
export const clarityUtils = {
  // 페이지 뷰 추적
  trackPageView: (pageName?: string) => {
    Clarity.event("page_viewed");
    if (pageName) {
      Clarity.setTag("pageName", pageName);
    }
  },

  // 버튼 클릭 추적
  trackButtonClick: (buttonName: string, buttonLocation?: string) => {
    Clarity.event("button_clicked");
    Clarity.setTag("buttonName", buttonName);
    if (buttonLocation) {
      Clarity.setTag("buttonLocation", buttonLocation);
    }
  },

  // 폼 제출 추적
  trackFormSubmit: (formName: string, success: boolean = true) => {
    Clarity.event("form_submitted");
    Clarity.setTag("formName", formName);
    Clarity.setTag("formSuccess", success.toString());
  },

  // 상품 조회 추적
  trackProductView: (productId: string, productName?: string) => {
    Clarity.event("product_viewed");
    Clarity.setTag("productId", productId);
    if (productName) {
      Clarity.setTag("productName", productName);
    }
  },

  // 구매/결제 추적
  trackPurchase: (amount: number, currency: string = "KRW") => {
    Clarity.event("purchase_completed");
    Clarity.setTag("purchaseAmount", amount.toString());
    Clarity.setTag("purchaseCurrency", currency);
  },

  // 에러 추적
  trackError: (errorType: string, errorMessage?: string) => {
    Clarity.event("error_occurred");
    Clarity.setTag("errorType", errorType);
    if (errorMessage) {
      Clarity.setTag("errorMessage", errorMessage);
    }
  },

  // 사용자 액션 추적
  trackUserAction: (action: string, details?: Record<string, string>) => {
    Clarity.event("user_action");
    Clarity.setTag("action", action);
    if (details) {
      Object.entries(details).forEach(([key, value]) => {
        Clarity.setTag(key, value);
      });
    }
  },

  // 세션 업그레이드 (중요한 세션을 녹화 우선순위로 설정)
  upgradeSession: (reason: string) => {
    Clarity.upgrade(reason);
  },

  // 쿠키 동의 설정
  setConsent: (consent: boolean = true) => {
    Clarity.consent(consent);
  }
};

// 자주 사용되는 이벤트들을 위한 단축 함수들
export const trackHomePageView = () => clarityUtils.trackPageView("home");
export const trackBlogPageView = () => clarityUtils.trackPageView("blog");
export const trackStorePageView = () => clarityUtils.trackPageView("store");
export const trackContactPageView = () => clarityUtils.trackPageView("contact");

export const trackLoginAttempt = (method: string = "email") => {
  clarityUtils.trackUserAction("login_attempt", { method });
};

export const trackSignupAttempt = (method: string = "email") => {
  clarityUtils.trackUserAction("signup_attempt", { method });
};

export const trackNewsletterSignup = () => {
  clarityUtils.trackUserAction("newsletter_signup");
};

export const trackContactFormSubmit = (success: boolean) => {
  clarityUtils.trackFormSubmit("contact", success);
};

export default clarityUtils; 