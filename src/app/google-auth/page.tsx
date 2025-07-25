'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const GoogleAuthContent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('초기화 중...');

  useEffect(() => {
    const code = searchParams.get('code');
    
    const checkExistingToken = async () => {
      try {
        setStatus('기존 인증 정보 확인 중...');
        const response = await fetch('/api/google-auth/token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setStatus('이미 인증된 계정이 있습니다.');
          return true;
        }
        return false;
      } catch (error) {
        console.error('토큰 확인 중 오류:', error);
        return false;
      }
    };

    const startAuthFlow = async () => {
      try {
        // 기존 토큰 확인
        const hasValidToken = await checkExistingToken();
        if (hasValidToken) return;

        setStatus('인증 URL 요청 중...');
        const response = await fetch(`/api/google-auth`);
        
        if (!response.ok) {
          throw new Error('인증 URL을 가져오는데 실패했습니다');
        }
        
        const { authUrl } = await response.json();
        setStatus('구글 인증 페이지로 리디렉션 중...');
        
        window.open(authUrl, '_blank');
      } catch (error) {
        console.error('인증 오류:', error);
        setStatus('인증 프로세스 초기화 중 오류가 발생했습니다.');
      }
    };

    if (code) {
      // 인증 콜백 처리
      setStatus('인증 코드 처리 중...');
    } else {
      startAuthFlow();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">구글 인증</h1>
      <p className="text-lg">{status}</p>
      <p className="mt-4">외부 브라우저에서 인증을 완료해주세요.</p>
    </div>
  );
};

export default function GoogleAuthPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">구글 인증</h1>
        <p className="text-lg">로딩 중...</p>
      </div>
    }>
      <GoogleAuthContent />
    </Suspense>
  );
}