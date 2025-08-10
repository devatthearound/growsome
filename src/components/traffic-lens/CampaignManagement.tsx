'use client';

import { useState, useEffect } from 'react';
import { Plus, Send, Edit, Trash2, Clock, CheckCircle, XCircle, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';
import { TLCampaign, TLDomain } from '@/types/traffic-lens';
import trafficLensService from '@/services/traffic-lens/TrafficLensService';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', label: '초안' },
    scheduled: { color: 'bg-blue-100 text-blue-800', label: '예약됨' },
    sending: { color: 'bg-yellow-100 text-yellow-800', label: '발송 중' },
    sent: { color: 'bg-green-100 text-green-800', label: '발송됨' },
    failed: { color: 'bg-red-100 text-red-800', label: '실패' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const CampaignCard = ({ campaign, onEdit, onDelete, onSend }: {
  campaign: TLCampaign & { 
    domain: { domain: string; siteName: string; };
    stats?: { totalSent: number; totalClicks: number; clickRate: number; };
  };
  onEdit: (campaign: TLCampaign) => void;
  onDelete: (campaign: TLCampaign) => void;
  onSend: (campaign: TLCampaign) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.body}</p>
            <div className="text-sm text-gray-500">
              <p>도메인: {campaign.domain.siteName} ({campaign.domain.domain})</p>
              <p>생성일: {new Date(campaign.createdAt).toLocaleDateString()}</p>
              {campaign.scheduledAt && (
                <p>예약일: {new Date(campaign.scheduledAt).toLocaleString()}</p>
              )}
              {campaign.sentAt && (
                <p>발송일: {new Date(campaign.sentAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* 성과 데이터 */}
        {campaign.stats && campaign.status === 'sent' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{campaign.stats.totalSent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">발송됨</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{campaign.stats.totalClicks.toLocaleString()}</p>
                <p className="text-xs text-gray-500">클릭</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{campaign.stats.clickRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">클릭률</p>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {campaign.targetType === 'all' ? '모든 구독자' : '세그먼트 타겟'}
          </div>
          <div className="flex items-center space-x-2">
            {campaign.status === 'sent' && (
              <Link
                href={`/traffic-lens/analytics/campaigns/${campaign.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                분석
              </Link>
            )}
            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
              <button
                onClick={() => onSend(campaign)}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-1" />
                발송
              </button>
            )}
            <button
              onClick={() => onEdit(campaign)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              편집
            </button>
            <button
              onClick={() => onDelete(campaign)}
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

const CreateCampaignModal = ({ isOpen, onClose, onSubmit, domains }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  domains: TLDomain[];
}) => {
  const [formData, setFormData] = useState({
    domainId: '',
    title: '',
    body: '',
    iconUrl: '',
    imageUrl: '',
    clickUrl: '',
    scheduledAt: '',
    targetType: 'all'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      domainId: parseInt(formData.domainId),
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
    });
    setFormData({
      domainId: '',
      title: '',
      body: '',
      iconUrl: '',
      imageUrl: '',
      clickUrl: '',
      scheduledAt: '',
      targetType: 'all'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">새 캠페인 생성</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                도메인 *
              </label>
              <select
                value={formData.domainId}
                onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">도메인 선택</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.siteName} ({domain.domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타겟 타입
              </label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 구독자</option>
                <option value="segment">세그먼트</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 *
            </label>
            <input
              type="text"
              placeholder="알림 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용 *
            </label>
            <textarea
              placeholder="알림 내용을 입력하세요"
              rows={3}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                아이콘 URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/icon.png"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.png"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                클릭 URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/landing"
                value={formData.clickUrl}
                onChange={(e) => setFormData({ ...formData, clickUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                예약 발송 (선택사항)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [domains, setDomains] = useState<TLDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsResponse, domainsResponse] = await Promise.all([
        trafficLensService.getCampaigns(),
        trafficLensService.getDomains(),
      ]);

      if (campaignsResponse.success) {
        setCampaigns(campaignsResponse.data || []);
      }

      if (domainsResponse.success) {
        setDomains(domainsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (data: any) => {
    try {
      const response = await trafficLensService.createCampaign(data);
      if (response.success) {
        setShowCreateModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleSendCampaign = async (campaign: TLCampaign) => {
    if (confirm('이 캠페인을 지금 발송하시겠습니까?')) {
      try {
        const response = await trafficLensService.sendCampaign(campaign.id);
        if (response.success) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to send campaign:', error);
      }
    }
  };

  const handleEditCampaign = (campaign: TLCampaign) => {
    // TODO: 편집 모달 구현
    console.log('Edit campaign:', campaign);
  };

  const handleDeleteCampaign = async (campaign: TLCampaign) => {
    if (confirm('이 캠페인을 삭제하시겠습니까?')) {
      try {
        const response = await trafficLensService.deleteCampaign(campaign.id);
        if (response.success) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedDomain && campaign.domainId !== parseInt(selectedDomain)) {
      return false;
    }
    if (selectedStatus && campaign.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">캠페인 관리</h1>
            <p className="mt-2 text-gray-600">푸시 알림 캠페인을 생성하고 관리하세요</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            캠페인 생성
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">모든 도메인</option>
          {domains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.siteName}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">모든 상태</option>
          <option value="draft">초안</option>
          <option value="scheduled">예약됨</option>
          <option value="sending">발송 중</option>
          <option value="sent">발송됨</option>
          <option value="failed">실패</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <Send className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">캠페인이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">첫 번째 캠페인을 생성해보세요.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              캠페인 생성
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEditCampaign}
              onDelete={handleDeleteCampaign}
              onSend={handleSendCampaign}
            />
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaign}
        domains={domains}
      />
    </div>
  );
}
