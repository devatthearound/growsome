'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Chrome API 타입 정의
declare global {
  interface Window {
    chrome?: {
      runtime: {
        sendMessage: (
          extensionId: string,
          message: {
            type: string;
            token: string;
          },
          callback: (response?: { 
            success: boolean;
            error?: string;
          }) => void
        ) => void;
      };
    };
  }
}

export default function ExtensionCallback() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const closeWindow = () => {
    // 여러 방법을 시도
    try {
      window.open('/', '_self');
    } catch (e) {
      console.error('창 닫기 실패:', e);
    }
  };

  useEffect(() => {
    if (token) {
      if (window.chrome?.runtime?.sendMessage) {
        // 타임아웃 설정
        const timeoutId = setTimeout(() => {
          alert('응답 시간이 초과되었습니다.');
          closeWindow();
        }, 5000); // 5초 타임아웃

        try {
          window.chrome.runtime.sendMessage(
            process.env.NEXT_PUBLIC_EXTENSION_ID!,
            { 
              type: 'LOGIN_SUCCESS', 
              token 
            },
            (response) => {
              clearTimeout(timeoutId); // 타임아웃 제거
              
              if (response?.success) {
                console.log('로그인 성공');
                alert('로그인이 완료되었습니다. 이 창은 닫으셔도 됩니다.');
                closeWindow();
              } else {
                console.error('로그인 실패:', response?.error);
                alert(`로그인 처리 중 오류가 발생했습니다: ${response?.error || '알 수 없는 오류'}`);
                closeWindow();
              }
            }
          );
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('메시지 전송 오류:', error);
          alert('확장프로그램과 통신 중 오류가 발생했습니다.');
          closeWindow();
        }
      } else {
        alert('크롬 확장프로그램이 설치되어 있지 않습니다.');
        window.location.href = '/download-extension';
      }
    }
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
        <button 
          onClick={closeWindow}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          창 닫기
        </button>
      </div>
    </div>
  );
} 