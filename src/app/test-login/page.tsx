'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@growsome.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  
  const { user, isLoggedIn, refreshAuth } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      console.log('로그인 시도:', { email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          rememberMe: true
        })
      })

      const data = await response.json()
      
      console.log('로그인 응답:', data)
      
      setResult(`
Status: ${response.status}
Response: ${JSON.stringify(data, null, 2)}
      `)

      if (response.ok && data.success) {
        // 로그인 성공 시 AuthContext 새로고침
        await refreshAuth()
      }
      
    } catch (error) {
      console.error('로그인 에러:', error)
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuthCheck = async () => {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })

      const data = await response.json()
      
      setResult(`
Auth Check Status: ${response.status}
Response: ${JSON.stringify(data, null, 2)}
      `)
      
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearCookies = () => {
    document.cookie = "coupas_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "coupas_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setResult('쿠키 삭제됨')
    refreshAuth()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">로그인 테스트</h1>

          {/* 현재 상태 */}
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">현재 상태</h2>
            <div className="space-y-1 text-sm">
              <div>로그인: <span className={isLoggedIn ? 'text-green-600' : 'text-red-600'}>
                {isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃됨'}
              </span></div>
              {user && (
                <div>사용자: {user.username} ({user.email})</div>
              )}
            </div>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          {/* 테스트 버튼들 */}
          <div className="mb-6 space-y-2">
            <button
              onClick={testAuthCheck}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              인증 상태 확인
            </button>
            
            <button
              onClick={clearCookies}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              쿠키 삭제 (로그아웃)
            </button>
          </div>

          {/* 테스트 계정 정보 */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold mb-2 text-yellow-800">테스트 계정</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>📧 이메일: admin@growsome.com 또는 test@example.com</div>
              <div>🔑 비밀번호: password123</div>
            </div>
          </div>

          {/* 결과 */}
          {result && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">결과</h3>
              <pre className="p-4 bg-gray-800 text-green-400 rounded overflow-auto text-xs">
                {result}
              </pre>
            </div>
          )}

          {/* 현재 쿠키 */}
          <div>
            <h3 className="font-semibold mb-2">현재 쿠키</h3>
            <pre className="p-4 bg-gray-100 rounded overflow-auto text-xs">
              {typeof window !== 'undefined' ? document.cookie || '쿠키 없음' : '서버사이드'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
