// hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react'

interface NetworkStatus {
  isOnline: boolean
  isReconnecting: boolean
  lastOnlineTime: Date | null
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true, // Default to true for SSR
    isReconnecting: false,
    lastOnlineTime: null
  })

  useEffect(() => {
    // Initialize with actual navigator status on client
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }))
    }

    let reconnectTimeout: NodeJS.Timeout

    const handleOnline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        isReconnecting: false,
        lastOnlineTime: new Date()
      }))
    }

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        isReconnecting: true
      }))

      // 네트워크가 다시 연결될 때까지 주기적으로 확인
      const checkConnection = () => {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          handleOnline()
        } else {
          reconnectTimeout = setTimeout(checkConnection, 5000)
        }
      }

      reconnectTimeout = setTimeout(checkConnection, 5000)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [])

  return networkStatus
}
