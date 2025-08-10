'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  slug: string;
  company_name?: string;
  position?: string;
  phone_number?: string;
  profileImage?: string;
  role: string;
  canWriteContent: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
  refreshAuth: async () => {},
});

// 인증이 필요하지 않은 공개 페이지들
const PUBLIC_PAGES = [
  '/diagnosis',
  '/services',
  '/courses',
  '/',
  '/blog',
  '/login',
  '/signup'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // 현재 페이지가 공개 페이지인지 확인
  const isPublicPage = PUBLIC_PAGES.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  );

  useEffect(() => {
    // 공개 페이지인 경우 인증 체크를 건너뛰고 로딩만 false로 설정
    if (isPublicPage) {
      setIsLoading(false);
      return;
    }
    
    checkAuthStatus();
  }, [isPublicPage]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      console.log('인증 상태 확인 시작...');
      
      // 인증 상태 확인 API 호출
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('인증 API 응답:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('인증 성공:', data.user?.email || '알 수 없는 사용자');
        
        if (data.isLoggedIn && data.user) {
          // 사용자 데이터 변환 (DB 필드명 → 인터페이스 필드명)
          const transformedUser: User = {
            id: data.user.id?.toString(),
            email: data.user.email,
            username: data.user.username || data.user.name,
            slug: data.user.slug || createSlugFromUsername(data.user.username || data.user.name),
            company_name: data.user.company_name,
            position: data.user.position,
            phone_number: data.user.phone_number,
            profileImage: data.user.profileImage || data.user.avatar,
            role: data.user.role || 'user',
            canWriteContent: data.user.canWriteContent || true
          };
          
          setUser(transformedUser);
        } else {
          setUser(null);
        }
      } else {
        // 인증 실패 - 공개 페이지가 아닌 경우에만 에러 로깅
        if (!isPublicPage) {
          console.log('인증 실패 - 로그인이 필요합니다');
        }
        
        setUser(null);
        
        // 401인 경우 토큰 갱신 시도 (공개 페이지가 아닌 경우에만)
        if (response.status === 401 && !isPublicPage) {
          console.log('토큰 갱신 시도...');
          const refreshSuccess = await attemptTokenRefresh();
          if (!refreshSuccess) {
            console.log('토큰 갱신 실패 - 로그인 페이지로 이동이 필요할 수 있습니다');
          }
        }
      }
    } catch (error) {
      // 네트워크 오류인 경우에만 에러 로깅 (공개 페이지가 아닌 경우)
      if (!isPublicPage && error instanceof TypeError && error.message.includes('fetch')) {
        console.error('네트워크 오류 - 서버 연결을 확인해주세요:', error.message);
      } else if (!isPublicPage) {
        console.error('인증 체크 중 예상치 못한 오류:', error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const attemptTokenRefresh = async (): Promise<boolean> => {
    try {
      console.log('토큰 갱신 시도...');
      
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        
        if (data.success && data.user) {
          console.log('토큰 갱신 성공');
          
          // 갱신된 사용자 정보 즉시 설정
          const transformedUser: User = {
            id: data.user.id?.toString(),
            email: data.user.email,
            username: data.user.username || data.user.name,
            slug: data.user.slug || createSlugFromUsername(data.user.username || data.user.name),
            company_name: data.user.company_name,
            position: data.user.position,
            phone_number: data.user.phone_number,
            profileImage: data.user.profileImage || data.user.avatar,
            role: data.user.role || 'user',
            canWriteContent: data.user.canWriteContent || true
          };
          
          setUser(transformedUser);
          return true;
        }
      } else {
        console.log('토큰 갱신 실패 - 다시 로그인이 필요합니다');
      }
      
      return false;
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      return false;
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // 로그아웃 API 호출
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // API 응답과 관계없이 로컬 상태 클리어
      setUser(null);
      
      // 로그아웃 후 홈페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // 에러가 발생해도 로컬 상태는 클리어
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      isLoading,
      setUser, 
      logout,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 유틸리티 함수: 사용자명에서 슬러그 생성
function createSlugFromUsername(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const useAuth = () => useContext(AuthContext);
