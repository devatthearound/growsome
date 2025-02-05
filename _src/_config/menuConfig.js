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
    '/consulting'
  ],  // 개발환경: 모든 메뉴 + 명시적 경로 추가
  production: ['/services', '/store'],  // 프로덕션: 특정 메뉴만 활성화
  // 기본값 추가
  default: []
}; 