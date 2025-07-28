'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GoogleAuthCallbackPage = () => {
  const [status, setStatus] = useState('인증 코드 처리 중...');
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('구글 인증 콜백 처리:', { code: !!code, state });
        
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }
        
        setStatus('인증 코드 교환 중...');
        const response = await fetch(`/api/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state })
        });
        
        if (!response.ok) {
          throw new Error('인증 코드 교환 중 오류가 발생했습니다.');
        }

        setStatus('인증 성공! 리디렉션 중...');
        
        // Coupas 앱으로 리다이렉트 시도
        try {
          window.location.href = `coupas-auth://google-auth/success`;
          
          // 2초 후에도 페이지가 그대로라면 앱이 설치되지 않은 것
          setTimeout(() => {
            setStatus('인증이 완료되었습니다. Coupas 앱으로 돌아가서 확인해주세요.');
          }, 2000);
        } catch (error) {
          setStatus('인증이 완료되었습니다. Coupas 앱으로 돌아가서 확인해주세요.');
        }
      } catch (error) {
        setStatus(`인증 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    };
    
    handleCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">구글 인증 처리</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
};

export default GoogleAuthCallbackPage;