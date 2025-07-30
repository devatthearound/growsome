'use client';

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faPlay, faArrowLeft, faVideo, faLink, faArrowUp, faCog, faBolt, faUsers, faClock, faCheck, faDownload, faDesktop, faLaptop, faStar, faRocket, faChartLine, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Styled Components for Class Section
const colors = {
  primary: '#080d34',
  secondary: '#FFFFFF',
  accent: '#5C59E8',
  text: {
    primary: '#080d34',
    secondary: '#666666',
    light: '#FFFFFF'
  },
  gradient: {
    accent: 'linear-gradient(135deg, #5C59E8 0%, #4A47D5 100%)'
  }
};

const ClassSection = styled.section`
  padding: 80px 0;
  background: #FAFAFA;
`;

const ClassContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ClassTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ClassDescription = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 50px;
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const CourseHeader = styled.div`
  margin-bottom: 20px;
`;

const ClassCourseTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${colors.primary};
`;

const ClassCourseDescription = styled.p`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 15px;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ClassPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.accent};
`;

const ClassOriginalPrice = styled.div`
  font-size: 1rem;
  color: ${colors.text.secondary};
  text-decoration: line-through;
  margin-bottom: 5px;
`;

const ClassCourseButton = styled.button`
  background: ${colors.gradient.accent};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(92, 89, 232, 0.3);
  }
`;

const ClassFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const ClassFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
`;

const ClassCheckIcon = styled.span`
  color: #4CAF50;
  font-size: 0.8rem;
`;

const features = [
  {
    icon: <FontAwesomeIcon icon={faLink} className="w-10 h-10 text-[#6366F1]" />,
    title: "쿠팡 파트너스 API 연동",
    description: "쿠팡 파트너스 API를 자동 연동하여 쉽고 빠르게 상품 정보를 가져올 수 있습니다."
  },
  {
    icon: <FontAwesomeIcon icon={faVideo} className="w-10 h-10 text-[#6366F1]" />,
    title: "자동 영상 제작",
    description: "선택한 상품들로 템플릿 기반 영상을 자동으로 제작합니다. 인트로, 아웃트로, 배경 음악까지 설정 가능!"
  },
  {
    icon: <FontAwesomeIcon icon={faBolt} className="w-10 h-10 text-[#6366F1]" />,
    title: "스마트 레이아웃 최적화",
    description: "상품 정보와 이미지를 자동으로 최적의 레이아웃으로 배치하여 보기 좋은 영상을 제작합니다."
  },
  {
    icon: <FontAwesomeIcon icon={faArrowUp} className="w-10 h-10 text-[#6366F1]" />,
    title: "유튜브 자동 업로드",
    description: "생성된 영상을 원클릭으로 유튜브에 자동으로 업로드하고 설정까지 한 번에 완료할 수 있습니다."
  },
  {
    icon: <FontAwesomeIcon icon={faCog} className="w-10 h-10 text-[#6366F1]" />,
    title: "템플릿 관리",
    description: "다양한 템플릿을 저장하고 관리하며, 자신만의 커스텀 템플릿을 만들어 영상 제작 효율을 높일 수 있습니다."
  }
];

const courses = [
  {
    id: 1,
    title: "AI 기초 마스터 과정",
    description: "ChatGPT와 AI 도구 활용의 기초부터 실전까지",
    level: "입문",
    duration: "4주",
    originalPrice: "149,000원",
    price: "99,000원",
    discount: "30%",
    color: "#3B82F6",
    features: [
      "실습 자료 제공",
      "수료증 발급",
      "커뮤니티 접근 권한",
      "1:1 질문 답변"
    ],
    icon: <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-[#6366F1]" />
  },
  {
    id: 2,
    title: "AI 프롬프트 엔지니어링 심화",
    description: "고급 프롬프트 작성법과 AI 모델 최적화 전략",
    level: "중급",
    duration: "6주",
    originalPrice: "199,000원",
    price: "149,000원",
    discount: "25%",
    color: "#F59E0B",
    features: [
      "실전 프로젝트 피드백",
      "고급 실습 자료",
      "전문가 멘토링",
      "프로젝트 리뷰"
    ],
    icon: <FontAwesomeIcon icon={faRocket} className="w-8 h-8 text-[#6366F1]" />
  },
  {
    id: 3,
    title: "AI 비즈니스 전략 과정",
    description: "AI를 활용한 비즈니스 모델 설계와 실행",
    level: "고급",
    duration: "8주",
    originalPrice: "299,000원",
    price: "199,000원",
    discount: "33%",
    color: "#EF4444",
    features: [
      "비즈니스 모델 설계",
      "투자 유치 전략",
      "실전 사례 분석",
      "네트워킹 이벤트"
    ],
    icon: <FontAwesomeIcon icon={faChartLine} className="w-8 h-8 text-[#6366F1]" />
  }
];

const AboutPage = () => {
  const router = useRouter();

  const downloadLinks = {
    windows: "https://github.com/devatthearound/coupas/releases/download/v0.0.1/coupas-win-0.0.1-x64.exe",
    macArm: "https://github.com/devatthearound/coupas/releases/download/v0.0.1/coupas-mac-0.0.1-arm64.dmg",
    macIntel: "https://github.com/devatthearound/coupas/releases/download/v0.0.1/coupas-mac-0.0.1-x64.dmg"
  };

  const handleWindowsDownload = () => {
    window.open(downloadLinks.windows, '_blank');
  };

  const handleMacArmDownload = () => {
    window.open(downloadLinks.macArm, '_blank');
  };

  const handleMacIntelDownload = () => {
    window.open(downloadLinks.macIntel, '_blank');
  };

  const handleStartClick = () => {
    router.push('/services');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-[#EEF2FF] to-white">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1B4B] mb-6">
                  쿠팡 파트너스 <span className="text-[#6366F1]">영상 생성기</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  쿠팡 상품을 검색하고 영상을 자동으로 생성하세요. API 연동, 자동 유튜브 업로드까지 한 번에!
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-6 text-lg transition-all duration-300 hover:shadow-lg"
                      onClick={handleWindowsDownload}
                    >
                      <FontAwesomeIcon icon={faDesktop} className="w-5 h-5 mr-2" />
                      Windows 64비트 다운로드
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 text-base transition-all duration-300 hover:shadow-lg"
                      onClick={handleMacArmDownload}
                    >
                      <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 mr-2" />
                      macOS Apple Silicon (M1/M2)
                    </Button>
                    <Button 
                      className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-4 text-base transition-all duration-300 hover:shadow-lg"
                      onClick={handleMacIntelDownload}
                    >
                      <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 mr-2" />
                      macOS Intel 기반
                    </Button>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="aspect-video bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4 animate-bounce-subtle">🚀</div>
                        <h3 className="text-2xl font-bold mb-2">쿠파스</h3>
                        <p className="text-lg opacity-90">쿠팡 파트너스 영상 생성기</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm font-medium animate-bounce-subtle">
                    신규 버전 출시!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B] mb-4">
                쿠파스의 핵심 기능
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                쿠파스는 쿠팡 파트너스를 위한 최적의 도구로, 상품 검색부터 영상 제작, 유튜브 업로드까지 한 번에 해결합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-[#EEF2FF] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1E1B4B]">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <ClassSection>
          <ClassContainer>
            <ClassTitle>AI 사업 교육 과정</ClassTitle>
            <ClassDescription>
              100만 원 상당 유료 AI 툴까지 무료 제공!<br />
              단 1만 원 강의 결제로 시작하는<br />
              체계적이고 실전 중심의 AI 비즈니스 교육<br /><br />
              기초 → 개발 → 사업화까지<br />
              단계별 커리큘럼으로<br />
              당신의 AI 실행력과 수익화 역량을 완성하세요.
            </ClassDescription>
            
            <CourseGrid>
              {courses.map(course => (
                <CourseCard key={course.id}>
                  <CourseHeader>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: course.color, 
                      borderRadius: '50%', 
                      marginBottom: '10px' 
                    }}></div>
                    <ClassCourseTitle>{course.title}</ClassCourseTitle>
                    <ClassCourseDescription>{course.description}</ClassCourseDescription>
                    <CourseMeta>
                      <MetaItem>
                        <FontAwesomeIcon icon={faUsers} />
                        난이도: {course.level}
                      </MetaItem>
                      <MetaItem>
                        <FontAwesomeIcon icon={faClock} />
                        기간: {course.duration}
                      </MetaItem>
                    </CourseMeta>
                  </CourseHeader>
                  
                  <PriceSection>
                    <div>
                      <ClassOriginalPrice>정가: {course.originalPrice}</ClassOriginalPrice>
                      <ClassPrice>할인가: {course.price}</ClassPrice>
                    </div>
                  </PriceSection>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>📦 포함 혜택</h4>
                    <ClassFeatureList>
                      {course.features.map((feature, index) => (
                        <ClassFeatureItem key={index}>
                          <ClassCheckIcon>
                            <FontAwesomeIcon icon={faCheck} />
                          </ClassCheckIcon>
                          {feature}
                        </ClassFeatureItem>
                      ))}
                    </ClassFeatureList>
                  </div>
                  
                  <ClassCourseButton style={{ backgroundColor: course.color }}>
                    수강 신청하기
                  </ClassCourseButton>
                </CourseCard>
              ))}
            </CourseGrid>
          </ClassContainer>
        </ClassSection>

        {/* CTA Section */}
        <section className="py-20 bg-[#6366F1]">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                쿠파스 지금 다운로드하기
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                쿠팡 파트너스 영상 자동화의 첫 시작, 지금 바로 쿠파스를 다운로드하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-[#6366F1] hover:bg-gray-100 px-8 py-6 text-lg transition-all duration-300 hover:shadow-lg"
                  onClick={handleWindowsDownload}
                >
                  <FontAwesomeIcon icon={faDownload} className="w-5 h-5 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 강의 신청 배너 */}
        <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B] mb-4">
                  이런 프로그램 만들고 싶으신가요?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  쿠팡 파트너스 영상 생성기와 같은 프로그램을 직접 개발하고 싶다면, 
                  AI 활용 기본 강의를 통해 프로그래밍 역량을 키워보세요.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <h3 className="text-2xl font-bold text-[#1E1B4B] mb-4">
                    🎯 강의에서 배울 수 있는 것
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      API 연동 및 데이터 처리 방법
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      자동화 프로그램 개발 기법
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      UI/UX 디자인 및 사용자 경험 개선
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      실제 서비스 런칭 및 운영 방법
                    </li>
                  </ul>
                </div>
                
                <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="bg-[#EEF2FF] rounded-xl p-6 mb-6 border border-[#6366F1]/20">
                    <h4 className="text-xl font-bold text-[#1E1B4B] mb-2">AI 활용 기본 강의</h4>
                    <p className="text-gray-600 mb-4">1억원 지원사업 준비까지 함께하는 체계적인 교육</p>
                    <div className="text-3xl font-bold text-[#6366F1] mb-2">1만원</div>
                    <p className="text-sm text-gray-500">특별 할인가</p>
                  </div>
                  <Button 
                    className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-4 text-lg w-full transition-all duration-300 hover:shadow-lg"
                    onClick={() => router.push('/store')}
                  >
                    강의 신청하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;