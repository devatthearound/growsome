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
        
        // 타임아웃 설정 (10초)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`/api/google-auth`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '인증 URL을 가져오는데 실패했습니다');
        }
        
        const { authUrl } = await response.json();
        setStatus('구글 인증 페이지로 리디렉션 중...');
        
        window.open(authUrl, '_blank');
      } catch (error) {
        console.error('인증 오류:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          setStatus('서버 응답 시간이 초과되었습니다. 나중에 다시 시도해주세요.');
        } else {
          setStatus(`오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
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