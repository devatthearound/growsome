'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useState } from 'react'

export default function AuthTestPage() {
  const { user, isLoggedIn, isLoading, logout, refreshAuth } = useAuth()
  const [testResult, setTestResult] = useState<string>('')

  const testAuthAPI = async () => {
    try {
      setTestResult('테스트 중...')
      
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      setTestResult(`
API 응답 (${response.status}):
${JSON.stringify(data, null, 2)}
      `)
    } catch (error) {
      setTestResult(`에러: ${error.message}`)
    }
  }

  const testRefreshToken = async () => {
    try {
      setTestResult('토큰 갱신 테스트 중...')
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      setTestResult(`
토큰 갱신 응답 (${response.status}):
${JSON.stringify(data, null, 2)}
      `)
      
      // 갱신 후 인증 상태 새로고침
      if (data.success) {
        await refreshAuth()
      }
    } catch (error) {
      setTestResult(`에러: ${error.message}`)
    }
  }

  const testLoginAPI = async () => {
    try {
      setTestResult('로그인 테스트 중...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
      
      const data = await response.json()
      
      setTestResult(`
로그인 API 응답 (${response.status}):
${JSON.stringify(data, null, 2)}
      `)
      
      // 로그인 성공 시 인증 상태 새로고침
      if (data.success) {
        await refreshAuth()
      }
    } catch (error) {
      setTestResult(`에러: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">인증 상태 확인 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            인증 시스템 테스트
          </h1>

          {/* 현재 인증 상태 */}
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-3">현재 인증 상태</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">로그인 상태:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  isLoggedIn 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isLoggedIn ? '로그인됨' : '로그인되지 않음'}
                </span>
              </div>
              
              {user && (
                <div className="mt-3">
                  <span className="font-medium">사용자 정보:</span>
                  <pre className="mt-2 p-3 bg-white border rounded text-sm overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 테스트 버튼들 */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={testAuthAPI}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              인증 API 테스트
            </button>
            
            <button
              onClick={testRefreshToken}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              토큰 갱신 테스트
            </button>
            
            <button
              onClick={testLoginAPI}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              로그인 API 테스트
            </button>
            
            <button
              onClick={() => refreshAuth()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              인증 상태 새로고침
            </button>
            
            {isLoggedIn && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                로그아웃
              </button>
            )}
          </div>

          {/* 테스트 결과 */}
          {testResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">테스트 결과</h3>
              <pre className="p-4 bg-gray-800 text-green-400 rounded overflow-auto text-sm">
                {testResult}
              </pre>
            </div>
          )}

          {/* 쿠키 정보 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">현재 쿠키 정보</h3>
            <pre className="p-4 bg-gray-100 rounded overflow-auto text-sm">
              {typeof window !== 'undefined' ? document.cookie || '쿠키 없음' : '서버 사이드'}
            </pre>
          </div>

          {/* 디버그 정보 */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">디버그 정보</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>현재 환경: {process.env.NODE_ENV}</div>
              <div>API 엔드포인트: /api/auth/*</div>
              <div>쿠키 이름: coupas_access_token, coupas_refresh_token</div>
              <div>인증 방식: JWT 토큰 + HTTP-Only 쿠키</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
