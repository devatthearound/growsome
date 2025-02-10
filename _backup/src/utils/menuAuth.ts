import { ACTIVE_MENUS } from '../app/config/menuConfig';

export const checkMenuAuth = (path: string) => {
  // 현재 환경 확인 (development 또는 production)
  const env = (process.env.NODE_ENV || 'development') as 'development' | 'production';
  
  // 해당 환경의 메뉴 설정이 없으면 기본값 사용
  const activeMenus = ACTIVE_MENUS[env] || ACTIVE_MENUS.default;
  
  // 'all'이 포함되어 있으면 모든 메뉴 허용
  if (activeMenus.includes('all')) {
    return true;
  }
  
  const authorizedPaths = [
    '/toyprojects',
    '/toyprojects/affili-smart',
  ];
  
  return authorizedPaths.includes(path);
} 