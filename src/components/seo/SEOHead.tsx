import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  noindex?: boolean
  structuredData?: any
}

export default function SEOHead({
  title = 'Growsome | AI 기반 비즈니스 성장 플랫폼',
  description = 'AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸. 스타트업부터 대기업까지 검증된 성장 솔루션을 제공합니다.',
  keywords = ['AI', '비즈니스성장', '디지털마케팅', '자동화', '데이터분석', '스타트업', '그로우썸'],
  canonicalUrl,
  ogImage = '/images/og/growsome-main.jpg',
  ogType = 'website',
  noindex = false,
  structuredData
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growsome.kr'
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  return (
    <Head>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Growsome Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Korean" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* 로봇 크롤링 설정 */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content="index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1" />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Growsome" />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="ko_KR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@growsome_kr" />
      <meta name="twitter:creator" content="@growsome_kr" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* 추가 메타태그 */}
      <meta name="theme-color" content="#667eea" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* 검증 메타태그 */}
      {process.env.GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
      )}
      {process.env.NAVER_SITE_VERIFICATION && (
        <meta name="naver-site-verification" content={process.env.NAVER_SITE_VERIFICATION} />
      )}
      {process.env.BING_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.BING_VERIFICATION} />
      )}
      
      {/* 구조화된 데이터 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* 기본 파비콘 */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
}
