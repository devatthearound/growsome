'use client';

import { useState, useEffect } from 'react';
import { Plus, Globe, Settings, Code, Eye, Trash2, Edit, Copy } from 'lucide-react';
import { TLDomain } from '@/types/traffic-lens';

const DomainCard = ({ domain, onEdit, onDelete, onViewCode }: {
  domain: TLDomain;
  onEdit: (domain: TLDomain) => void;
  onDelete: (domain: TLDomain) => void;
  onViewCode: (domain: TLDomain) => void;
}) => {
  const copyVapidKey = () => {
    if (domain.vapidPublicKey) {
      navigator.clipboard.writeText(domain.vapidPublicKey);
      // TODO: 토스트 메시지 표시
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{domain.siteName}</h3>
              <p className="text-sm text-gray-500">{domain.domain}</p>
            </div>
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            domain.isActive 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {domain.isActive ? '활성' : '비활성'}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">서비스 워커:</span>
            <span className="ml-2 font-mono text-gray-900">{domain.serviceWorkerPath}</span>
          </div>
          {domain.vapidPublicKey && (
            <div className="text-sm">
              <span className="text-gray-500">VAPID 공개 키:</span>
              <div className="flex items-center mt-1">
                <span className="ml-2 font-mono text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded flex-1 truncate">
                  {domain.vapidPublicKey}
                </span>
                <button
                  onClick={copyVapidKey}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            생성일: {new Date(domain.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewCode(domain)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Code className="h-4 w-4 mr-1" />
              코드 보기
            </button>
            <button
              onClick={() => onEdit(domain)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              편집
            </button>
            <button
              onClick={() => onDelete(domain)}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddDomainModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    domain: '',
    siteName: '',
    serviceWorkerPath: '/sw.js'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ domain: '', siteName: '', serviceWorkerPath: '/sw.js' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">새 도메인 추가</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도메인
            </label>
            <input
              type="text"
              placeholder="example.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사이트 이름
            </label>
            <input
              type="text"
              placeholder="내 웹사이트"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              서비스 워커 경로
            </label>
            <input
              type="text"
              value={formData.serviceWorkerPath}
              onChange={(e) => setFormData({ ...formData, serviceWorkerPath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ServiceWorkerCodeModal = ({ isOpen, onClose, domain }: {
  isOpen: boolean;
  onClose: () => void;
  domain: TLDomain | null;
}) => {
  if (!isOpen || !domain) return null;

  const serviceWorkerCode = `// ${domain.domain} Service Worker
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      image: data.image,
      tag: data.tag || 'default',
      requireInteraction: true,
      actions: data.actions || [],
      data: {
        url: data.url || '/',
        campaignId: data.campaignId
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  const campaignId = event.notification.data.campaignId;
  
  // 클릭 추적
  if (campaignId) {
    fetch('/api/traffic-lens/notifications/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId: campaignId,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});`;

  const integrationCode = `<!-- ${domain.domain} 푸시 알림 연동 코드 -->
<script>
// VAPID 공개 키
const vapidPublicKey = '${domain.vapidPublicKey || 'YOUR_VAPID_PUBLIC_KEY'}';

// 서비스 워커 등록
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('${domain.serviceWorkerPath}')
    .then(function(registration) {
      console.log('Service Worker 등록 성공:', registration);
      
      // 푸시 알림 권한 요청
      return registration.pushManager.getSubscription();
    })
    .then(function(subscription) {
      if (subscription === null) {
        // 새로운 구독 생성
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      } else {
        // 기존 구독 사용
        return subscription;
      }
    })
    .then(function(subscription) {
      // 서버에 구독 정보 전송
      return fetch('/api/traffic-lens/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: ${domain.id},
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: arrayBufferToBase64(subscription.getKey('auth'))
          }
        })
      });
    })
    .catch(function(error) {
      console.error('푸시 알림 설정 실패:', error);
    });
}

// Helper functions
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
</script>`;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: 토스트 메시지 표시
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">연동 코드</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Service Worker 코드 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">1. 서비스 워커 파일 (sw.js)</h4>
              <button
                onClick={() => copyCode(serviceWorkerCode)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-1" />
                복사
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              <code>{serviceWorkerCode}</code>
            </pre>
          </div>

          {/* 연동 코드 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">2. 웹사이트 연동 코드</h4>
              <button
                onClick={() => copyCode(integrationCode)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-1" />
                복사
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              <code>{integrationCode}</code>
            </pre>
          </div>

          {/* 설치 가이드 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">3. 설치 가이드</h4>
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <ol className="list-decimal list-inside space-y-2">
                <li>위의 서비스 워커 코드를 <code className="bg-white px-1 rounded">{domain.serviceWorkerPath}</code> 파일로 저장하세요.</li>
                <li>웹사이트 연동 코드를 HTML 페이지의 &lt;head&gt; 태그 안에 추가하세요.</li>
                <li>웹사이트를 배포하고 브라우저에서 접속하여 알림 권한을 허용하세요.</li>
                <li>구독자가 등록되면 Traffic-Lens 대시보드에서 확인할 수 있습니다.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DomainManagement() {
  const [domains, setDomains] = useState<TLDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<TLDomain | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      // TODO: 실제 API 호출
      const mockDomains: TLDomain[] = [
        {
          id: 1,
          userId: 1,
          domain: 'example.com',
          siteName: '예시 웹사이트',
          serviceWorkerPath: '/sw.js',
          vapidPublicKey: 'BK7dVBiEVEGUjgAWe...',
          vapidPrivateKey: '...',
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
      ];
      setDomains(mockDomains);
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (data: any) => {
    try {
      // TODO: API 호출
      console.log('Adding domain:', data);
      setShowAddModal(false);
      fetchDomains();
    } catch (error) {
      console.error('Failed to add domain:', error);
    }
  };

  const handleEditDomain = (domain: TLDomain) => {
    // TODO: 편집 모달 구현
    console.log('Edit domain:', domain);
  };

  const handleDeleteDomain = async (domain: TLDomain) => {
    if (confirm('이 도메인을 삭제하시겠습니까?')) {
      try {
        // TODO: API 호출
        console.log('Delete domain:', domain);
        fetchDomains();
      } catch (error) {
        console.error('Failed to delete domain:', error);
      }
    }
  };

  const handleViewCode = (domain: TLDomain) => {
    setSelectedDomain(domain);
    setShowCodeModal(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">도메인 관리</h1>
            <p className="mt-2 text-gray-600">웹사이트 도메인을 등록하고 푸시 알림을 설정하세요</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            도메인 추가
          </button>
        </div>
      </div>

      {/* Domains Grid */}
      {domains.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 도메인이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">첫 번째 도메인을 추가해보세요.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              도메인 추가
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onEdit={handleEditDomain}
              onDelete={handleDeleteDomain}
              onViewCode={handleViewCode}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddDomainModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDomain}
      />

      <ServiceWorkerCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        domain={selectedDomain}
      />
    </div>
  );
}
