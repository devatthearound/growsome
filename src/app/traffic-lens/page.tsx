import { Metadata } from 'next';
import TrafficLensDashboard from '@/components/traffic-lens/Dashboard';

export const metadata: Metadata = {
  title: 'Traffic-Lens Dashboard | Growsome',
  description: '웹 푸시 알림 관리 및 트래픽 분석 대시보드',
};

export default function TrafficLensPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TrafficLensDashboard />
    </div>
  );
}
