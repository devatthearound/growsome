'use client'
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import "./globals.css";
import styled, { createGlobalStyle } from 'styled-components';
import Script from 'next/script';

// 기본 imports
import StyledComponentsRegistry from '../lib/registry';
import { AuthProvider } from './contexts/AuthContext';
import { CoupangApiProvider } from './contexts/CoupangApiContext';
import { EmailProvider } from './contexts/EmailContext';

// 컴포넌트 imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ClarityAnalytics from '../components/common/ClarityAnalytics';
import { GoogleAnalytics } from '../components/common/GoogleAnalytics';
import { EnhancedGoogleAnalytics } from '../components/common/EnhancedGoogleAnalytics';
import { ErrorTracker } from '../components/common/ErrorTracker';
import AuthErrorBoundary from '../components/error/AuthErrorBoundary';
import KakaoChatButton from './components/common/KakaoChatButton';

// FontAwesome 가져오기 (에러 방지를 위해 try-catch로 감쌈)
try {
  import('../lib/fontawesome');
} catch (error) {
  console.warn('FontAwesome 로딩 실패:', error);
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCoursesPage = pathname === '/courses';

  if (isCoursesPage) {
    return (
      <CoursesContainer>
        {children}
      </CoursesContainer>
    );
  }

  return (
    <AppContainer>
      <Header />
      <Main>
        {children}
      </Main>
      <Footer />
      <KakaoChatButton />
    </AppContainer>
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id=GTM-TNM368S3'+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TNM368S3');
          `}
        </Script>
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning={true}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TNM368S3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ClarityAnalytics />
          <EnhancedGoogleAnalytics />
          <ErrorTracker />
          <AuthProvider>
            <CoupangApiProvider>
              <EmailProvider>
                <AuthErrorBoundary>
                  <LayoutContent>
                    {children}
                  </LayoutContent>
                </AuthErrorBoundary>
              </EmailProvider>
            </CoupangApiProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Main = styled.main`
  flex: 1;
  margin: 0;
  margin-top: 70px;
  
  @media (min-width: 769px) {
    padding-bottom: 0;
  }
`;

const CoursesContainer = styled.div`
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;