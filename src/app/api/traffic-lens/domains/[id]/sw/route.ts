import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/traffic-lens/domains/[id]/sw - 서비스 워커 코드 생성
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domainId = parseInt(id);
    
    if (isNaN(domainId)) {
      return new NextResponse('Invalid domain ID', { status: 400 });
    }

    const domain = await prisma.tLDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      return new NextResponse('Domain not found', { status: 404 });
    }

    const serviceWorkerCode = `// Traffic-Lens Service Worker for ${domain.domain}
// Generated automatically - DO NOT EDIT MANUALLY

const DOMAIN_ID = ${domain.id};
const API_BASE_URL = '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}';

self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[SW] Push data:', data);
      
      const options = {
        body: data.body,
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
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
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
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
    const trackingPromise = fetch(\`\${API_BASE_URL}/api/traffic-lens/notifications/click\`, {
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
      const clientUrl = new URL(client.url);
      const targetUrl = new URL(urlToOpen, self.location.origin);
      
      if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
        return client.focus();
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
  
  // 필요시 닫힘 추적
  const data = event.notification.data || {};
  const campaignId = data.campaignId;
  const notificationId = data.notificationId;
  
  if (campaignId || notificationId) {
    const trackingPromise = fetch(\`\${API_BASE_URL}/api/traffic-lens/notifications/close\`, {
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

// 백그라운드 동기화 (선택적)
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'traffic-lens-sync') {
    event.waitUntil(
      // 오프라인 상태에서 쌓인 데이터 동기화
      syncOfflineData()
    );
  }
});

async function syncOfflineData() {
  try {
    // 오프라인 상태에서 수집된 데이터가 있다면 서버로 전송
    console.log('[SW] Syncing offline data...');
  } catch (error) {
    console.error('[SW] Error syncing offline data:', error);
  }
}

// 설치 이벤트
self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker installing for domain:', '${domain.domain}');
  
  // 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker activated for domain:', '${domain.domain}');
  
  // 모든 클라이언트 제어
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

console.log('[SW] Traffic-Lens Service Worker loaded for ${domain.domain}');
`;

    return new NextResponse(serviceWorkerCode, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐시
      },
    });
  } catch (error) {
    console.error('Failed to generate service worker:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
