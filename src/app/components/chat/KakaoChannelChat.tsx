'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Phone, Mail, Clock } from 'lucide-react'

interface KakaoChannelChatProps {
  channelUrl?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  showTooltip?: boolean
  showBadge?: boolean
  customMessage?: string
}

const KakaoChannelChat = ({ 
  channelUrl = 'http://pf.kakao.com/_Lpaln/chat',
  position = 'bottom-right',
  showTooltip = true,
  showBadge = true,
  customMessage = '카카오톡 채널 채팅'
}: KakaoChannelChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // 위치 클래스 매핑
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const openKakaoChat = () => {
    // 카카오톡 채널 채팅 URL로 새 창 열기
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // 모바일: 카카오톡 앱이 있으면 앱으로, 없으면 웹으로
      const kakaoAppUrl = channelUrl.replace('http://pf.kakao.com', 'kakaotalk://plusfriend/chat')
      
      // 앱 실행 시도
      window.location.href = kakaoAppUrl
      
      // 3초 후 앱이 설치되지 않은 경우 웹으로 리다이렉트
      setTimeout(() => {
        window.location.href = channelUrl
      }, 3000)
    } else {
      // 데스크톱: 새 창으로 열기
      const popup = window.open(
        channelUrl,
        'kakao_chat',
        'width=400,height=600,scrollbars=yes,resizable=yes,location=yes'
      )
      
      if (!popup) {
        // 팝업 차단된 경우
        alert('팝업이 차단되었습니다. 팝업을 허용하거나 직접 채팅 링크를 열어주세요.')
        window.open(channelUrl, '_blank')
      }
    }
    
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* 확장된 상태 */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 animate-in slide-in-from-bottom-5">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">그로우썸</h3>
                <p className="text-xs text-gray-500">온라인</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* 메시지 */}
          <div className="mb-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-2">
              <p className="text-sm text-gray-800">
                안녕하세요! 그로우썸입니다. 🌱<br />
                궁금한 점이 있으시면 언제든지 말씀해 주세요!
              </p>
            </div>
            
            {/* 운영시간 안내 */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
              <Clock className="h-3 w-3" />
              <span>평일 09:00 - 18:00 (점심시간 12:00-13:00)</span>
            </div>
          </div>
          
          {/* 버튼들 */}
          <div className="space-y-2">
            <button
              onClick={openKakaoChat}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>카카오톡 채팅 시작</span>
            </button>
            
            {/* 추가 연락처 (선택사항) */}
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open('tel:02-123-4567')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
              >
                <Phone className="h-3 w-3" />
                <span>전화</span>
              </button>
              <button 
                onClick={() => window.open('mailto:master@growsome.kr')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
              >
                <Mail className="h-3 w-3" />
                <span>이메일</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 채팅 버튼 */}
      <div className="relative">
        <button
          onClick={toggleExpanded}
          className="bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative"
          title={customMessage}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
          
          {/* 툴팁 */}
          {showTooltip && !isExpanded && (
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                {customMessage}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </button>
        
        {/* 알림 배지 */}
        {showBadge && !isExpanded && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            1
          </div>
        )}
        
        {/* 펄스 애니메이션 링 */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping"></div>
        )}
      </div>
    </div>
  )
}

export default KakaoChannelChat