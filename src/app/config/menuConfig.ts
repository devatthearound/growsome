export const ACTIVE_MENUS = {
  development: [
    'all', 
    '/home',
    '/toy-projects',
    '/toy-projects/affili-smart',  // AffiliSmart 경로 추가
    '/auth',
    '/signup',
    '/mypage',
    '/payment',
    '/consulting',
    '/doasome'  // 두어썸 페이지 추가
  ],  // 개발환경: 모든 메뉴 + 명시적 경로 추가
  production: ['/services', '/store', '/doasome'],  // 프로덕션: 두어썸 페이지 추가
  // 기본값 추가
  default: []
}; 