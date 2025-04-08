import { Product } from '@/types/product';

const products: { [key: string]: Product } = {
  '4': {
    id: '4',
    name: '베이직 솔루션',
    description: '사업계획서 초안과 MVP 예시 이미지가 필요한 스타트업에 적합',
    price: 300000,
    originalPrice: 500000,
    imageUrl: '/images/products/basic-solution.png',
    category: 'solution',
    features: [
      '40만원 상당의 강의 무료 제공',
      '사업계획서 초안 원본 제공',
      '대화한 챗GPTs 모두 제공',
      '빌드업 마케팅 전자책 제공',
      '주 1회 1시간 줌 미팅'
    ],
    installment: {
      months: 12,
      monthlyPayment: 25000
    }
  },
  '5': {
    id: '5',
    name: '스탠다드 솔루션',
    description: '10페이지 내외 사업계획서 초안과 커서AI 목업이 필요한 기업에 적합',
    price: 990000,
    originalPrice: 1500000,
    imageUrl: '/images/products/standard-solution.png',
    category: 'solution',
    features: [
      '기본 패키지의 모든 혜택 포함',
      '넥스트(NexT)기반 개발 파일 원본 제공',
      '실제 개발 연계 시 30% 할인',
      '우선순위 지원 및 빠른 피드백'
    ],
    installment: {
      months: 12,
      monthlyPayment: 82500
    }
  },
  '6': {
    id: '6',
    name: '프리미엄 솔루션',
    description: '대규모 프로젝트나 특별한 요구사항이 있는 기업에 적합',
    price: 9900000,
    originalPrice: 15000000,
    imageUrl: '/images/products/premium-solution.png',
    category: 'solution',
    features: [
      '프리미엄 패키지의 모든 혜택 포함',
      '맞춤형 컨설팅 제공',
      '전담 매니저 배정',
      '무제한 페이지 작성'
    ],
    installment: {
      months: 12,
      monthlyPayment: 825000
    }
  }
};

export function getProductData(id: string): Product | null {
  return products[id] || null;
} 