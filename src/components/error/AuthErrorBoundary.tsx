// components/error/AuthErrorBoundary.tsx
'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface AuthErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

interface AuthErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo)
    
    // 인증 관련 에러인 경우 자동으로 로그아웃 처리
    if (this.isAuthError(error)) {
      this.handleAuthError()
    }
    
    this.setState({
      error,
      errorInfo
    })
  }

  isAuthError = (error: Error): boolean => {
    const authErrorMessages = [
      'unauthorized',
      '401',
      'authentication failed',
      'token expired',
      'invalid token',
      'login required'
    ]
    
    const errorMessage = error.message.toLowerCase()
    return authErrorMessages.some(msg => errorMessage.includes(msg))
  }

  handleAuthError = () => {
    // 로컬 스토리지 클리어
    try {
      localStorage.removeItem('growsome_auth_state')
      sessionStorage.clear()
    } catch (error) {
      console.warn('스토리지 클리어 실패:', error)
    }
    
    // 페이지 새로고침 (선택적)
    setTimeout(() => {
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }, 2000)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isAuthError = this.state.error && this.isAuthError(this.state.error)

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <AlertTriangle 
                size={64} 
                className={`mx-auto ${isAuthError ? 'text-yellow-500' : 'text-red-500'}`} 
              />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {isAuthError ? '인증 오류가 발생했습니다' : '오류가 발생했습니다'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isAuthError 
                ? '로그인 상태를 확인하고 다시 시도해주세요.' 
                : '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  개발자 정보 (클릭하여 펼치기)
                </summary>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                다시 시도
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                홈으로
              </button>
            </div>
            
            {isAuthError && (
              <p className="mt-4 text-sm text-gray-500">
                2초 후 자동으로 홈페이지로 이동됩니다...
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AuthErrorBoundary
