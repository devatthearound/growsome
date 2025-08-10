import { ReactNode } from 'react';
import TrafficLensNavigation from '@/components/traffic-lens/Navigation';

export default function TrafficLensLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 사이드 네비게이션 */}
        <TrafficLensNavigation />
        
        {/* 메인 컨텐츠 */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
