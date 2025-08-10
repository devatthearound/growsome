import { Metadata } from 'next';
import DomainManagement from '@/components/traffic-lens/DomainManagement';

export const metadata: Metadata = {
  title: '도메인 관리 | Traffic-Lens',
  description: '웹사이트 도메인 등록 및 관리',
};

export default function DomainsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DomainManagement />
    </div>
  );
}
