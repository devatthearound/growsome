import { Metadata } from 'next';
import SettingsManagement from '@/components/traffic-lens/SettingsManagement';

export const metadata: Metadata = {
  title: '설정 | Traffic-Lens',
  description: 'Traffic-Lens 시스템 설정 및 도메인 관리',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsManagement />
    </div>
  );
}