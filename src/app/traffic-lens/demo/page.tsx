import { Metadata } from 'next';
import PushNotificationDemo from '@/components/traffic-lens/PushNotificationDemo';

export const metadata: Metadata = {
  title: '푸시 알림 데모 | Traffic-Lens',
  description: '웹 푸시 알림 기능을 테스트해보세요',
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PushNotificationDemo />
    </div>
  );
}
