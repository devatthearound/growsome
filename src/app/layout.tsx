'use client'
import React, { useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Head from 'next/head';
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
import SafeGoogleAnalytics from '../components/common/SafeGoogleAnalytics';
import SafeEnhancedGoogleAnalytics from '../components/common/SafeEnhancedGoogleAnalytics';
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
        
        {/* SEO 메타태그 */}
        <title>Growsome | AI 기반 비즈니스 성장 플랫폼</title>
        <meta name="description" content="AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸. 스타트업부터 대기업까지 검증된 성장 솔루션을 제공합니다." />
        <meta name="keywords" content="AI, 비즈니스성장, 디지털마케팅, 자동화, 데이터분석, 스타트업, 그로우썸, 마케팅자동화, 비즈니스컨설팅" />
        <meta name="author" content="Growsome Team" />
        
        {/* 검색엔진 인증 */}
        <meta name="google-site-verification" content="Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc" />
        <meta name="naver-site-verification" content="test-naver-verification-code-will-set-later" />
        <meta name="msvalidate.01" content="test-bing-verification-code-will-set-later" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Growsome | AI 기반 비즈니스 성장 플랫폼" />
        <meta property="og:description" content="AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸" />
        <meta property="og:url" content="https://growsome.kr" />
        <meta property="og:site_name" content="Growsome" />
        <meta property="og:image" content="https://growsome.kr/images/og/growsome-main.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ko_KR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@growsome_kr" />
        <meta name="twitter:title" content="Growsome | AI 기반 비즈니스 성장 플랫폼" />
        <meta name="twitter:description" content="AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸" />
        <meta name="twitter:image" content="https://growsome.kr/images/og/growsome-main.jpg" />
        
        {/* 추가 메타태그 */}
        <meta name="theme-color" content="#667eea" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://growsome.kr" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 구조화된 데이터 (JSON-LD) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Growsome",
              "description": "AI 기반 비즈니스 성장 플랫폼",
              "url": "https://growsome.kr",
              "logo": "https://growsome.kr/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+82-2-1234-5678",
                "contactType": "customer service",
                "areaServed": "KR",
                "availableLanguage": ["Korean", "English"]
              },
              "sameAs": [
                "https://www.linkedin.com/company/growsome",
                "https://twitter.com/growsome_kr"
              ]
            }
          `}
        </script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id=GTM-TNM368S3'+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TNM368S3');
          `}
        </Script>
        <SafeGoogleAnalytics />
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
          <Suspense fallback={null}>
            <SafeGoogleAnalytics />
          </Suspense>
          <Suspense fallback={null}>
            <SafeEnhancedGoogleAnalytics />
          </Suspense>
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