import { Metadata } from 'next';
import CampaignManagement from '@/components/traffic-lens/CampaignManagement';

export const metadata: Metadata = {
  title: '캠페인 관리 | Traffic-Lens',
  description: '푸시 알림 캠페인 생성 및 관리',
};

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CampaignManagement />
    </div>
  );
}
