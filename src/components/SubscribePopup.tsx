'use client'

import { useState, useEffect } from 'react'

export default function SubscribePopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    document.addEventListener('openSubscribe', handleOpen)
    return () => document.removeEventListener('openSubscribe', handleOpen)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // const form = e.target as HTMLFormElement
    // const email = (form.elements.namedItem('email') as HTMLInputElement).value

    try {
      // API 호출 구현
      alert('구독이 완료되었습니다!')
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      alert('구독 처리 중 오류가 발생했습니다.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button 
          className="close-btn" 
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-times" />
        </button>
        <h2>AI 인사이트 구독하기</h2>
        <p>매주 엄선된 AI 트렌드와 인사이트를 받아보세요.</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="이메일 주소를 입력하세요" 
            required 
          />
          <button type="submit" className="submit-btn">
            구독하기
          </button>
        </form>
        <div className="popup-footer">
          <small>* 구독은 언제든 취소할 수 있습니다.</small>
        </div>
      </div>
    </div>
  )
} 