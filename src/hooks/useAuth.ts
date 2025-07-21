// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

// 로컬 스토리지를 사용한 인증 상태 관리
const AUTH_STORAGE_KEY = 'growsome_auth_state';
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5분
let authCheckTimeout: NodeJS.Timeout | null = null;

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
} {
  const [authState, setAuthState] = useState<AuthState>(() => {
    return {
      user: null,
      isLoading: true,
      isLoggedIn: false,
      error: null
    };
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 클라이언트에서만 로컬 스토리지에서 로드
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.user && Date.now() - parsed.timestamp < AUTH_CHECK_INTERVAL) {
            setAuthState({
              user: parsed.user,
              isLoading: false,
              isLoggedIn: true,
              error: null
            });
            return;
          }
        }
      } catch (error) {
        console.warn('로컬 스토리지에서 인증 상태 로드 실패:', error);
      }
    }
  }, []);

  // 인증 상태를 로컬 스토리지에 저장
  const saveAuthState = useCallback((state: AuthState) => {
    if (typeof window !== 'undefined') {
      try {
        if (state.isLoggedIn && state.user) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            user: state.user,
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('로컬 스토리지 저장 실패:', error);
      }
    }
  }, []);

  const updateAuthState = useCallback((newState: AuthState) => {
    setAuthState(newState);
    saveAuthState(newState);
  }, [saveAuthState]);

  const checkAuthStatus = useCallback(async (showError = false) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn && data.user) {
          const newState = {
            user: {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username || data.user.email,
              isAdmin: data.user.isAdmin || false
            },
            isLoading: false,
            isLoggedIn: true,
            error: null
          };
          updateAuthState(newState);
          return;
        }
      }
      
      // 로그인되지 않은 경우
      const newState = {
        user: null,
        isLoading: false,
        isLoggedIn: false,
        error: null
      };
      updateAuthState(newState);
      
    } catch (error: any) {
      console.warn('인증 상태 확인 실패:', error.message);
      
      // 네트워크 에러인 경우 기존 상태 유지
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: showError ? '네트워크 연결을 확인해주세요.' : null
        }));
      } else {
        const newState = {
          user: null,
          isLoading: false,
          isLoggedIn: false,
          error: showError ? '인증 상태 확인에 실패했습니다.' : null
        };
        updateAuthState(newState);
      }
    }
  }, [updateAuthState]);

  // 로그인 함수
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const newState = {
            user: {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username || data.user.email,
              isAdmin: data.user.isAdmin || false
            },
            isLoading: false,
            isLoggedIn: true,
            error: null
          };
          updateAuthState(newState);
          return true;
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorData.message || '로그인에 실패했습니다.'
      }));
      return false;
      
    } catch (error: any) {
      console.error('로그인 에러:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '로그인 중 오류가 발생했습니다.'
      }));
      return false;
    }
  }, [updateAuthState]);

  // 로그아웃 함수
  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.warn('로그아웃 API 호출 실패:', error);
    } finally {
      const newState = {
        user: null,
        isLoading: false,
        isLoggedIn: false,
        error: null
      };
      updateAuthState(newState);
    }
  }, [updateAuthState]);

  // 인증 상태 새로고침
  const refreshAuth = useCallback(async (): Promise<void> => {
    await checkAuthStatus(true);
  }, [checkAuthStatus]);

  useEffect(() => {
    // 초기 로드 시에만 인증 상태 확인 (isMounted가 true가 된 후)
    if (isMounted && authState.isLoading) {
      checkAuthStatus();
    }
    
    // 주기적인 인증 상태 확인 (로그인된 경우에만)
    const setupPeriodicCheck = () => {
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
      
      if (isMounted && authState.isLoggedIn) {
        authCheckTimeout = setTimeout(() => {
          checkAuthStatus();
          setupPeriodicCheck();
        }, AUTH_CHECK_INTERVAL);
      }
    };
    
    setupPeriodicCheck();
    
    return () => {
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
    };
  }, [isMounted, authState.isLoading, authState.isLoggedIn, checkAuthStatus]);

  // 브라우저 탭/윈도우 포커스 시 인증 상태 확인
  useEffect(() => {
    const handleFocus = () => {
      if (authState.isLoggedIn) {
        checkAuthStatus();
      }
    };
    
    const handleOnline = () => {
      if (authState.isLoggedIn && navigator.onLine) {
        checkAuthStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [authState.isLoggedIn, checkAuthStatus]);

  return {
    ...authState,
    login,
    logout,
    refreshAuth
  };
}