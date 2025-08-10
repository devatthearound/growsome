import { 
  APIResponse, 
  CreateDomainRequest, 
  TLDomain, 
  TLSubscriber, 
  TLCampaign,
  CreateCampaignRequest,
  SubscribeRequest,
  DashboardStats
} from '@/types/traffic-lens';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class TrafficLensService {
  private async fetchAPI<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}/api/traffic-lens${endpoint}`;
    console.log('API 요청:', url, options.body ? JSON.parse(options.body as string) : {});
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // 쿠키 포함
        ...options,
      });

      console.log('API 응답:', response.status, response.ok ? '성공' : '실패');
      
      if (!response.ok) {
        let errorMessage = '알 수 없는 오류가 발생했습니다';
        
        try {
          const errorData = await response.json();
          console.log('API 에러 데이터:', errorData);
          errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status} - ${response.statusText}`;
        } catch {
          // JSON 파싱 실패
          const textError = await response.text().catch(() => '');
          errorMessage = textError || `HTTP ${response.status} - ${response.statusText}`;
        }
        
        // 상태 코드에 따른 사용자 친화적 메시지
        if (response.status === 401) {
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
        } else if (response.status === 403) {
          errorMessage = '접근 권한이 없습니다.';
        } else if (response.status === 404) {
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
        } else if (response.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      // 네트워크 오류 처리
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      }
      
      throw error;
    }
  }

  // Domain 관련 메서드
  async getDomains(): Promise<APIResponse<TLDomain[]>> {
    return this.fetchAPI<TLDomain[]>('/domains');
  }

  async getDomain(id: number): Promise<APIResponse<TLDomain>> {
    return this.fetchAPI<TLDomain>(`/domains/${id}`);
  }

  async createDomain(data: CreateDomainRequest): Promise<APIResponse<TLDomain>> {
    return this.fetchAPI<TLDomain>('/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDomain(
    id: number, 
    data: Partial<Pick<TLDomain, 'siteName' | 'serviceWorkerPath' | 'isActive'>>
  ): Promise<APIResponse<TLDomain>> {
    return this.fetchAPI<TLDomain>(`/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDomain(id: number): Promise<APIResponse<void>> {
    return this.fetchAPI<void>(`/domains/${id}`, {
      method: 'DELETE',
    });
  }

  async getServiceWorkerCode(domainId: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/traffic-lens/domains/${domainId}/sw`);
    if (!response.ok) {
      throw new Error('Failed to fetch service worker code');
    }
    return response.text();
  }

  // Subscriber 관련 메서드
  async getSubscribers(params: {
    domainId?: number;
    page?: number;
    limit?: number;
    isActive?: boolean;
    country?: string;
  } = {}): Promise<APIResponse<TLSubscriber[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.fetchAPI<TLSubscriber[]>(`/subscribers?${searchParams.toString()}`);
  }

  async createSubscriber(data: SubscribeRequest): Promise<APIResponse<TLSubscriber>> {
    return this.fetchAPI<TLSubscriber>('/subscribers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscriberStats(params: {
    domainId?: number;
    period?: number;
  } = {}): Promise<APIResponse<any>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.fetchAPI<any>(`/subscribers/stats?${searchParams.toString()}`);
  }

  // Campaign 관련 메서드
  async getCampaigns(params: {
    domainId?: number;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<APIResponse<TLCampaign[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.fetchAPI<TLCampaign[]>(`/campaigns?${searchParams.toString()}`);
  }

  async getCampaign(id: number): Promise<APIResponse<TLCampaign>> {
    return this.fetchAPI<TLCampaign>(`/campaigns/${id}`);
  }

  async createCampaign(data: CreateCampaignRequest): Promise<APIResponse<TLCampaign>> {
    return this.fetchAPI<TLCampaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(
    id: number, 
    data: Partial<CreateCampaignRequest>
  ): Promise<APIResponse<TLCampaign>> {
    return this.fetchAPI<TLCampaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: number): Promise<APIResponse<void>> {
    return this.fetchAPI<void>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async sendCampaign(id: number): Promise<APIResponse<any>> {
    return this.fetchAPI<any>(`/campaigns/${id}/send`, {
      method: 'POST',
    });
  }

  // Analytics 관련 메서드
  async getDashboardStats(params: {
    domainId?: number;
    period?: number;
  } = {}): Promise<APIResponse<DashboardStats>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      return await this.fetchAPI<DashboardStats>(`/analytics/overview?${searchParams.toString()}`);
    } catch (error) {
      console.error('대시보드 통계 데이터 가져오기 실패:', error);
      
      // 폴백 데이터 반환
      return {
        success: true,
        data: {
          totalSubscribers: 0,
          activeSubscribers: 0,
          totalCampaigns: 0,
          sentNotifications: 0,
          clickRate: 0,
          recentCampaigns: [],
          subscriberGrowth: [],
          topPerformingCampaigns: [],
          error: '데이터를 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.'
        } as DashboardStats
      };
    }
  }

  async getCampaignAnalytics(params: {
    domainId?: number;
    period?: number;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<APIResponse<any>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      return await this.fetchAPI<any>(`/analytics/campaigns?${searchParams.toString()}`);
    } catch (error) {
      console.error('캐페인 분석 데이터 가져오기 실패:', error);
      
      // 폴백 데이터 반환
      return {
        success: true,
        data: {
          campaigns: [],
          totalCount: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          error: '캐페인 분석 데이터를 불러올 수 없습니다.'
        }
      };
    }
  }

  async getGrowthAnalytics(params: {
    domainId?: number;
    period?: number;
  } = {}): Promise<APIResponse<any>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      console.log('getGrowthAnalytics 호출 시작:', params);
      const response = await this.fetchAPI<any>(`/analytics/growth?${searchParams.toString()}`);
      console.log('getGrowthAnalytics 성공:', response.success);
      return response;
    } catch (error) {
      console.error('성장 분석 데이터 가져오기 실패:', error);
      
      // 폴백 데이터 반환
      return {
        success: true,
        data: {
          growthData: [],
          countryData: [],
          summary: {
            totalSubscribers: 0,
            periodGrowth: 0,
            periodUnsubscribed: 0,
            netGrowth: 0,
            averageActiveRate: 0,
          },
          error: '성장 분석 데이터를 불러올 수 없습니다.'
        }
      };
    }
  }

  // Notification 추적 관련 메서드
  async trackNotificationClick(data: {
    campaignId?: number;
    notificationId?: number;
    timestamp?: string;
    userAgent?: string;
  }): Promise<APIResponse<void>> {
    return this.fetchAPI<void>('/notifications/click', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async trackNotificationClose(data: {
    campaignId?: number;
    notificationId?: number;
    timestamp?: string;
  }): Promise<APIResponse<void>> {
    return this.fetchAPI<void>('/notifications/close', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 유틸리티 메서드
  generateIntegrationCode(domain: TLDomain): {
    serviceWorkerCode: string;
    integrationCode: string;
  } {
    const serviceWorkerCode = this.generateServiceWorkerCode(domain);
    const integrationCode = this.generateWebsiteIntegrationCode(domain);
    
    return {
      serviceWorkerCode,
      integrationCode,
    };
  }

  private generateServiceWorkerCode(domain: TLDomain): string {
    return `// ${domain.domain} Service Worker - Traffic-Lens
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      image: data.image,
      tag: data.tag || 'traffic-lens',
      requireInteraction: true,
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
  
  if (campaignId) {
    fetch('${API_BASE_URL}/api/traffic-lens/notifications/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  }

  private generateWebsiteIntegrationCode(domain: TLDomain): string {
    return `<!-- Traffic-Lens 푸시 알림 연동 -->
<script>
const vapidPublicKey = '${domain.vapidPublicKey}';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('${domain.serviceWorkerPath}')
    .then(function(registration) {
      return registration.pushManager.getSubscription();
    })
    .then(function(subscription) {
      if (subscription === null) {
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }
      return subscription;
    })
    .then(function(subscription) {
      return fetch('${API_BASE_URL}/api/traffic-lens/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    .catch(console.error);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');
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
  }
}

// 싱글톤 인스턴스 생성
export const trafficLensService = new TrafficLensService();
export default trafficLensService;
