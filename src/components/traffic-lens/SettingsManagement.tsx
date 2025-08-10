'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Plus, 
  Key, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Code,
  Zap,
  Shield,
  Monitor
} from 'lucide-react';
import { TLDomain } from '@/types/traffic-lens';
import trafficLensService from '@/services/traffic-lens/TrafficLensService';

const SettingsTab = ({ 
  id, 
  label, 
  icon: Icon, 
  isActive, 
  onClick 
}: {
  id: string;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </button>
);

const DomainRegistrationForm = ({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    domain: '',
    siteName: '',
    pushServiceType: 'vapid' as 'vapid' | 'fcm' | 'both',
    serviceWorkerPath: '/sw.js'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">새 도메인 등록</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도메인 *
            </label>
            <input
              type="text"
              placeholder="example.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">프로토콜 없이 도메인만 입력하세요</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사이트 이름 *
            </label>
            <input
              type="text"
              placeholder="My Website"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            푸시 서비스 타입
          </label>
          <select
            value={formData.pushServiceType}
            onChange={(e) => setFormData({ ...formData, pushServiceType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="vapid">VAPID (웹 표준)</option>
            <option value="fcm">Firebase FCM</option>
            <option value="both">하이브리드 (VAPID + FCM)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Worker 경로
          </label>
          <input
            type="text"
            placeholder="/sw.js"
            value={formData.serviceWorkerPath}
            onChange={(e) => setFormData({ ...formData, serviceWorkerPath: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">웹사이트 루트에서의 상대 경로</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

const DomainCard = ({ domain, onGenerateKeys, onDownloadSW, onGetIntegrationCode }: {
  domain: TLDomain;
  onGenerateKeys: (domain: TLDomain) => void;
  onDownloadSW: (domain: TLDomain) => void;
  onGetIntegrationCode: (domain: TLDomain) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            {domain.siteName}
          </h3>
          <p className="text-sm text-gray-600">{domain.domain}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          domain.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {domain.isActive ? '활성' : '비활성'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Service Worker:</span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {domain.serviceWorkerPath}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">VAPID 키:</span>
          <div className="flex items-center space-x-2">
            {domain.vapidPublicKey ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
            <span className="text-sm">
              {domain.vapidPublicKey ? '설정됨' : '미설정'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {!domain.vapidPublicKey && (
          <button
            onClick={() => onGenerateKeys(domain)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Key className="h-4 w-4 mr-1" />
            VAPID 키 생성
          </button>
        )}
        
        <button
          onClick={() => onDownloadSW(domain)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-1" />
          SW 다운로드
        </button>

        <button
          onClick={() => onGetIntegrationCode(domain)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Code className="h-4 w-4 mr-1" />
          연동 코드
        </button>
      </div>
    </div>
  );
};

const SystemInfo = () => {
  const systemStats = {
    vapidKeysStatus: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? '설정됨' : '미설정',
    databaseStatus: '연결됨',
    pushServiceStatus: '정상',
    totalDomains: 0, // API에서 가져올 예정
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          시스템 상태
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">데이터베이스</span>
            <span className="text-sm font-medium text-green-600">연결됨</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">VAPID 키</span>
            <span className="text-sm font-medium text-green-600">설정됨</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">푸시 서비스</span>
            <span className="text-sm font-medium text-green-600">정상</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">등록된 도메인</span>
            <span className="text-sm font-medium text-blue-600">0개</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          보안 설정
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">HTTPS 강제</p>
              <p className="text-sm text-gray-600">푸시 알림은 HTTPS에서만 작동합니다</p>
            </div>
            <div className="text-sm font-medium text-green-600">활성화됨</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">도메인 검증</p>
              <p className="text-sm text-gray-600">등록된 도메인만 푸시 발송 허용</p>
            </div>
            <div className="text-sm font-medium text-green-600">활성화됨</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('domains');
  const [domains, setDomains] = useState<TLDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await trafficLensService.getDomains();
      if (response.success) {
        setDomains(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDomain = async (data: any) => {
    try {
      const response = await trafficLensService.createDomain(data);
      if (response.success) {
        setShowAddDomain(false);
        fetchDomains();
      }
    } catch (error) {
      console.error('Failed to create domain:', error);
    }
  };

  const handleGenerateKeys = async (domain: TLDomain) => {
    // VAPID 키 생성 로직
    console.log('Generate VAPID keys for domain:', domain);
  };

  const handleDownloadSW = async (domain: TLDomain) => {
    try {
      const swCode = await trafficLensService.getServiceWorkerCode(domain.id);
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${domain.domain}-sw.js`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download service worker:', error);
    }
  };

  const handleGetIntegrationCode = (domain: TLDomain) => {
    const { integrationCode } = trafficLensService.generateIntegrationCode(domain);
    navigator.clipboard.writeText(integrationCode);
    alert('연동 코드가 클립보드에 복사되었습니다!');
  };

  const tabs = [
    { id: 'domains', label: '도메인 관리', icon: Globe },
    { id: 'system', label: '시스템 정보', icon: Monitor },
    { id: 'security', label: '보안 설정', icon: Shield },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="h-8 w-8 mr-3" />
              Traffic-Lens 설정
            </h1>
            <p className="mt-2 text-gray-600">시스템 설정 및 도메인 관리</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <SettingsTab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          {/* Add Domain Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">등록된 도메인</h2>
            <button
              onClick={() => setShowAddDomain(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              도메인 추가
            </button>
          </div>

          {/* Add Domain Form */}
          {showAddDomain && (
            <DomainRegistrationForm
              onSubmit={handleCreateDomain}
              onCancel={() => setShowAddDomain(false)}
            />
          )}

          {/* Domains List */}
          {domains.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 도메인이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">첫 번째 도메인을 등록해보세요.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddDomain(true)}
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
                  onGenerateKeys={handleGenerateKeys}
                  onDownloadSW={handleDownloadSW}
                  onGetIntegrationCode={handleGetIntegrationCode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {(activeTab === 'system' || activeTab === 'security') && (
        <SystemInfo />
      )}
    </div>
  );
}