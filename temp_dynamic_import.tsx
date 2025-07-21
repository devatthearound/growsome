'use client'
import React, { Suspense } from 'react';
import "./globals.css";
import Script from 'next/script';
import dynamic from 'next/dynamic';

// 모든 컴포넌트를 동적 import로 로드 (SSR 문제 방지)
const StyledComponentsRegistry = dynamic(() => import('../lib/registry'), { ssr: false });
const AuthProvider = dynamic(() => import('./contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })), { ssr: false });
const CoupangApiProvider = dynamic(() => import('./contexts/CoupangApiContext').then(mod => ({ default: mod.CoupangApiProvider })), { ssr: false });
const EmailProvider = dynamic(() => import('./contexts/EmailContext').then(mod => ({ default: mod.EmailProvider })), { ssr: false });

// 로딩 컴포넌트
function LoadingFallback() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>로딩 중...</h2>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id=GTM-TNM368S3'+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TNM368S3');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TNM368S3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Suspense fallback={<LoadingFallback />}>
          <StyledComponentsRegistry>
            <AuthProvider>
              <CoupangApiProvider>
                <EmailProvider>
                  <div style={{ padding: '20px' }}>
                    <h1>동적 Import 테스트</h1>
                    <p>모든 컴포넌트가 동적으로 로드됩니다.</p>
                    {children}
                  </div>
                </EmailProvider>
              </CoupangApiProvider>
            </AuthProvider>
          </StyledComponentsRegistry>
        </Suspense>
      </body>
    </html>
  );
}