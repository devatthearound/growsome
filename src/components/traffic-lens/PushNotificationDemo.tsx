'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PushNotificationDemo() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [domainId, setDomainId] = useState<number | null>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true);
    
    // 브라우저 지원 확인
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
    // 도메인 목록 가져오기
    fetchDomains();
  }, []);

  // 도메인 목록 가져오기
  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/traffic-lens/domains');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setDomains(data.data);
          setDomainId(data.data[0].id); // 첫 번째 도메인을 기본값으로
          setSelectedDomain(data.data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setIsSubscribed(true);
        setSubscription(existingSubscription);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request permission:', error);
      return false;
    }
  };

  const subscribeToNotifications = async () => {
    if (!isSupported) {
      setMessage('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 권한 요청
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setMessage('푸시 알림 권한이 거부되었습니다.');
        setLoading(false);
        return;
      }

      // 서비스 워커 등록
      const registration = await navigator.serviceWorker.register('/sw.js');
      await registration.update();

      // VAPID 공개 키 가져오기
      const selectedDomainData = domains.find(d => d.id === domainId);
      const vapidPublicKey = selectedDomainData?.vapidPublicKey || 'BMqzTzVwMFGsBOKMBzQ-ScsP-2KGP3hCEYqTlM0dGO8Ai9NN9Dh1QQ7Y1RrIaLl0kP7HH8jqy9d4mDh6hBwD6tE';
      
      if (!vapidPublicKey) {
        throw new Error('선택된 도메인에 VAPID 키가 설정되지 않았습니다.');
      }
      
      // 구독 생성
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // 서버에 구독 정보 전송
      if (!domainId) {
        throw new Error('도메인이 선택되지 않았습니다.');
      }
      
      const response = await fetch('/api/traffic-lens/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: domainId,
          endpoint: newSubscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(newSubscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(newSubscription.getKey('auth')!)
          },
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        setIsSubscribed(true);
        setSubscription(newSubscription);
        setMessage('푸시 알림 구독이 완료되었습니다! 🎉');
      } else {
        throw new Error('서버 등록 실패');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setMessage('구독 중 오류가 발생했습니다: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!subscription) return;

    setLoading(true);
    try {
      await subscription.unsubscribe();
      setIsSubscribed(false);
      setSubscription(null);
      setMessage('푸시 알림 구독이 해제되었습니다.');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setMessage('구독 해제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    if (!isSubscribed) {
      setMessage('먼저 푸시 알림을 구독해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 테스트 캠페인 생성 및 발송
      const campaignResponse = await fetch('/api/traffic-lens/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: domainId || 1,
          title: '🚀 Traffic-Lens 테스트 알림',
          body: '축하합니다! 푸시 알림이 정상적으로 작동하고 있습니다.',
          iconUrl: '/logo_growsome.png',
          clickUrl: window.location.href,
          targetType: 'all'
        })
      });

      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json();
        
        // 캠페인 발송
        const sendResponse = await fetch(`/api/traffic-lens/campaigns/${campaignData.data.id}/send`, {
          method: 'POST'
        });

        if (sendResponse.ok) {
          setMessage('테스트 알림이 발송되었습니다! 잠시 후 알림을 확인해보세요.');
        } else {
          throw new Error('알림 발송 실패');
        }
      } else {
        throw new Error('캠페인 생성 실패');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setMessage('테스트 알림 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const StatusIcon = () => {
    if (!isSupported) return <XCircle className="h-6 w-6 text-red-500" />;
    if (permission === 'denied') return <XCircle className="h-6 w-6 text-red-500" />;
    if (isSubscribed) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (permission === 'granted') return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    return <AlertCircle className="h-6 w-6 text-gray-500" />;
  };

  const getStatusText = () => {
    if (!isSupported) return '브라우저가 푸시 알림을 지원하지 않습니다';
    if (permission === 'denied') return '푸시 알림 권한이 거부되었습니다';
    if (isSubscribed) return '푸시 알림이 활성화되었습니다';
    if (permission === 'granted') return '권한은 허용되었지만 아직 구독하지 않았습니다';
    return '푸시 알림 권한이 요청되지 않았습니다';
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">푸시 알림 데모</h1>
          <p className="text-gray-600">Traffic-Lens 웹 푸시 알림 기능을 테스트해보세요</p>
        </div>

        {/* 상태 표시 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* 도메인 선택 */}
          {domains.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테스트할 도메인 선택
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setDomainId(parseInt(e.target.value));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.siteName} ({domain.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-3 mb-4">
            <StatusIcon />
            <div>
              <h3 className="font-semibold text-gray-900">알림 상태</h3>
              <p className="text-sm text-gray-600">{getStatusText()}</p>
            </div>
          </div>

          {/* 브라우저 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">브라우저 지원:</span>
              <span className={`ml-2 font-medium ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
                {isSupported ? '지원됨' : '지원 안됨'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">알림 권한:</span>
              <span className={`ml-2 font-medium ${
                permission === 'granted' ? 'text-green-600' : 
                permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {permission === 'granted' ? '허용됨' : 
                 permission === 'denied' ? '거부됨' : '요청 안됨'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">구독 상태:</span>
              <span className={`ml-2 font-medium ${isSubscribed ? 'text-green-600' : 'text-gray-600'}`}>
                {isSubscribed ? '구독됨' : '구독 안됨'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="text-gray-500">서비스 워커:</span>
              <span className={`ml-2 font-medium ${
                isClient && typeof navigator !== 'undefined' && 'serviceWorker' in navigator 
                  ? 'text-green-600' 
                  : 'text-gray-600'
              }`}>
                {isClient ? (
                  typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? '지원됨' : '지원 안됨'
                ) : (
                  '확인 중...'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          {!isSubscribed ? (
            <button
              onClick={subscribeToNotifications}
              disabled={!isSupported || loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Bell className="h-5 w-5 mr-2" />
              )}
              {loading ? '구독 중...' : '푸시 알림 구독하기'}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={sendTestNotification}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {loading ? '발송 중...' : '테스트 알림 보내기'}
              </button>
              
              <button
                onClick={unsubscribeFromNotifications}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                <BellOff className="h-5 w-5 mr-2" />
                구독 해제하기
              </button>
            </div>
          )}
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.includes('오류') || message.includes('실패') || message.includes('거부')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* 구독 정보 */}
        {subscription && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">구독 정보</h4>
            <div className="text-xs text-gray-600 break-all">
              <p><strong>Endpoint:</strong> {subscription.endpoint}</p>
            </div>
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 사용법</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>브라우저에서 알림 권한을 허용해주세요</li>
            <li>"푸시 알림 구독하기" 버튼을 클릭하세요</li>
            <li>구독이 완료되면 "테스트 알림 보내기"를 클릭하세요</li>
            <li>잠시 후 브라우저에서 푸시 알림을 확인할 수 있습니다</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
