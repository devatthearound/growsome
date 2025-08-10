'use client';

import { useState, useEffect } from 'react';
import { Bell, Users, TrendingUp, MousePointer, Plus, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/types/traffic-lens';

const StatCard = ({ icon: Icon, title, value, trend, description }: {
  icon: any;
  title: string;
  value: string | number;
  trend?: string;
  description: string;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="text-right">
          <p className="text-sm text-green-600 font-medium">{trend}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      )}
    </div>
  </div>
);

const QuickActionCard = ({ icon: Icon, title, description, href, color = 'blue' }: {
  icon: any;
  title: string;
  description: string;
  href: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  };

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
};

export default function TrafficLensDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 실제 데이터 가져오기
    const fetchStats = async () => {
      try {
        // 임시 데이터
        const mockStats: DashboardStats = {
          totalSubscribers: 1250,
          todayNotifications: 42,
          averageClickRate: 3.2,
          activeSubscribers: 1180,
          recentCampaigns: [],
          subscriberGrowth: [],
          campaignPerformance: [],
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Traffic-Lens Dashboard</h1>
        <p className="mt-2 text-gray-600">웹 푸시 알림 및 트래픽 분석 관리</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="총 구독자"
          value={stats?.totalSubscribers.toLocaleString() || '0'}
          trend="+12%"
          description="지난 30일 대비"
        />
        <StatCard
          icon={Bell}
          title="오늘 발송"
          value={stats?.todayNotifications || 0}
          trend="+5%"
          description="어제 대비"
        />
        <StatCard
          icon={MousePointer}
          title="평균 클릭률"
          value={`${stats?.averageClickRate || 0}%`}
          trend="+0.8%"
          description="지난 주 대비"
        />
        <StatCard
          icon={TrendingUp}
          title="활성 구독자"
          value={stats?.activeSubscribers.toLocaleString() || '0'}
          description="최근 30일 활동"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            icon={Plus}
            title="새 캠페인"
            description="푸시 알림 캠페인을 생성하고 발송하세요"
            href="/traffic-lens/campaigns/new"
            color="blue"
          />
          <QuickActionCard
            icon={Users}
            title="도메인 관리"
            description="웹사이트 도메인을 등록하고 관리하세요"
            href="/traffic-lens/domains"
            color="green"
          />
          <QuickActionCard
            icon={BarChart3}
            title="분석 보고서"
            description="상세한 성과 분석을 확인하세요"
            href="/traffic-lens/analytics"
            color="purple"
          />
          <QuickActionCard
            icon={Settings}
            title="설정"
            description="알림 설정과 자동화를 관리하세요"
            href="/traffic-lens/settings"
            color="orange"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">최근 캠페인</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">새로운 기능 안내</p>
                    <p className="text-sm text-gray-500">2시간 전 • 1,250명 발송</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">3.2% 클릭률</p>
                    <p className="text-xs text-gray-500">40번 클릭</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/traffic-lens/campaigns"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                모든 캠페인 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Subscriber Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">구독자 증가</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { date: '오늘', count: 25, total: 1250 },
                { date: '어제', count: 18, total: 1225 },
                { date: '2일 전', count: 32, total: 1207 },
                { date: '3일 전', count: 15, total: 1175 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.date}</p>
                    <p className="text-sm text-gray-500">총 {item.total.toLocaleString()}명</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">+{item.count}</p>
                    <p className="text-xs text-gray-500">신규 구독</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/traffic-lens/subscribers"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                구독자 관리 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
