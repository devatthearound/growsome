import React from 'react';
import { faGlobe, faCode, faRocket } from '@fortawesome/free-solid-svg-icons';
import ClientProjectDetail from './ClientProjectDetail';

// 프로젝트 데이터 (실제로는 API나 데이터베이스에서 가져올 것)
const projectData = {
    skykey: {
      title: '스카이키',
      description: '급매 부동산 데이터를 제공하는 투자 지원 플랫폼',
      category: 'Web Platform',
      client: '스카이키',
      year: '2024~2025',
      mainImage: '/images/projects/skykey/screen1.png',
      overview: '스카이키는 부동산 투자자를 위한 데이터 기반 의사결정 플랫폼입니다.전국의 부동산 매물을 수집하여 급매 및 시세 대비 저렴한 매물을 효율적으로 선별하고, 투자자들에게 보다 신속한 의사결정을 지원하는 서비스입니다.',
      challenge: '✔ 방대한 부동산 데이터의 실시간 수집 – 부동산 시장의 데이터는 다양한 출처에서 비정형적으로 제공되므로 이를 정리하고 분석하는 과정이 필요했습니다. ✔ 급매 물건의 신속한 식별 – 일반 매물과 차별화된 급매 및 저평가 매물을 빠르게 탐색하여 투자 기회를 포착하는 것이 중요했습니다. ✔ 사용자 친화적인 정보 제공 – 복잡한 투자 데이터를 쉽고 직관적으로 시각화하여 제공하는 것이 핵심 과제였습니다.',
      solution: 'AI 알고리즘을 개발하여 급매 물건을 자동으로 감지하고, 투자 가치를 평가하는 시스템을 구축했습니다. 사용자 친화적인 인터페이스를 통해 복잡한 데이터를 쉽게 이해할 수 있도록 시각화했습니다.',
      features: [
        {
          icon: faGlobe,
          title: '부동산 급매 정보 크롤링 및 데이터 분석',
          description: '다양한 부동산 사이트 및 공공 데이터를 수집하여 급매 가능성이 높은 매물을 추출, 가격 변동, 입지 조건, 최근 거래 이력 등을 분석하여 투자 기회를 발굴'
        },
        {
          icon: faCode,
          title: '사용자 친화적인 UI/UX 제공',
          description: '실시간 급매 정보를 한눈에 볼 수 있는 대시보드 설계, 원하는 지역과 조건에 따라 필터링 및 검색 기능 제공'
        },
        {
          icon: faRocket,
          title: '투자 분석 리포트 (향후 업데이트 예정)',
          description: '향후 거래 이력, 인구 통계, 개발 계획 등 추가적인 투자 인사이트 제공, AI 분석 기능을 도입하여 데이터 기반 투자 의사결정 지원'
        }
      ],
      images: [
        '/images/projects/skykey/screen2.png',
        '/images/projects/skykey/screen3.png'
      ],
      bgColor: '#514FE4',
      imageBgColor: '#E0E0E0',
      link: 'https://skykey.co.kr'
    },
    withslow: {
      title: '느린걸음 플러스',
      description: '느린걸음 플러스는 발달장애아동 매칭플랫폼입니다.',
      category: 'Social Network Platform',
      client: '느린걸음 플러스',
      year: '2024~2025',
      mainImage: '/images/projects/withslow/screen1.png',
      overview: '느린걸음 플러스는 발달장애 아동을 위한 맞춤형 매칭 플랫폼입니다. 발달장애 아동이 재활 교육과 돌봄 서비스를 효과적으로 받을 수 있도록, 적합한 선생님(돌봄 파트너)과 매칭해 주는 서비스를 제공합니다. 이 플랫폼을 통해 아동과 보호자가 신뢰할 수 있는 교육과 돌봄 환경을 구축하고, 아이들이 건강하게 성장할 수 있도록 지원합니다.',
      challenge: '✔ 발달장애 아동의 개별적인 특성과 요구 사항이 다르기 때문에, 정확한 매칭 알고리즘을 개발하는 것이 핵심 과제였습니다. ✔ 보호자들이 쉽게 사용할 수 있도록 직관적인 UI/UX 설계가 필요했습니다. ✔ 재활 교육 및 돌봄 서비스의 질을 높이기 위해 전문적인 교육자와의 연결이 필수적이었습니다.',
      solution: 'AI 알고리즘을 개발하여 발달장애아동과 함께 성장할 수 있는 재활교육과 돌봄파트너 선생님을 찾아주는 시스템을 구축했습니다. 사용자 친화적인 인터페이스를 통해 복잡한 데이터를 쉽게 이해할 수 있도록 시각화했습니다.',
      features: [
        {
          icon: faGlobe,
          title: '실시간 데이터 기반 추천',
          description: '아동의 연령, 장애 유형, 관심 분야 등의 데이터를 분석하여 맞춤형 돌봄 선생님 추천, 보호자가 원하는 시간대 및 지역을 기반으로 즉각적인 매칭 가능'
        },
        {
          icon: faCode,
          title: 'AI 분석 (예정)',
          description: '향후 LLM을 활용하여 아동과 돌봄 선생님의 매칭 정확도를 향상, AI 기반 학습 시스템을 통해 아동의 교육·돌봄 패턴 분석 제공'
        },
        {
          icon: faRocket,
          title: '서비스 이용 및 평가 시스템',
          description: '보호자는 매칭된 돌봄 선생님과의 경험을 평가 및 피드백할 수 있으며, 이를 바탕으로 추천 시스템 개선'
        }
      ],
      images: [
        '/images/projects/withslow/screen2.png',
        '/images/projects/withslow/screen3.png'
      ],
      bgColor: '#00C7E6',
      imageBgColor: '#E6FCFF',
      link: 'https://withslow.com'
    },
    cupas: {
      title: '쿠파스 자동화',
      description: 'N잡러를 위한 가성비 제품을 큐레이션하는 쿠팡파트너스 자동화 솔루션',
      category: 'Marketing',
      client: '그로우썸',
      year: '2025',
      mainImage: '/images/projects/cupas/screen1.png',
      overview: 'CUPAS는 쿠팡파트너스 마케터를 위한 자동 영상 제작 솔루션입니다.쿠팡파트너스를 활용하는 마케터들이 별도의 영상 편집 기술 없이 쉽고 빠르게 홍보 영상을 제작할 수 있도록 돕는 서비스입니다.쿠팡 상품 정보를 기반으로 템플릿 기반의 영상 제작 기능을 제공하여, 누구나 손쉽게 상품 홍보 영상을 만들고 활용할 수 있습니다.',
      challenge: '✔ 쿠팡파트너스 마케팅을 위한 영상 제작의 어려움 – 영상 편집 경험이 없는 마케터도 쉽게 사용할 수 있는 간편한 솔루션이 필요했습니다. ✔ 반복적인 작업의 자동화 필요 – 같은 형식의 영상을 손쉽게 대량 제작할 수 있도록 템플릿 기능을 강화해야 했습니다. ✔ 빠른 콘텐츠 생산 요구 – 빠르게 변하는 트렌드에 맞춰 즉각적인 영상 제작 및 업로드가 가능한 시스템이 필요했습니다.',
      solution: '템플릿 기반 자동 영상 생성, 쿠팡 상품 URL 입력만으로 자동으로 영상 생성, 기본 제공 템플릿 활용하여 손쉽게 영상 제작 가능, 텍스트 및 이미지 삽입 기능으로 개별 커스터마이징 지원',
      features: [
        {
          icon: faGlobe,
          title: '템플릿 기반 자동 영상 생성',
          description: '쿠팡 상품 URL 입력만으로 자동으로 영상 생성, 기본 제공 템플릿 활용하여 손쉽게 영상 제작 가능, 텍스트 및 이미지 삽입 기능으로 개별 커스터마이징 지원'
        },
      ],
      images: [
        '/images/projects/cupas/screen1.png',
        '/images/projects/cupas/screen2.png'
      ],
      bgColor: '#17163A',
      imageBgColor: '#E6FCFF',
      link: 'https://growsome.kr/coupas'
    },
    pickup: {
      title: '픽업해',
      description: '소상공인을 위한 0% 수수료 픽업 예약 자동화 솔루션',
      category: 'Service SaaS',
      client: '그로우썸',
      year: '2025',
      mainImage: '/images/projects/pickuphae/screen1.png',
      overview: '픽업해는 배달앱 수수료 부담을 느끼는 소상공인을 위한 예약 및 픽업 자동화 솔루션입니다. 고객은 웹페이지에서 메뉴 확인 및 시간 예약을 간편하게 진행하고, 사장님은 사장님전용앱으로 실시간 예약 알림을 받아 빠르게 대응할 수 있습니다.',
      challenge: '✔ 배달앱의 높은 수수료 부담 – 고정비용 없이 운영 가능한 대안 플랫폼이 필요했습니다. ✔ 예약 및 수령 시간 조율의 번거로움 – 전화 없이 고객과 효율적인 예약 소통이 가능한 시스템이 요구되었습니다. ✔ 고객 편의와 사장님 사용성을 모두 만족시키는 UX 설계 필요',
      solution: '고객은 링크를 통해 웹에서 간편하게 예약하고 카카오톡으로 알림받고, 사장님은 사장님 전용앱 알림으로 빠르게 확인 및 응대, 메뉴 등록과 시간 관리가 쉬운 관리자 페이지 제공',
      features: [
        {
          icon: faGlobe,
          title: '웹 기반 예약-픽업 자동화',
          description: '소상공인이 직접 메뉴 등록 후 예약 링크 생성, 고객은 앱 설치 없이 웹으로 예약, 사장님은 사장님 전용앱으로 실시간 응대'
        }
      ],
      images: [
        '/images/projects/pickup/screen1.png',
        '/images/projects/pickup/screen2.png',
        '/images/projects/pickup/screen3.png'
      ],
      bgColor: '#F7621F',
      imageBgColor: '#FFF6F2',
      link: 'https://start.growsome.kr/pickup'
    },
    doasome: {
      title: '두어썸',
      description: '성과 퍼널을 복사하면 전환이 시작되는 마케팅 자동화 솔루션',
      category: 'Marketing SaaS',
      client: '그로우썸',
      year: '2025',
      mainImage: '/images/projects/doasome/screen1.png',
      overview: '두어썸은 전환 중심의 실행 퍼널을 SkillBlock 형태로 제공하여, 마케터나 1인 기업이 별도의 기획이나 개발 없이 실전 성과를 바로 실행할 수 있게 돕는 마케팅 자동화 SaaS입니다. 누구나 쉽게 복사하고 실행할 수 있으며, 평균 10분 안에 전환 퍼널을 완성할 수 있습니다.',
      challenge: '✔ 전환 퍼널 기획의 어려움 – 마케팅 구조 설계에 익숙하지 않은 사용자도 실전 전략을 쉽게 적용할 수 있어야 했습니다. ✔ 마케팅 실행의 번거로움 – 설계, 디자인, 개발 없이 곧바로 실행할 수 있는 형태가 필요했습니다. ✔ 빠른 실험과 성과 측정 – 복붙만으로도 A/B 테스트 및 성과 측정이 가능한 구조가 요구되었습니다.',
      solution: '성과 검증된 SkillBlock 템플릿 제공, 복사-붙여넣기만으로 실전 마케팅 퍼널 완성, 전환 전까지 과금되지 않는 성과 기반 모델',
      features: [
        {
          icon: faGlobe,
          title: '복사만 하면 실행되는 SkillBlock',
          description: '검증된 전환 퍼널을 블록 단위로 제공, 사용자는 기획/디자인/개발 없이 그대로 복사하여 즉시 마케팅 실행 가능'
        }
      ],
      images: [
        '/images/projects/doasome/screen1.png',
        '/images/projects/doasome/screen2.png',
        '/images/projects/doasome/screen3.png'
      ],
      bgColor: '#5C59E8',
      imageBgColor: '#FFFDF5',
      link: 'https://start.growsome.kr/doasome'
    },
    
};

const ChallengeText = ({ text }: { text: string }) => (
  <div>
    {text.split('<br />').map((line: string, index: number) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </div>
);

export default async function PortfolioDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
  
  const project = projectData[id as keyof typeof projectData];

  if (!project) {
    return <div>Project not found</div>;
  }

  return <ClientProjectDetail project={project} />;
}
