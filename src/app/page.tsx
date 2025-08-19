import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import HomeClient from './HomeClient'
import StructuredData from '@/components/seo/StructuredData'

// 메인 페이지 메타데이터
export const metadata: Metadata = generatePageMetadata(
  'Growsome | AI 기반 비즈니스 성장 플랫폼',
  'AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸. 스타트업부터 대기업까지 검증된 성장 솔루션을 제공합니다.',
  '/',
  '/images/og/growsome-main.jpg',
  ['AI', '비즈니스성장', '디지털마케팅', '자동화', '데이터분석', '스타트업', '그로우썸']
)

export default function HomePage() {
  // 메인 페이지 FAQ 데이터
  const faqData = {
    questions: [
      {
        question: 'Growsome은 어떤 서비스인가요?',
        answer: 'Growsome은 AI 기반의 비즈니스 성장 플랫폼으로, 자동화 솔루션과 데이터 분석을 통해 기업의 성장을 지원합니다.'
      },
      {
        question: 'AI 자동화는 어떻게 작동하나요?',
        answer: '머신러닝과 자연어 처리 기술을 활용하여 반복적인 업무를 자동화하고, 데이터 기반의 인사이트를 제공합니다.'
      },
      {
        question: '어떤 기업이 Growsome을 사용할 수 있나요?',
        answer: '스타트업부터 대기업까지 모든 규모의 기업이 사용할 수 있으며, 특히 디지털 전환을 추진하는 기업에게 적합합니다.'
      },
      {
        question: '도입 비용은 어떻게 되나요?',
        answer: '기업의 규모와 필요한 솔루션에 따라 맞춤형 가격을 제공합니다. 무료 상담을 통해 정확한 견적을 받아보실 수 있습니다.'
      }
    ]
  }

  return (
    <>
      {/* 구조화된 데이터 */}
      <StructuredData type="organization" data={{}} />
      <StructuredData type="website" data={{}} />
      <StructuredData type="faq" data={faqData} />
      
      {/* 실제 페이지 콘텐츠 */}
      <HomeClient />
    </>
  )
}
