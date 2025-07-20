// components/common/NetworkStatusIndicator.tsx
'use client'

import React from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, isReconnecting } = useNetworkStatus()

  // 온라인 상태일 때는 표시하지 않음
  if (isOnline && !isReconnecting) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium
        ${isOnline ? 'bg-green-600' : 'bg-red-600'}
        ${isReconnecting ? 'animate-pulse' : ''}
      `}>
        {isOnline ? (
          <Wifi size={16} />
        ) : isReconnecting ? (
          <div className="animate-spin">
            <AlertCircle size={16} />
          </div>
        ) : (
          <WifiOff size={16} />
        )}
        
        <span>
          {isOnline 
            ? '연결됨' 
            : isReconnecting 
              ? '재연결 중...' 
              : '인터넷 연결 끊김'
          }
        </span>
      </div>
    </div>
  )
}

export default NetworkStatusIndicator
