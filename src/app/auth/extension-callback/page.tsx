'use client';

import React, { useEffect, Suspense } from 'react';
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

function ExtensionCallbackContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      if (window.chrome?.runtime?.sendMessage) {
        window.chrome.runtime.sendMessage(
          process.env.NEXT_PUBLIC_EXTENSION_ID!,
          { 
            type: 'LOGIN_SUCCESS', 
            token 
          },
          async (response) => {
            if (response?.success) {
              window.close();
            } else {
              alert(`로그인 처리 중 오류가 발생했습니다: ${response?.error || '알 수 없는 오류'}`);
            }
          }
        );
      } else {
        alert('크롬 확장프로그램이 설치되어 있지 않습니다.');
        window.location.href = '/download-extension';
      }
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>처리 중입니다...</p>
    </div>
  );
}

export default function ExtensionCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩중...</p>
      </div>
    }>
      <ExtensionCallbackContent />
    </Suspense>
  );
} 