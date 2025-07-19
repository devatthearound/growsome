'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const data = await response.json();
        console.log('인증 데이터:', data);
        
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
          
          console.log('사용자 로그인 성공:', transformedUser.email);
          setUser(transformedUser);
        } else {
          console.log('사용자 데이터 없음');
          setUser(null);
        }
      } else {
        // 인증 실패
        const errorData = await response.text();
        console.log('인증 실패:', {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });
        
        setUser(null);
        
        // 401인 경우 토큰 갱신 시도
        if (response.status === 401) {
          console.log('토큰 갱신 시도...');
          await attemptTokenRefresh();
        }
      }
    } catch (error) {
      console.error('인증 체크 중 오류:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      console.log('토큰 갱신 API 호출...');
      
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('토큰 갱신 응답:', {
        status: refreshResponse.status,
        ok: refreshResponse.ok
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        console.log('토큰 갱신 데이터:', data);
        
        if (data.success) {
          console.log('토큰 갱신 성공, 인증 상태 재확인...');
          // 토큰 갱신 성공 시 인증 상태 다시 확인
          await checkAuthStatus();
        }
      } else {
        const errorData = await refreshResponse.text();
        console.log('토큰 갱신 실패:', {
          status: refreshResponse.status,
          body: errorData
        });
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
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
