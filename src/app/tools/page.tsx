'use client';

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRocket, faChartLine, faUsers, faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const tools = [
  {
    id: 'affiliate',
    title: "제휴자동화",
    subtitle: "Affiliate Automation",
    description: "쿠팡 파트너스 API를 활용한 자동화된 제휴 마케팅 솔루션",
    features: [
      "쿠팡 파트너스 API 자동 연동",
      "상품 검색 및 영상 자동 생성",
      "유튜브 자동 업로드",
      "템플릿 기반 영상 제작",
      "실시간 성과 분석"
    ],
    color: "from-[#514FE4] to-[#6C63FF]",
    bgColor: "bg-gradient-to-br from-[#514FE4]/10 to-[#6C63FF]/10",
    icon: <FontAwesomeIcon icon={faRocket} className="w-8 h-8" />,
    link: "/affil"
  },
  {
    id: 'funnel',
    title: "퍼널자동화", 
    subtitle: "Funnel Automation",
    description: "AI 기반 퍼널 자동화로 리드 생성부터 전환까지 완벽 자동화",
    features: [
      "AI 기반 퍼널 설계",
      "자동 리드 생성",
      "스마트 전환 최적화",
      "실시간 퍼널 분석",
      "A/B 테스트 자동화"
    ],
    color: "from-[#667eea] to-[#764ba2]",
    bgColor: "bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10",
    icon: <FontAwesomeIcon icon={faChartLine} className="w-8 h-8" />,
    link: "/funnel"
  }
];

const stats = [
  {
    number: "10,000+",
    label: "자동화된 콘텐츠",
    icon: <FontAwesomeIcon icon={faRocket} className="w-6 h-6" />
  },
  {
    number: "80%",
    label: "비용 절약",
    icon: <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
  },
  {
    number: "95%",
    label: "효율성 향상",
    icon: <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
  }
];

const ToolsPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Growsome <span className="text-[#514FE4]">Tools</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                AI 기반 자동화 도구로 비즈니스 성장을 가속화하세요.
                제휴마케팅부터 퍼널 자동화까지, 모든 것을 한 곳에서.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-[#514FE4] hover:bg-[#403bb3] text-white px-8 py-6 text-lg"
                  onClick={() => router.push('/contact')}
                >
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5 mr-2" />
                  무료 체험 시작하기
                </Button>
                <Button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-6 text-lg"
                  onClick={() => router.push('/contact')}
                >
                  <FontAwesomeIcon icon={faStar} className="w-5 h-5 mr-2" />
                  문의하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#514FE4]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                전문 도구 모음
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                각 도구는 특정 비즈니스 요구사항에 최적화되어 있습니다.
                필요에 따라 개별 도구를 선택하거나 전체 솔루션을 활용하세요.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tools.map((tool, index) => (
                <div 
                  key={tool.id}
                  className={`rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 ${tool.bgColor}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center text-white`}>
                      {tool.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-500">{tool.subtitle}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{tool.title}</h3>
                  <p className="text-gray-600 mb-6">{tool.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">주요 기능:</h4>
                    <ul className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={tool.link}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 text-white py-4 text-lg font-semibold`}
                    >
                      자세히 보기
                      <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                어떤 도구가 필요하신가요?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                비즈니스 목표에 따라 적합한 도구를 선택하세요
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">제휴자동화</h3>
                <p className="text-gray-600 mb-6">
                  제휴 마케팅을 통해 수익을 창출하고 싶다면
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    쿠팡 파트너스 활동
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    제품 리뷰 영상 제작
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    유튜브 채널 운영
                  </li>
                </ul>
                <Link href="/affil">
                  <Button className="w-full bg-[#514FE4] hover:bg-[#403bb3] text-white">
                    제휴자동화 시작하기
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">퍼널자동화</h3>
                <p className="text-gray-600 mb-6">
                  리드 생성부터 전환까지 완벽한 자동화가 필요하다면
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    리드 생성 및 관리
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    퍼널 최적화
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500 mr-3" />
                    전환율 향상
                  </li>
                </ul>
                <Link href="/funnel">
                  <Button className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 text-white">
                    퍼널자동화 시작하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#514FE4]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              AI 기반 자동화 도구로 비즈니스 성장을 가속화하세요.
              무료 체험으로 효과를 직접 확인해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-[#514FE4] hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => router.push('/contact')}
              >
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5 mr-2" />
                무료 체험 시작하기
              </Button>
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#514FE4] px-8 py-6 text-lg"
                onClick={() => router.push('/contact')}
              >
                <FontAwesomeIcon icon={faStar} className="w-5 h-5 mr-2" />
                문의하기
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ToolsPage;