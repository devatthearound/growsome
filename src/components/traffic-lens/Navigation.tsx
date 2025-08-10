'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Bell, 
  Globe, 
  Users, 
  Settings, 
  TrendingUp,
  Send,
  MousePointer
} from 'lucide-react';

const NavigationItem = ({ 
  href, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean; 
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
);

export default function TrafficLensNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/traffic-lens',
      icon: BarChart3,
      label: '대시보드',
    },
    {
      href: '/traffic-lens/domains',
      icon: Globe,
      label: '도메인 관리',
    },
    {
      href: '/traffic-lens/campaigns',
      icon: Send,
      label: '캠페인 관리',
    },
    {
      href: '/traffic-lens/subscribers',
      icon: Users,
      label: '구독자 관리',
    },
    {
      href: '/traffic-lens/analytics',
      icon: TrendingUp,
      label: '분석 리포트',
    },
    {
      href: '/traffic-lens/settings',
      icon: Settings,
      label: '설정',
    },
    {
      href: '/traffic-lens/demo',
      icon: Bell,
      label: '데모',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Traffic-Lens</h2>
            <p className="text-sm text-gray-500">푸시 알림 관리</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* 빠른 통계 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">빠른 통계</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">총 구독자</span>
              <span className="text-sm font-medium text-gray-900">1,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">오늘 발송</span>
              <span className="text-sm font-medium text-gray-900">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">평균 클릭률</span>
              <span className="text-sm font-medium text-green-600">3.2%</span>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="mt-6">
          <Link
            href="/traffic-lens/campaigns/new"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            새 캠페인 생성
          </Link>
        </div>
      </div>
    </aside>
  );
}
