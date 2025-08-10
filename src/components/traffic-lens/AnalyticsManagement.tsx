'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Send, 
  MousePointer,
  Calendar,
  Globe,
  Eye,
  ChevronDown,
  Download,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Clock,
  MapPin
} from 'lucide-react';
import { TLDomain, APIResponse, DashboardStats } from '@/types/traffic-lens';
import trafficLensService from '@/services/traffic-lens/TrafficLensService';
import CountryFlag from '@/components/traffic-lens/CountryFlag';

interface MetricCard {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: any;
  color: string;
  subtitle?: string;
}

interface CampaignAnalytics {
  id: number;
  title: string;
  domain: string;
  sentAt: string;
  totalSent: number;
  totalClicks: number;
  totalViews: number;
  clickRate: number;
  viewRate: number;
  status: string;
  targetType: string;
}

interface GrowthData {
  date: string;
  totalSubscribers: number;
  newSubscribers: number;
  unsubscribed: number;
  netGrowth: number;
  activeSubscribers: number;
}

interface CountryData {
  country: string;
  countryName: string;
  subscribers: number;
  percentage: number;
  growth: number;
}

const MetricCard = ({ metric }: { metric: MetricCard }) => {
  const Icon = metric.icon;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
          {metric.subtitle && (
            <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
          )}
          {metric.change && (
            <div className={`flex items-center mt-2 text-sm ${
              metric.changeType === 'increase' ? 'text-green-600' : 
              metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.changeType === 'increase' && <ArrowUp className="h-4 w-4 mr-1" />}
              {metric.changeType === 'decrease' && <ArrowDown className="h-4 w-4 mr-1" />}
              {metric.change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${metric.color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const CampaignTable = ({ campaigns, loading }: { campaigns: CampaignAnalytics[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">캠페인 성과 분석</h3>
        <p className="text-sm text-gray-600 mt-1">최근 캠페인들의 상세 성과 지표</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                캠페인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                도메인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발송일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발송 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                클릭 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                클릭률
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Send className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                      <div className="text-sm text-gray-500 capitalize">{campaign.targetType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{campaign.domain}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{campaign.totalSent.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-600 font-medium">{campaign.totalViews.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{campaign.viewRate.toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">{campaign.totalClicks.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium flex items-center ${
                    campaign.clickRate >= 5 ? 'text-green-600' : 
                    campaign.clickRate >= 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.clickRate >= 5 ? <TrendingUp className="h-4 w-4 mr-1" /> :
                     campaign.clickRate >= 2 ? <Activity className="h-4 w-4 mr-1" /> :
                     <TrendingDown className="h-4 w-4 mr-1" />}
                    {campaign.clickRate.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-800' : 
                    campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' : 
                    campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status === 'sent' ? '발송됨' : 
                     campaign.status === 'sending' ? '발송 중' : 
                     campaign.status === 'scheduled' ? '예약됨' : '대기'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">캠페인이 없습니다</h3>
            <p className="text-gray-500">선택한 기간에 발송된 캠페인이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GrowthChart = ({ data, loading }: { data: GrowthData[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.totalSubscribers), 1);
  const maxNew = Math.max(...data.map(d => d.newSubscribers), 1);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">구독자 증가 추이</h3>
          <p className="text-sm text-gray-600 mt-1">일별 구독자 변화량</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">총 구독자</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">신규 구독자</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">탈퇴자</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-1 overflow-x-auto">
        {data.slice(-30).map((item, index) => (
          <div key={index} className="flex-shrink-0 flex flex-col items-center min-w-0" style={{ width: '24px' }}>
            <div className="w-full flex flex-col justify-end h-48 space-y-0.5">
              {/* 총 구독자 바 */}
              <div 
                className="bg-blue-500 rounded-t"
                style={{ height: `${(item.totalSubscribers / maxValue) * 80}%` }}
                title={`${item.date}: 총 구독자 ${item.totalSubscribers.toLocaleString()}`}
              ></div>
              
              {/* 신규 구독자 바 */}
              <div 
                className="bg-green-500 rounded-sm"
                style={{ height: `${Math.max((item.newSubscribers / maxNew) * 20, 2)}px` }}
                title={`신규 구독자: ${item.newSubscribers}`}
              ></div>
              
              {/* 탈퇴자 바 */}
              {item.unsubscribed > 0 && (
                <div 
                  className="bg-red-500 rounded-sm"
                  style={{ height: `${Math.max((item.unsubscribed / maxNew) * 20, 2)}px` }}
                  title={`탈퇴자: ${item.unsubscribed}`}
                ></div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center transform -rotate-45 origin-top-left whitespace-nowrap">
              {new Date(item.date).toLocaleDateString('ko-KR', { 
                month: 'numeric', 
                day: 'numeric' 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CountryChart = ({ data, loading }: { data: CountryData[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.subscribers, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">구독자 지역 분포</h3>
          <p className="text-sm text-gray-600 mt-1">국가별 구독자 현황</p>
        </div>
        <div className="text-sm text-gray-500">
          총 {total.toLocaleString()}명
        </div>
      </div>
      
      <div className="space-y-4">
        {data.slice(0, 10).map((item, index) => {
          const percentage = item.percentage;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2 w-20">
                  <CountryFlag countryCode={item.country} />
                  <span className="text-sm font-medium text-gray-900">
                    {item.countryName}
                  </span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 min-w-32">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-sm text-gray-900 font-medium min-w-16 text-right">
                  {item.subscribers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 min-w-12 text-right">
                  {percentage.toFixed(1)}%
                </div>
                {item.growth !== 0 && (
                  <div className={`text-sm font-medium min-w-12 text-right flex items-center ${
                    item.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.growth > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(item.growth).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">지역별 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default function AnalyticsManagement() {
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<TLDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30');
  
  // 데이터 상태
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignAnalytics[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  
  // 로딩 상태
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [growthLoading, setGrowthLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (domains.length > 0) {
      fetchAnalyticsData();
    }
  }, [selectedDomain, dateRange, domains]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // 도메인 목록 가져오기
      const domainsResponse = await trafficLensService.getDomains();
      if (domainsResponse.success && domainsResponse.data) {
        setDomains(domainsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // 대시보드 개요 데이터
      const params = {
        period: parseInt(dateRange),
        ...(selectedDomain && { domainId: parseInt(selectedDomain) })
      };

      try {
        const dashboardResponse = await trafficLensService.getDashboardStats(params);
        if (dashboardResponse.success && dashboardResponse.data) {
          // 데이터 검증 및 null 체크
          const safeData = {
            totalSubscribers: dashboardResponse.data.totalSubscribers || 0,
            activeSubscribers: dashboardResponse.data.activeSubscribers || 0,
            totalCampaigns: dashboardResponse.data.totalCampaigns || 0,
            sentNotifications: dashboardResponse.data.sentNotifications || 0,
            clickRate: dashboardResponse.data.clickRate || 0,
            recentCampaigns: dashboardResponse.data.recentCampaigns || [],
            subscriberGrowth: dashboardResponse.data.subscriberGrowth || [],
            topPerformingCampaigns: dashboardResponse.data.topPerformingCampaigns || [],
            todayNotifications: dashboardResponse.data.todayNotifications || 0,
            averageClickRate: dashboardResponse.data.averageClickRate || 0
          };
          setDashboardStats(safeData);
          console.log('대시보드 데이터 로드 성공');
        } else {
          console.warn('대시보드 데이터 없음:', dashboardResponse);
          // 폴백 데이터 설정
          setDashboardStats({
            totalSubscribers: 0,
            activeSubscribers: 0,
            totalCampaigns: 0,
            sentNotifications: 0,
            clickRate: 0,
            recentCampaigns: [],
            subscriberGrowth: [],
            topPerformingCampaigns: [],
            todayNotifications: 0,
            averageClickRate: 0
          });
        }
      } catch (dashboardError) {
        console.error('대시보드 데이터 로드 실패:', dashboardError);
        // 폴백 데이터 설정
        setDashboardStats({
          totalSubscribers: 0,
          activeSubscribers: 0,
          totalCampaigns: 0,
          sentNotifications: 0,
          clickRate: 0,
          recentCampaigns: [],
          subscriberGrowth: [],
          topPerformingCampaigns: [],
          todayNotifications: 0,
          averageClickRate: 0
        });
      }

      // 캠페인 분석 데이터
      setCampaignsLoading(true);
      try {
        const campaignParams = new URLSearchParams({
          period: dateRange,
          ...(selectedDomain && { domainId: selectedDomain })
        });
        
        const campaignResponse = await trafficLensService.getCampaignAnalytics({
          period: parseInt(dateRange),
          ...(selectedDomain && { domainId: parseInt(selectedDomain) })
        });
        
        if (campaignResponse.success && campaignResponse.data) {
          setCampaigns(campaignResponse.data.campaigns || []);
          console.log('캐페인 데이터 로드 성공');
        } else {
          console.warn('캐페인 데이터 없음');
          setCampaigns([]);
        }
      } catch (campaignError) {
        console.error('캐페인 데이터 로드 실패:', campaignError);
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }

      // 성장 분석 데이터
      setGrowthLoading(true);
      try {
        const growthParams = new URLSearchParams({
          period: dateRange,
          ...(selectedDomain && { domainId: selectedDomain })
        });
        
        const growthResponse = await trafficLensService.getGrowthAnalytics({
          period: parseInt(dateRange),
          ...(selectedDomain && { domainId: parseInt(selectedDomain) })
        });
        
        if (growthResponse.success && growthResponse.data) {
          setGrowthData(growthResponse.data.growthData || []);
          setCountryData(growthResponse.data.countryData || []);
          console.log('성장 데이터 로드 성공');
        } else {
          console.warn('성장 데이터 없음');
          setGrowthData([]);
          setCountryData([]);
        }
      } catch (growthError) {
        console.error('성장 데이터 로드 실패:', growthError);
        setGrowthData([]);
        setCountryData([]);
      } finally {
        setGrowthLoading(false);
      }

    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        campaigns: campaigns.map(campaign => ({
          '캠페인명': campaign.title,
          '도메인': campaign.domain,
          '발송일': campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString('ko-KR') : '',
          '발송수': campaign.totalSent,
          '조회수': campaign.totalViews,
          '클릭수': campaign.totalClicks,
          '클릭률': `${campaign.clickRate}%`,
          '조회율': `${campaign.viewRate}%`,
          '상태': campaign.status
        })),
        countries: countryData.map(country => ({
          '국가': country.countryName,
          '구독자수': country.subscribers,
          '비율': `${country.percentage}%`,
          '증가율': `${country.growth}%`
        }))
      };

      // 캠페인 데이터 CSV
      const campaignCsv = [
        Object.keys(exportData.campaigns[0] || {}).join(','),
        ...exportData.campaigns.map(row => Object.values(row).join(','))
      ].join('\n');

      // 국가별 데이터 CSV
      const countryCsv = [
        Object.keys(exportData.countries[0] || {}).join(','),
        ...exportData.countries.map(row => Object.values(row).join(','))
      ].join('\n');

      // 종합 리포트
      const combinedCsv = `Traffic-Lens 분석 리포트\n\n캠페인 성과\n${campaignCsv}\n\n\n국가별 구독자\n${countryCsv}`;

      const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `traffic-lens-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('내보내기에 실패했습니다.');
    }
  };

  // 메트릭 카드 데이터 생성
  const getMetricCards = (): MetricCard[] => {
    // dashboardStats가 null이거나 필요한 속성이 없는 경우 기본값 반환
    if (!dashboardStats || 
        typeof dashboardStats.totalSubscribers === 'undefined' ||
        typeof dashboardStats.activeSubscribers === 'undefined' ||
        typeof dashboardStats.todayNotifications === 'undefined' ||
        typeof dashboardStats.averageClickRate === 'undefined') {
      return [
        { title: '총 구독자', value: '-', icon: Users, color: 'bg-blue-500' },
        { title: '오늘 발송', value: '-', icon: Send, color: 'bg-green-500' },
        { title: '평균 클릭률', value: '-', icon: MousePointer, color: 'bg-purple-500' },
        { title: '활성 구독자', value: '-', icon: Activity, color: 'bg-orange-500' }
      ];
    }

    // 안전한 값 추출
    const totalSubscribers = dashboardStats.totalSubscribers || 0;
    const activeSubscribers = dashboardStats.activeSubscribers || 0;
    const todayNotifications = dashboardStats.todayNotifications || 0;
    const averageClickRate = dashboardStats.averageClickRate || 0;
    const subscriberGrowth = dashboardStats.subscriberGrowth || [];

    return [
      {
        title: '총 구독자',
        value: totalSubscribers.toLocaleString(),
        change: subscriberGrowth.length > 1 ? 
          `+${subscriberGrowth[subscriberGrowth.length - 1]?.subscribers || 0} (어제)` : undefined,
        changeType: 'increase' as const,
        icon: Users,
        color: 'bg-blue-500',
        subtitle: '전체 활성 구독자'
      },
      {
        title: '오늘 발송',
        value: todayNotifications.toLocaleString(),
        change: '알림 발송 수',
        icon: Send,
        color: 'bg-green-500',
        subtitle: '금일 총 발송량'
      },
      {
        title: '평균 클릭률',
        value: `${averageClickRate.toFixed(1)}%`,
        change: averageClickRate >= 3 ? '양호' : '개선 필요',
        changeType: averageClickRate >= 3 ? 'increase' : 'decrease',
        icon: MousePointer,
        color: 'bg-purple-500',
        subtitle: `${dateRange}일 평균`
      },
      {
        title: '활성 구독자',
        value: activeSubscribers.toLocaleString(),
        change: `${((activeSubscribers / Math.max(totalSubscribers, 1)) * 100).toFixed(1)}% 활성도`,
        changeType: 'neutral' as const,
        icon: Activity,
        color: 'bg-orange-500',
        subtitle: '최근 접속 기준'
      }
    ];
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
              분석 리포트
            </h1>
            <p className="mt-2 text-gray-600">푸시 알림 캠페인 성과 및 구독자 분석 대시보드</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* 필터 */}
            <div className="flex space-x-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">모든 도메인</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id.toString()}>
                    {domain.siteName}
                  </option>
                ))}
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7">최근 7일</option>
                <option value="30">최근 30일</option>
                <option value="90">최근 90일</option>
                <option value="365">최근 1년</option>
              </select>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex space-x-2">
              <button
                onClick={fetchAnalyticsData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </button>
              
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getMetricCards().map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GrowthChart data={growthData} loading={growthLoading} />
        <CountryChart data={countryData} loading={growthLoading} />
      </div>

      {/* 캠페인 성과 테이블 */}
      <CampaignTable campaigns={campaigns} loading={campaignsLoading} />
    </div>
  );
}