'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  MapPin, 
  Globe, 
  Calendar,
  Activity,
  MoreVertical,
  RefreshCw,
  UserCheck,
  UserX,
  Bell,
  TrendingUp,
  Mail
} from 'lucide-react';
import { TLSubscriber, TLDomain, APIResponse, PaginatedResponse } from '@/types/traffic-lens';
import CountryFlag from '@/components/traffic-lens/CountryFlag';

interface SubscriberWithDomain extends TLSubscriber {
  domain: {
    id: number;
    domain: string;
    siteName: string;
  };
  _count: {
    notifications: number;
  };
}

interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  todaySubscribers: number;
  clickThroughRate: number;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
  subscriberGrowth: Array<{
    date: string;
    count: number;
  }>;
}

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState<SubscriberWithDomain[]>([]);
  const [domains, setDomains] = useState<TLDomain[]>([]);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      
      if (selectedDomain) params.append('domainId', selectedDomain);
      if (selectedCountry) params.append('country', selectedCountry);
      if (isActiveFilter !== 'all') params.append('isActive', isActiveFilter);
      
      const response = await fetch(`/api/traffic-lens/subscribers?${params.toString()}`);
      const data: PaginatedResponse<SubscriberWithDomain> = await response.json();
      
      if (data.success && data.data) {
        setSubscribers(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.error?.message || '구독자 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch domains
  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/traffic-lens/domains');
      const data: APIResponse<TLDomain[]> = await response.json();
      if (data.success && data.data) {
        setDomains(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch domains:', err);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/traffic-lens/subscribers/stats');
      const data: APIResponse<SubscriberStats> = await response.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchDomains();
    fetchStats();
  }, [currentPage, selectedDomain, selectedCountry, isActiveFilter]);

  // Handle subscriber selection
  const toggleSubscriberSelection = (subscriberId: number) => {
    setSelectedSubscribers(prev => {
      const newSelection = prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const selectAllSubscribers = () => {
    const allIds = subscribers.map(s => s.id);
    setSelectedSubscribers(allIds);
    setShowBulkActions(true);
  };

  const clearSelection = () => {
    setSelectedSubscribers([]);
    setShowBulkActions(false);
  };

  // Bulk actions
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedSubscribers.length === 0) return;
    
    const actionText = {
      activate: '활성화',
      deactivate: '비활성화', 
      delete: '삭제'
    }[action];
    
    if (!confirm(`선택된 ${selectedSubscribers.length}개의 구독자를 ${actionText}하시겠습니까?`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/traffic-lens/subscribers/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          subscriberIds: selectedSubscribers
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`${data.data.successCount}개 구독자에 대해 ${actionText} 작업이 완료되었습니다.`);
        clearSelection();
        fetchSubscribers();
      } else {
        alert(data.error?.message || '작업 수행에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (subscriberId: number) => {
    if (!confirm('정말로 이 구독자를 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/traffic-lens/subscribers/${subscriberId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('구독자가 성공적으로 삭제되었습니다.');
        fetchSubscribers();
      } else {
        alert(data.error?.message || '구독자 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };
  
  // Send notification to subscriber
  const sendNotificationToSubscriber = async (subscriberId: number) => {
    // This would open a modal or navigate to send notification page
    console.log('Send notification to subscriber:', subscriberId);
    // For now, just show an alert
    alert('개별 알림 전송 기능은 추후 구현 예정입니다.');
  };
  
  // View subscriber details
  const viewSubscriberDetails = async (subscriberId: number) => {
    // This would open a modal or navigate to details page
    console.log('View subscriber details:', subscriberId);
    // For now, just show an alert
    alert('구독자 상세 정보 기능은 추후 구현 예정입니다.');
  };

  // Export subscribers
  const exportSubscribers = async () => {
    try {
      // 현재 필터 조건을 포함하여 내보내기
      const params = new URLSearchParams();
      if (selectedDomain) params.append('domainId', selectedDomain);
      if (selectedCountry) params.append('country', selectedCountry);
      if (isActiveFilter !== 'all') params.append('isActive', isActiveFilter);
      
      const response = await fetch(`/api/traffic-lens/subscribers/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('내보내기에 실패했습니다.');
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.domain.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.country?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading && subscribers.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">구독자 관리</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              필터
            </button>
            <button
              onClick={exportSubscribers}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </button>
            <button
              onClick={fetchSubscribers}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">총 구독자</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">활성 구독자</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">오늘 신규</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todaySubscribers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">평균 클릭률</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.clickThroughRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="px-6 pb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="사이트명, 엔드포인트, 국가 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">도메인</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">모든 도메인</option>
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id.toString()}>
                      {domain.siteName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">모든 국가</option>
                  <option value="KR">🇰🇷 대한민국</option>
                  <option value="US">🇺🇸 미국</option>
                  <option value="JP">🇯🇵 일본</option>
                  <option value="CN">🇨🇳 중국</option>
                  <option value="GB">🇬🇧 영국</option>
                  <option value="DE">🇩🇪 독일</option>
                  <option value="FR">🇫🇷 프랑스</option>
                  <option value="CA">🇨🇦 캐나다</option>
                  <option value="AU">🇦🇺 호주</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="px-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedSubscribers.length}개 구독자 선택됨
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                선택 해제
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                활성화
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                비활성화
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={selectedSubscribers.length === filteredSubscribers.length ? clearSelection : selectAllSubscribers}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사이트
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    위치
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구독일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    마지막 접속
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    알림 수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => toggleSubscriberSelection(subscriber.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.domain.siteName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscriber.domain.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="flex items-center space-x-2">
                          {subscriber.country && (
                            <CountryFlag countryCode={subscriber.country} />
                          )}
                          <span>{subscriber.city || 'Unknown'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(subscriber.subscribedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(subscriber.lastSeen).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 text-gray-400 mr-1" />
                        {subscriber._count.notifications}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewSubscriberDetails(subscriber.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="상세 보기"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendNotificationToSubscriber(subscriber.id)}
                          className="text-green-600 hover:text-green-900"
                          title="알림 전송"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-red-600 hover:text-red-900"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSubscribers.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">구독자가 없습니다</h3>
              <p className="text-gray-500">조건에 맞는 구독자를 찾을 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 pb-6">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                이전
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{(currentPage - 1) * 20 + 1}</span>
                  {' '}부터{' '}
                  <span className="font-medium">{Math.min(currentPage * 20, filteredSubscribers.length)}</span>
                  {' '}까지, 총{' '}
                  <span className="font-medium">{filteredSubscribers.length}</span>
                  {' '}개
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    처음
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    다음
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    마지막
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriberManagement;