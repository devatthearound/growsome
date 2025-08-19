import Script from 'next/script'

interface Organization {
  name: string
  description: string
  url: string
  logo: string
  contactPoint?: {
    telephone: string
    contactType: string
    areaServed: string
    availableLanguage: string[]
  }
  sameAs?: string[]
}

interface Article {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    name: string
    url?: string
  }
  publisher: Organization
  mainEntityOfPage: string
  wordCount: number
  keywords: string[]
  category?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

interface StructuredDataProps {
  type: 'organization' | 'article' | 'website' | 'breadcrumb' | 'faq'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
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
            "https://twitter.com/growsome_kr",
            "https://www.youtube.com/@growsome"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "서울특별시 강남구 테헤란로",
            "addressLocality": "서울",
            "addressCountry": "KR"
          },
          "foundingDate": "2023",
          "numberOfEmployees": "10-50",
          "industry": "Technology, Business Consulting",
          "slogan": "AI로 성장하는 비즈니스"
        }

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.headline,
          "description": data.description,
          "image": data.image,
          "datePublished": data.datePublished,
          "dateModified": data.dateModified,
          "author": {
            "@type": "Person",
            "name": data.author.name,
            "url": data.author.url || "https://growsome.kr/about"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Growsome",
            "logo": {
              "@type": "ImageObject",
              "url": "https://growsome.kr/images/logo.png",
              "width": 600,
              "height": 60
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.mainEntityOfPage
          },
          "wordCount": data.wordCount,
          "keywords": data.keywords.join(', '),
          "articleSection": data.category || "Business",
          "inLanguage": "ko-KR",
          "isAccessibleForFree": true,
          "copyrightYear": new Date().getFullYear(),
          "copyrightHolder": {
            "@type": "Organization",
            "name": "Growsome"
          }
        }

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Growsome",
          "url": "https://growsome.kr",
          "description": "AI 기반 비즈니스 성장 플랫폼",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://growsome.kr/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Growsome",
            "logo": "https://growsome.kr/images/logo.png"
          },
          "inLanguage": "ko-KR",
          "copyrightYear": new Date().getFullYear(),
          "creator": {
            "@type": "Organization",
            "name": "Growsome"
          }
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: BreadcrumbItem, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions.map((faq: FAQItem) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }

      default:
        return null
    }
  }

  const structuredData = generateStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}
