import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPlay, faCheck, faTrophy, faUsers, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import VideoModal from '../components/class/VideoModal';

const Class = () => {
  const [hasPurchased, setHasPurchased] = React.useState(false);
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('입문');

  // 실제 구현시에는 백엔드 API를 통해 구매 여부를 확인
  React.useEffect(() => {
    const checkPurchaseStatus = async () => {
      // API 호출 예시
      // const response = await fetch('/api/check-purchase-status');
      // const data = await response.json();
      // setHasPurchased(data.hasPurchased);
      setHasPurchased(false); // 테스트용 기본값
    };

    checkPurchaseStatus();
  }, []);

  const courses = [
    {
      id: 1,
      title: "AI 기초 마스터 과정",
      description: "ChatGPT와 AI 도구 활용의 기초부터 실전까지",
      level: "입문",
      duration: "4주",
      videos: [
        {
          id: "v1",
          title: "1강. AI의 이해와 기초 개념",
          duration: "32:10",
          vimeoId: "123456789",
          isFree: true
        },
        {
          id: "v2",
          title: "2강. ChatGPT 프롬프트 엔지니어링",
          duration: "45:22",
          vimeoId: "987654321",
          isFree: false
        },
        {
          id: "v3",
          title: "3강. AI 이미지 생성 실전 활용",
          duration: "38:15",
          vimeoId: "456789123",
          isFree: false
        }
      ],
      price: "99,000원",
      originalPrice: "149,000원",
      features: [
        "실습 자료 제공",
        "수료증 발급",
        "커뮤니티 접근 권한",
        "1:1 질문 답변"
      ]
    },
    {
      id: 2,
      title: "AI 프롬프트 엔지니어링 심화",
      description: "고급 프롬프트 작성법과 AI 모델 최적화 전략",
      level: "중급",
      duration: "6주",
      videos: [
        {
          id: "v4",
          title: "1강. 고급 프롬프트 설계 원리",
          duration: "41:25",
          vimeoId: "234567890",
          isFree: true
        },
        {
          id: "v5",
          title: "2강. Context 최적화 기법",
          duration: "38:15",
          vimeoId: "345678901",
          isFree: false
        },
        {
          id: "v6",
          title: "3강. Few-shot Learning 활용",
          duration: "45:30",
          vimeoId: "456789012",
          isFree: false
        }
      ],
      price: "149,000원",
      originalPrice: "199,000원",
      features: [
        "실전 프로젝트 피드백",
        "고급 실습 자료",
        "전문가 멘토링",
        "프로젝트 리뷰"
      ]
    },
    {
      id: 3,
      title: "AI 서비스 개발 마스터",
      description: "AI 모델을 활용한 실전 서비스 개발과 배포",
      level: "고급",
      duration: "8주",
      videos: [
        {
          id: "v7",
          title: "1강. AI 서비스 아키텍처 설계",
          duration: "52:30",
          vimeoId: "567890123",
          isFree: true
        },
        {
          id: "v8",
          title: "2강. API 개발과 보안",
          duration: "48:15",
          vimeoId: "678901234",
          isFree: false
        },
        {
          id: "v9",
          title: "3강. 서비스 최적화와 스케일링",
          duration: "55:20",
          vimeoId: "789012345",
          isFree: false
        }
      ],
      price: "199,000원",
      originalPrice: "299,000원",
      features: [
        "실전 프로젝트 개발",
        "코드 리뷰",
        "AWS 크레딧 제공",
        "취업 연계 지원"
      ]
    }
  ];

  const filteredCourses = courses.filter(course => course.level === activeTab);

  const handlePurchase = (course) => {
    const productInfo = {
      type: 'class',
      id: course.id,
      title: course.title,
      price: course.price,
      features: course.features
    };
    
    navigate('/payment', { state: { productInfo } });
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <ClassPage>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <strong>실전 AI 사업가</strong>가 알려주는<br />
            진짜 비즈니스 노하우
          </HeroTitle>
          <HeroDescription>
            AI 기술을 활용해 실제 수익을 만드는 방법을 알려드립니다.<br />
            이론이 아닌, 실전에서 검증된 비즈니스 전략
          </HeroDescription>
          <HeroStats>
            <StatItem>
              <StatNumber>10년+</StatNumber>
              <StatLabel>사업 경력</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>4.9/5</StatNumber>
              <StatLabel>수강 만족도</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>1:1</StatNumber>
              <StatLabel>맞춤 멘토링</StatLabel>
            </StatItem>
          </HeroStats>
          <HeroBadges>
            <Badge>
              <FontAwesomeIcon icon={faTrophy} />
              10억+ 투자 유치
            </Badge>
            <Badge>
              <FontAwesomeIcon icon={faUsers} />
              실전 경험 공유
            </Badge>
            <Badge>
              <FontAwesomeIcon icon={faRocket} />
              3개 서비스 런칭
            </Badge>
          </HeroBadges>
        </HeroContent>
      </HeroSection>

      <EarlyBirdBanner>
        <Container>
          <BannerContent>
            <TimerIcon>⏰</TimerIcon>
            <BannerText>
              <strong>얼리버드 할인 진행중!</strong>
              <p>12월 한정 특별가로 제공됩니다. 수강료는 매월 10%씩 인상될 예정입니다.</p>
            </BannerText>
            <CountDown>D-7</CountDown>
          </BannerContent>
        </Container>
      </EarlyBirdBanner>

      <Container>
        <TabSection>
          <TabList>
            {['입문', '중급', '고급'].map((level) => (
              <TabItem
                key={level}
                active={activeTab === level}
                onClick={() => setActiveTab(level)}
              >
                {level}
              </TabItem>
            ))}
          </TabList>
        </TabSection>

        <CourseList>
          {filteredCourses.map(course => (
            <CourseSection key={course.id}>
              <CourseInfo>
                <CourseHeader>
                  <LevelBadge level={course.level}>{course.level}</LevelBadge>
                  <h2>{course.title}</h2>
                  <Description>{course.description}</Description>
                </CourseHeader>

                <PriceSection>
                  <div>
                    <PriceLabel>수강료</PriceLabel>
                    <Price>{course.price}</Price>
                    <PriceInfo>
                      <OriginalPrice>{course.originalPrice}</OriginalPrice>
                      <DiscountBadge>30% 할인</DiscountBadge>
                    </PriceInfo>
                    <PriceNotice>* 12월 특별 할인가</PriceNotice>
                  </div>
                  {!hasPurchased && (
                    <PurchaseButton onClick={() => handlePurchase(course)}>
                      수강 신청하기
                    </PurchaseButton>
                  )}
                </PriceSection>

                <Divider />

                <FeatureList>
                  {course.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <CheckIcon>
                        <FontAwesomeIcon icon={faCheck} />
                      </CheckIcon>
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </CourseInfo>

              <VideoList>
                {course.videos.map((video, index) => (
                  <VideoItem 
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                  >
                    <VideoNumber>{String(index + 1).padStart(2, '0')}</VideoNumber>
                    <VideoInfo>
                      <VideoTitle>{video.title}</VideoTitle>
                      <VideoMeta>
                        <Duration>{video.duration}</Duration>
                        {video.isFree && <FreeTag>무료</FreeTag>}
                      </VideoMeta>
                    </VideoInfo>
                    {!video.isFree && !hasPurchased ? (
                      <LockIcon>
                        <FontAwesomeIcon icon={faLock} />
                      </LockIcon>
                    ) : (
                      <PlayIcon>
                        <FontAwesomeIcon icon={faPlay} />
                      </PlayIcon>
                    )}
                  </VideoItem>
                ))}
              </VideoList>
            </CourseSection>
          ))}
        </CourseList>

        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            hasPurchased={hasPurchased}
          />
        )}
      </Container>
    </ClassPage>
  );
};

const ClassPage = styled.div`
  background: #FAFAFA;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #514FE4 0%, #6C63FF 100%);
  padding: 100px 0;
  color: white;
  text-align: center;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
  
  strong {
    color: #03FF01;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 50px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin: 40px auto;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
`;

const TabSection = styled.div`
  margin: -40px 0 40px;
  position: sticky;
  top: 80px;
  z-index: 10;
  background: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const TabList = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  margin: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const TabItem = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: #666;
  position: relative;

  ${props => props.active && `
    color: #514FE4;
    font-weight: 600;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: #514FE4;
    }
  `}

  &:hover {
    color: #514FE4;
  }

  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CourseSection = styled.section`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
`;

const CourseInfo = styled.div`
  padding: 40px;
`;

const CourseHeader = styled.div`
  margin-bottom: 32px;

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 16px 0 12px;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const LevelBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => {
    switch (props.level) {
      case '중급':
        return '#FFF4E5';
      case '고급':
        return '#FCE4EC';
      default:
        return '#F3F4F6';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case '중급':
        return '#FF9800';
      case '고급':
        return '#E91E63';
      default:
        return '#514FE4';
    }
  }};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
`;

const PriceLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #514FE4;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const OriginalPrice = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
`;

const DiscountBadge = styled.span`
  background: #FFE8EC;
  color: #FF4081;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PriceNotice = styled.div`
  color: #FF4081;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const PurchaseButton = styled.button`
  padding: 12px 32px;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-1px);
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #eee;
  margin: 32px 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;
  font-size: 0.95rem;
`;

const CheckIcon = styled.span`
  color: #514FE4;
  font-size: 0.9rem;
`;

const VideoList = styled.div`
  background: #F8F9FA;
  padding: 24px;
`;

const VideoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
`;

const VideoNumber = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #514FE4;
  margin-right: 16px;
  min-width: 32px;
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Duration = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const FreeTag = styled.span`
  background: #E8F5E9;
  color: #2E7D32;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PlayIcon = styled.span`
  color: #514FE4;
  font-size: 1rem;
`;

const LockIcon = styled.span`
  color: #999;
  font-size: 1rem;
`;

// Vimeo 관련 컴포넌트 추가
const VimeoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  width: 100%;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const LockedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;

  svg {
    font-size: 2rem;
  }
`;

const HeroBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  svg {
    color: #03FF01;
  }
`;

const EarlyBirdBanner = styled.div`
  max-width: 1000px;
  margin: -20px auto 40px;
  background: #FFF4E5;
  border-radius: 12px;
  padding: 16px;
  color: #FF9800;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TimerIcon = styled.span`
  font-size: 1.5rem;
`;

const BannerText = styled.div`
  flex: 1;
  
  strong {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
`;

const CountDown = styled.div`
  background: #FF9800;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;

export default Class;