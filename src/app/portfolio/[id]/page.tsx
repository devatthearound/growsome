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
      year: '2023',
      mainImage: '/images/projects/skykey/main.jpg',
      overview: '스카이키는 부동산 투자자들을 위한 데이터 기반 의사결정 플랫폼입니다. AI 기술을 활용하여 급매 물건을 분석하고, 투자 가치를 평가하여 제공합니다.',
      challenge: '부동산 시장의 방대한 데이터를 실시간으로 수집하고 분석하여, 사용자에게 의미 있는 인사이트를 제공하는 것이 주요 과제였습니다.',
      solution: 'AI 알고리즘을 개발하여 급매 물건을 자동으로 감지하고, 투자 가치를 평가하는 시스템을 구축했습니다. 사용자 친화적인 인터페이스를 통해 복잡한 데이터를 쉽게 이해할 수 있도록 시각화했습니다.',
      features: [
        {
          icon: faGlobe,
          title: '실시간 데이터',
          description: '전국의 부동산 매물 정보를 실시간으로 수집하고 분석합니다.'
        },
        {
          icon: faCode,
          title: 'AI 분석',
          description: '머신러닝 알고리즘으로 급매 물건을 자동 감지합니다.'
        },
        {
          icon: faRocket,
          title: '투자 분석',
          description: '지역 및 물건별 투자 가치를 평가하여 제공합니다.'
        }
      ],
      images: [
        '/images/projects/skykey/screen1.jpg',
        '/images/projects/skykey/screen2.jpg',
        '/images/projects/skykey/screen3.jpg'
      ]
    }
    // 다른 프로젝트 데이터도 추가
};


// export default async function PortfolioDetailPage({ params, searchParams }: Props) {
//   const resolvedParams = await params;
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
