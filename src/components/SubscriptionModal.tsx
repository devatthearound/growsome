'use client'

import { useState } from 'react'
import { X, Mail, Check, Loader2 } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setEmail('')
          setMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || '구독에 실패했습니다.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('네트워크 오류가 발생했습니다.')
    }
  }

  const handleClose = () => {
    onClose()
    setStatus('idle')
    setEmail('')
    setMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            📧 뉴스레터 구독
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              구독 완료!
            </h4>
            <p className="text-green-600">{message}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                <strong>Growsome</strong>의 최신 인사이트와 개발 팁을 이메일로 받아보세요! 
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📝 무엇을 받게 되나요?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 주간 개발 인사이트</li>
                  <li>• 새로운 블로그 글 알림</li>
                  <li>• 독점 개발 팁과 트릭</li>
                  <li>• 프로젝트 업데이트</li>
                </ul>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 주소
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={status === 'loading'}
                />
              </div>
              
              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{message}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>구독 중...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>무료로 구독하기</span>
                  </>
                )}
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              스팸은 절대 보내지 않으며, 언제든지 구독을 취소할 수 있습니다.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
