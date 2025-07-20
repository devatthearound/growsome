// utils/admin.ts
export const ADMIN_EMAILS = [
  'master@growsome.kr',
  'hyunjucho@growsome.kr'
];

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function checkAdminAccess(email: string | null | undefined): { isAdmin: boolean; message?: string } {
  if (!email) {
    return { isAdmin: false, message: '로그인이 필요합니다.' };
  }
  
  const isAdmin = isAdminUser(email);
  if (!isAdmin) {
    return { isAdmin: false, message: '관리자 권한이 필요합니다.' };
  }
  
  return { isAdmin: true };
}