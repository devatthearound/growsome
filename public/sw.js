// Traffic-Lens Service Worker
// Basic implementation for push notifications

const API_BASE_URL = self.location.origin;

self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[SW] Push data:', data);
      
      const options = {
        body: data.body,
        icon: data.icon || '/logo_growsome.png',
        badge: data.badge || '/logo192.png',
        image: data.image,
        tag: data.tag || 'traffic-lens-notification',
        requireInteraction: true,
        timestamp: Date.now(),
        actions: data.actions || [],
        data: {
          url: data.url || '/',
          campaignId: data.campaignId,
          notificationId: data.notificationId,
          timestamp: Date.now()
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      
      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('새 알림', {
          body: '새로운 알림이 도착했습니다.',
          icon: '/logo_growsome.png',
          badge: '/logo192.png',
          tag: 'traffic-lens-fallback'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  const urlToOpen = data.url || '/';
  const campaignId = data.campaignId;
  const notificationId = data.notificationId;
  
  // 클릭 추적
  if (campaignId || notificationId) {
    const trackingPromise = fetch(`${API_BASE_URL}/api/traffic-lens/notifications/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId: campaignId,
        notificationId: notificationId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    }).catch(error => {
      console.error('[SW] Failed to track click:', error);
    });
    
    event.waitUntil(trackingPromise);
  }
  
  // 페이지 열기
  const openPromise = clients.matchAll({ 
    type: 'window',
    includeUncontrolled: true 
  }).then(function(clientList) {
    // 이미 열린 탭에서 동일한 URL을 찾아서 포커스
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      try {
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(urlToOpen, self.location.origin);
        
        if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
          return client.focus();
        }
      } catch (urlError) {
        console.warn('[SW] URL parsing error:', urlError);
      }
    }
    
    // 새 창에서 열기
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });
  
  event.waitUntil(openPromise);
});

self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification closed:', event.notification);
  
  const data = event.notification.data || {};
  const campaignId = data.campaignId;
  const notificationId = data.notificationId;
  
  if (campaignId || notificationId) {
    const trackingPromise = fetch(`${API_BASE_URL}/api/traffic-lens/notifications/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId: campaignId,
        notificationId: notificationId,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.error('[SW] Failed to track close:', error);
    });
    
    event.waitUntil(trackingPromise);
  }
});

// 설치 이벤트
self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker activated');
  event.waitUntil(
    clients.claim().then(() => {
      console.log('[SW] Service Worker now controls all clients');
    })
  );
});

// 에러 처리
self.addEventListener('error', function(event) {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Traffic-Lens Service Worker loaded');
