'use client'
import React from 'react';
import "./globals.css";
import StyledComponentsRegistry from '../lib/registry';
import { AuthProvider } from './contexts/AuthContext';
import { CoupangApiProvider } from './contexts/CoupangApiContext';
import { EmailProvider } from './contexts/EmailContext';
import AuthErrorBoundary from '../components/error/AuthErrorBoundary';
import Script from 'next/script';

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
        <StyledComponentsRegistry>
          <AuthProvider>
            <CoupangApiProvider>
              <EmailProvider>
                <AuthErrorBoundary>
                  <div style={{ padding: '20px' }}>
                    <h1>단계별 테스트: AuthErrorBoundary 추가됨</h1>
                    <p>AuthErrorBoundary가 정상 작동합니다.</p>
                    {children}
                  </div>
                </AuthErrorBoundary>
              </EmailProvider>
            </CoupangApiProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}