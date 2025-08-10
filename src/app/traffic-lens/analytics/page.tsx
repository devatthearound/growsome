import { Metadata } from 'next';
import AnalyticsManagement from '@/components/traffic-lens/AnalyticsManagement';

export const metadata: Metadata = {
  title: '분석 리포트 | Traffic-Lens',
  description: '푸시 알림 캠페인 성과 및 구독자 분석 리포트',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsManagement />
    </div>
  );
}