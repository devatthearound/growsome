'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { PlayCircle, CheckCircle, Lock, Clock, ArrowLeft, X, Star, Zap, DollarSign, Users, Timer, TrendingUp, Award, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, RowBox, Section, Card } from '@/components/design-system/Layout';
import { GreenButton, SecondaryButton, PrimaryButton } from '@/components/design-system/Button';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  vimeoId?: string;
  vimeoUrl: string;
  thumbnailUrl: string;
  duration: number;
  level: string;
  isPublic: boolean;
  isPremium: boolean;
}

interface CourseProgress {
  isCompleted: boolean;
  watchTime: number;
  lastPosition: number;
}

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<{[key: number]: CourseProgress}>({});
  const [loading, setLoading] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const [currentWatchTime, setCurrentWatchTime] = useState(0);
  const [showTimerAlert, setShowTimerAlert] = useState(false);
  const [ctaTriggered, setCtaTriggered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lockedCourse, setLockedCourse] = useState<Course | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // FOMO 데이터
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [recentSignups, setRecentSignups] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24시간 초

  useEffect(() => {
    fetchCourses();
    
    // 온라인 사용자 수 랜덤 업데이트
    const userCountInterval = setInterval(() => {
      setOnlineUsers(prev => Math.max(5, Math.min(25, prev + Math.floor(Math.random() * 4) - 2)));
    }, 15000);

    // 최근 가입자 수 랜덤 업데이트
    const signupInterval = setInterval(() => {
      setRecentSignups(prev => Math.max(1, Math.min(8, prev + Math.floor(Math.random() * 2) - 1)));
    }, 30000);

    // 타이머 카운트다운
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(userCountInterval);
      clearInterval(signupInterval);
      clearInterval(timerInterval);
    };
  }, []);

  // 1분 타이머 설정
  useEffect(() => {
    if (watchStartTime && !ctaTriggered) {
      timerRef.current = setTimeout(() => {
        console.log('1분 경과 - CTA 표시');
        setShowTimerAlert(true);
        setTimeout(() => {
          setShowCTA(true);
          setCtaTriggered(true);
        }, 2000); // 2초 후 CTA 표시
      }, 60000); // 1분 = 60,000ms

      // 실시간 시청 시간 업데이트
      const watchInterval = setInterval(() => {
        setCurrentWatchTime(prev => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        clearInterval(watchInterval);
      };
    }
  }, [watchStartTime, ctaTriggered]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success && data.courses.length > 0) {
        setCourses(data.courses);
        setSelectedCourse(data.courses[0]);
      } else {
        const testCourses: Course[] = [
          {
            id: 1,
            title: '1강 흑수저 - AI 사업계획서 기초',
            slug: '1-black-spoon',
            description: 'AI 사업계획서 작성의 첫 번째 강의입니다. 기본 개념과 시작 방법을 배웁니다.',
            vimeoId: '1027151927',
            vimeoUrl: 'https://player.vimeo.com/video/1027151927?badge=0&autopause=0&player_id=0&app_id=58479',
            thumbnailUrl: '',
            duration: 1800,
            level: '초급',
            isPublic: true,
            isPremium: true
          },
          {
            id: 2,
            title: '2강 시장 분석 및 경쟁사 리서치',
            slug: '2-market-analysis',
            description: 'AI를 활용한 체계적인 시장 분석 방법론을 학습합니다.',
            vimeoId: '1027151928',
            vimeoUrl: 'https://player.vimeo.com/video/1027151928',
            thumbnailUrl: '',
            duration: 2100,
            level: '중급',
            isPublic: false,
            isPremium: true
          }
        ];
        setCourses(testCourses);
        setSelectedCourse(testCourses[0]);
      }
    } catch (error) {
      console.error('강의 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    // 새 강의 선택 시 타이머 리셋
    setWatchStartTime(Date.now());
    setCurrentWatchTime(0);
    setCtaTriggered(false);
    setShowTimerAlert(false);
    setVideoError(false);
  };

  const handleLockedCourseClick = (course: Course) => {
    setLockedCourse(course);
    setShowPaymentModal(true);
  };

  const handleVideoStart = () => {
    if (!watchStartTime) {
      setWatchStartTime(Date.now());
      console.log('비디오 시청 시작 - 1분 타이머 시작');
    }
  };

  const calculateSavings = () => {
    return {
      consultingFee: 5000000, // 500만원 컨설팅
      agencyFee: 15000000,    // 1500만원 대행업체
      timeValue: 2000000,     // 200만원 시간 가치
      total: 22000000         // 총 2200만원
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const savings = calculateSavings();

  if (loading) {
    return (
      <CoursesContainer>
        <LoadingMessage>강의를 불러오는 중...</LoadingMessage>
      </CoursesContainer>
    );
  }

  return (
    <ThemeProvider theme={growsomeTheme}>
      <CoursesContainer>
      {/* 1분 알림 팝업 */}
      {showTimerAlert && (
        <TimerAlert>
          <TimerAlertContent>
            <Timer size={24} color="#f59e0b" />
            <span>1분간 시청해주셨네요! 잠시 후 특별한 제안을 드릴게요 🎉</span>
          </TimerAlertContent>
        </TimerAlert>
      )}

      <Header>
        <TitleSection>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <LogoSection>
            <Image
              src="/logo_growsome.png"
              alt="그로우썸"
              width={120}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
            <Title>AI 사업계획서 작성 완성 솔루션</Title>
          </LogoSection>
          <LiveIndicator>
            <LiveDot />
            <span>{onlineUsers}명 온라인</span>
          </LiveIndicator>
        </TitleSection>
        
        <ProgressBar>
          <ProgressFill $progress={25} />
        </ProgressBar>
        
        <StatsRow>
          <StatItem>
            <Users size={16} />
            <span>총 {formatCurrency(47)}명 수강</span>
          </StatItem>
          <StatItem>
            <TrendingUp size={16} />
            <span>지난 24시간 {recentSignups}명 신규 가입</span>
          </StatItem>
          <StatItem>
            <Award size={16} />
            <span>만족도 4.9/5.0</span>
          </StatItem>
        </StatsRow>
      </Header>

      <MainContent>
        <Sidebar>
          <SidebarTitle>강의 목록 ({courses.length}강)</SidebarTitle>
          <CourseList>
            {courses.map((course, index) => {
              const progress = userProgress[course.id];
              const isCompleted = progress?.isCompleted || false;
              const canAccess = index === 0; // 첫 번째 강의만 접근 가능

              return (
                <CourseItem
                  key={course.id}
                  isSelected={selectedCourse?.id === course.id}
                  canAccess={canAccess}
                  onClick={() => canAccess ? handleCourseSelect(course) : handleLockedCourseClick(course)}
                >
                  <CourseNumber>{index + 1}</CourseNumber>
                  <CourseContent>
                    <CourseTitle canAccess={canAccess}>
                      {course.title}
                      {!canAccess && <Lock size={14} />}
                    </CourseTitle>
                    <CourseMeta>
                      <span>레벨: {course.level}</span>
                      <span>{Math.floor(course.duration / 60)}분</span>
                    </CourseMeta>
                  </CourseContent>
                  <CourseStatus>
                    {!canAccess ? (
                      <Lock size={16} color="#94a3b8" />
                    ) : isCompleted ? (
                      <CheckCircle size={16} color="#10B981" />
                    ) : (
                      <PlayCircle size={16} color="#514fe4" />
                    )}
                  </CourseStatus>
                </CourseItem>
              );
            })}
          </CourseList>
        </Sidebar>

        <VideoSection>
          {selectedCourse ? (
            <>
              <VideoContainer>
                {!videoError ? (
                  <VimeoPlayer
                    src={`https://player.vimeo.com/video/${selectedCourse.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
                    title={selectedCourse.title}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoStart}
                    onError={() => setVideoError(true)}
                  />
                ) : (
                  <VideoErrorPlaceholder>
                    <PlayCircle size={48} />
                    <p>비디오를 불러올 수 없습니다</p>
                    <button onClick={() => setVideoError(false)}>다시 시도</button>
                  </VideoErrorPlaceholder>
                )}
                
                {/* 시청 시간 표시 */}
                {watchStartTime && !videoError && (
                  <WatchTimeIndicator>
                    <Clock size={14} />
                    시청 시간: {formatTime(currentWatchTime)}
                  </WatchTimeIndicator>
                )}
              </VideoContainer>
              
              <VideoInfo>
                <VideoTitle>{selectedCourse.title}</VideoTitle>
                <VideoDescription>{selectedCourse.description}</VideoDescription>
                
                {/* 첫 번째 강의가 선택된 경우 다른 강의들을 시청하려면 결제가 필요하다는 안내 */}
                {selectedCourse && selectedCourse.id === courses[0]?.id && (
                  <LockedCourseCTA>
                    <LockedCourseMessage>
                      <Lock size={20} color="#94a3b8" />
                      <span>나머지 {courses.length - 1}개 강의를 시청하려면 결제가 필요합니다</span>
                    </LockedCourseMessage>
                    <PrimaryButton $size="medium" onClick={() => handleLockedCourseClick(courses[1])}>
                      <Zap size={16} />
                      지금 결제하고 모든 강의 시청하기
                    </PrimaryButton>
                  </LockedCourseCTA>
                )}
                
                {/* 잠긴 강의인 경우 결제 버튼 표시 */}
                {selectedCourse && selectedCourse.id !== courses[0]?.id && (
                  <LockedCourseCTA>
                    <LockedCourseMessage>
                      <Lock size={20} color="#94a3b8" />
                      <span>이 강의는 프리미엄 회원만 시청할 수 있습니다</span>
                    </LockedCourseMessage>
                    <PrimaryButton $size="medium" onClick={() => handleLockedCourseClick(selectedCourse)}>
                      <Zap size={16} />
                      지금 결제하고 모든 강의 시청하기
                    </PrimaryButton>
                  </LockedCourseCTA>
                )}
              </VideoInfo>
            </>
          ) : (
            <EmptyState>
              <PlayCircle size={64} />
              <p>강의를 선택해주세요</p>
            </EmptyState>
          )}
        </VideoSection>
      </MainContent>
      
      {/* 향상된 CTA 모달 */}
      {showCTA && (
        <CTAOverlay onClick={(e) => e.target === e.currentTarget && setShowCTA(false)}>
          <CTAModal>
            <CTAHeader>
              <UrgencyBadge>
                <Timer size={16} />
                한정 특가 {formatTime(timeRemaining)} 남음
              </UrgencyBadge>
              <CTACloseButton onClick={() => setShowCTA(false)}>
                <X size={20} />
              </CTACloseButton>
            </CTAHeader>
            
            <CTAContent>
              <CTAIcon>
                <Zap size={48} color="#f59e0b" />
              </CTAIcon>
              
              <CTATitle>
                <Typography.DisplayL600>
                  🎉 축하합니다!<br />
                  이제 전문가 수준 노하우를 배워보세요
                </Typography.DisplayL600>
              </CTATitle>
              
              <SavingsSection>
                <SavingsTitle>
                  <DollarSign size={20} color="#10b981" />
                  스스로 배워서 절약하는 비용
                </SavingsTitle>
                
                <SavingsGrid>
                  <SavingsItem>
                    <SavingsLabel>전문 컨설팅 비용</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.consultingFee)}원</SavingsAmount>
                  </SavingsItem>
                  <SavingsItem>
                    <SavingsLabel>대행업체 수수료</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.agencyFee)}원</SavingsAmount>
                  </SavingsItem>
                  <SavingsItem>
                    <SavingsLabel>시간 기회비용</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.timeValue)}원</SavingsAmount>
                  </SavingsItem>
                </SavingsGrid>
                
                <TotalSavings>
                  <span>총 절약 비용</span>
                  <TotalAmount>{formatCurrency(savings.total)}원</TotalAmount>
                </TotalSavings>
                <SavingsNote>
                  * 스스로 학습할 경우 예상되는 비용입니다
                </SavingsNote>
              </SavingsSection>

              <ValueProposition>
                <ValueTitle>단 39,000원으로 모든 노하우를 습득하세요</ValueTitle>
                <ValueSubtitle>
                  98.2% 할인가로 <strong>2200만원 상당의 가치</strong>를 제공합니다
                </ValueSubtitle>
                <ValueNote>
                  * 2200만원은 스스로 학습할 경우 예상되는 총 비용입니다
                </ValueNote>
              </ValueProposition>
              
              <CTAFeatures>
                <CTAFeature>
                  <Star size={16} color="#10b981" />
                  <span>전체 20강의 평생 무제한 시청</span>
                </CTAFeature>
                <CTAFeature>
                  <Briefcase size={16} color="#10b981" />
                  <span>실전 템플릿 & 체크리스트 제공</span>
                </CTAFeature>
                <CTAFeature>
                  <Users size={16} color="#10b981" />
                  <span>전용 커뮤니티 및 Q&A 지원</span>
                </CTAFeature>
                <CTAFeature>
                  <Award size={16} color="#10b981" />
                  <span>수료증 발급 (선택사항)</span>
                </CTAFeature>
              </CTAFeatures>

              <SocialProof>
                <SocialProofItem>
                  <strong>{formatCurrency(onlineUsers)}명</strong>이 지금 학습 중
                </SocialProofItem>
                <SocialProofItem>
                  <strong>평균 수강 완료율 78%</strong> 달성
                </SocialProofItem>
              </SocialProof>
              
              <CTAButtons>
                <PrimaryButton $size="large" onClick={() => window.open('/payment', '_blank')}>
                  <span>지금 시작하기</span>
                  <CTAPrice>
                    <span className="original">월 99,000원</span>
                    <span className="discounted">월 39,000원</span>
                  </CTAPrice>
                </PrimaryButton>
                
                <SecondaryButton $size="large" onClick={() => window.open('/consultation', '_blank')}>
                  1:1 무료 상담 신청 (15분)
                </SecondaryButton>
              </CTAButtons>
              
              <CTAFooter>
                <CTADisclaimer>
                  ⚡ <strong>지금 가입하는 {recentSignups}번째</strong> 고객에게 
                  <strong style={{color: '#dc2626'}}> 추가 10% 할인</strong> 적용! (자정까지)
                </CTADisclaimer>
                
                <Testimonial>
                  "이 강의로 3개월 만에 5억 투자 유치에 성공했습니다!" - 김○○ 대표
                </Testimonial>
              </CTAFooter>
            </CTAContent>
          </CTAModal>
        </CTAOverlay>
      )}

      {/* 잠긴 강의 결제 모달 */}
      {showPaymentModal && lockedCourse && (
        <PaymentModalOverlay onClick={(e) => e.target === e.currentTarget && setShowPaymentModal(false)}>
          <PaymentModal>
            <PaymentModalHeader>
              <Lock size={24} color="#94a3b8" />
                              <Typography.DisplayM600>프리미엄 강의 잠금 해제</Typography.DisplayM600>
              <PaymentModalCloseButton onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </PaymentModalCloseButton>
            </PaymentModalHeader>
            
            <PaymentModalContent>
              <LockedCourseInfo>
                <LockedCourseTitle>{lockedCourse.title}</LockedCourseTitle>
                <LockedCourseDescription>{lockedCourse.description}</LockedCourseDescription>
                <LockedCourseMeta>
                  <span>레벨: {lockedCourse.level}</span>
                  <span>•</span>
                  <span>{Math.floor(lockedCourse.duration / 60)}분</span>
                </LockedCourseMeta>
              </LockedCourseInfo>

              <SavingsSection>
                <SavingsTitle>
                  <DollarSign size={20} color="#10b981" />
                  스스로 배워서 절약하는 비용
                </SavingsTitle>
                
                <SavingsGrid>
                  <SavingsItem>
                    <SavingsLabel>전문 컨설팅 비용</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.consultingFee)}원</SavingsAmount>
                  </SavingsItem>
                  <SavingsItem>
                    <SavingsLabel>대행업체 수수료</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.agencyFee)}원</SavingsAmount>
                  </SavingsItem>
                  <SavingsItem>
                    <SavingsLabel>시간 기회비용</SavingsLabel>
                    <SavingsAmount>{formatCurrency(savings.timeValue)}원</SavingsAmount>
                  </SavingsItem>
                </SavingsGrid>
                
                <TotalSavings>
                  <span>총 절약 비용</span>
                  <TotalAmount>{formatCurrency(savings.total)}원</TotalAmount>
                </TotalSavings>
                <SavingsNote>
                  * 스스로 학습할 경우 예상되는 비용입니다
                </SavingsNote>
              </SavingsSection>

              <ValueProposition>
                <ValueTitle>단 39,000원으로 모든 노하우를 습득하세요</ValueTitle>
                <ValueSubtitle>
                  98.2% 할인가로 <strong>2200만원 상당의 가치</strong>를 제공합니다
                </ValueSubtitle>
                <ValueNote>
                  * 2200만원은 스스로 학습할 경우 예상되는 총 비용입니다
                </ValueNote>
              </ValueProposition>
              
              <PaymentFeatures>
                <PaymentFeature>
                  <Star size={16} color="#10b981" />
                  <span>전체 20강의 평생 무제한 시청</span>
                </PaymentFeature>
                <PaymentFeature>
                  <Briefcase size={16} color="#10b981" />
                  <span>실전 템플릿 & 체크리스트 제공</span>
                </PaymentFeature>
                <PaymentFeature>
                  <Users size={16} color="#10b981" />
                  <span>전용 커뮤니티 및 Q&A 지원</span>
                </PaymentFeature>
                <PaymentFeature>
                  <Award size={16} color="#10b981" />
                  <span>수료증 발급 (선택사항)</span>
                </PaymentFeature>
              </PaymentFeatures>

              <PaymentButtons>
                <PrimaryButton $size="large" onClick={() => window.open('/payment', '_blank')}>
                  <span>지금 결제하기</span>
                  <PaymentPrice>
                    <span className="original">월 99,000원</span>
                    <span className="discounted">월 39,000원</span>
                  </PaymentPrice>
                </PrimaryButton>
                
                <SecondaryButton $size="large" onClick={() => window.open('/consultation', '_blank')}>
                  1:1 무료 상담 신청 (15분)
                </SecondaryButton>
              </PaymentButtons>
              
              <PaymentFooter>
                <PaymentDisclaimer>
                  ⚡ <strong>지금 결제하는 {recentSignups}번째</strong> 고객에게 
                  <strong style={{color: '#dc2626'}}> 추가 10% 할인</strong> 적용! (자정까지)
                </PaymentDisclaimer>
                
                <PaymentTestimonial>
                  "이 강의로 3개월 만에 5억 투자 유치에 성공했습니다!" - 김○○ 대표
                </PaymentTestimonial>
              </PaymentFooter>
            </PaymentModalContent>
          </PaymentModal>
        </PaymentModalOverlay>
      )}
    </CoursesContainer>
    </ThemeProvider>
  );
};

// 스타일 컴포넌트들
const CoursesContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
`;

// 타이머 알림 애니메이션
const slideInFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const TimerAlert = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  animation: ${slideInFromTop} 0.3s ease-out;
`;

const TimerAlertContent = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2);
  font-weight: 600;
  color: #92400e;
  max-width: 400px;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: center;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514fe4;
  margin-right: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  flex: 1;
  margin-left: 1rem;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #10B981, #059669);
  transition: width 0.3s ease;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 160px);
`;

const Sidebar = styled.div`
  width: 350px;
  background: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin: 0;
`;

const CourseList = styled.div`
  padding: 1rem;
`;

const CourseItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'canAccess'].includes(prop),
})<{ isSelected: boolean; canAccess: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: ${props => props.canAccess ? 'pointer' : 'not-allowed'};
  background: ${props => props.isSelected ? '#eff6ff' : 'transparent'};
  opacity: ${props => props.canAccess ? 1 : 0.6};
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    background: ${props => props.canAccess ? (props.isSelected ? '#eff6ff' : '#f8fafc') : 'transparent'};
    border-color: ${props => props.canAccess ? '#e2e8f0' : 'transparent'};
  }
`;

const CourseNumber = styled.div`
  width: 32px;
  height: 32px;
  background: #514fe4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const CourseContent = styled.div`
  flex: 1;
`;

const CourseTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'canAccess',
})<{ canAccess: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.canAccess ? '#1a202c' : '#9ca3af'};
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const CourseStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoSection = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const VideoContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem;
  background: black;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const VimeoPlayer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const WatchTimeIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VideoInfo = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const VideoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const VideoDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;


const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
  
  p {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.125rem;
  color: #64748b;
`;

// CTA 모달 스타일
const CTAOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CTAModal = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CTAHeader = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`;

const UrgencyBadge = styled.div`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: pulse 2s infinite;
`;

const CTACloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #334155;
  }
`;

const CTAContent = styled.div`
  padding: 2rem;
  text-align: center;
`;

const CTAIcon = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const CTATitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  line-height: 1.3;
`;

const SavingsSection = styled.div`
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #22c55e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SavingsTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #15803d;
  margin-bottom: 1rem;
`;

const SavingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SavingsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #d1fae5;
`;

const SavingsLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const SavingsAmount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #15803d;
`;

const TotalSavings = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TotalAmount = styled.span`
  font-size: 1rem;
  font-weight: 700;
`;

const SavingsNote = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin-top: 0.5rem;
  font-style: italic;
`;

const ValueProposition = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary25}, ${growsomeTheme.color.Primary50});
  border-radius: 12px;
  border: 2px solid ${growsomeTheme.color.Primary500};
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${growsomeTheme.color.Primary600};
  margin-bottom: 0.75rem;
  text-align: center;
`;

const ValueSubtitle = styled.p`
  font-size: 1rem;
  color: #374151;
  margin: 0;
  
  strong {
    color: #dc2626;
    font-weight: 700;
  }
`;

const ValueNote = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
`;

const CTAFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const CTAFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${growsomeTheme.color.Gray50};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${growsomeTheme.color.Black800};
  font-weight: 500;
`;

const SocialProof = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${growsomeTheme.color.Gray50};
  border-radius: 8px;
`;

const SocialProofItem = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #374151;
  
  strong {
    display: block;
    font-size: 1rem;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CTAPrimaryButton = styled.button`
  background: linear-gradient(135deg, #514fe4, #4338ca);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(81, 79, 228, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CTAPrice = styled.div`
  margin-top: 0.5rem;
  
  .original {
    text-decoration: line-through;
    opacity: 0.7;
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
  
  .discounted {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;

const CTASecondaryButton = styled.button`
  background: transparent;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`;

const CTAFooter = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid ${growsomeTheme.color.Gray200};
`;

const CTADisclaimer = styled.p`
  font-size: 0.875rem;
  color: ${growsomeTheme.color.Gray500};
  line-height: 1.5;
  margin-bottom: 1rem;
  
  strong {
    color: ${growsomeTheme.color.Red500};
    font-weight: 700;
  }
`;

const Testimonial = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid ${growsomeTheme.color.Primary500};
  font-style: italic;
  color: ${growsomeTheme.color.Black800};
  font-size: 0.875rem;
`;

const VideoErrorPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 8px;
  
  p {
    margin: 1rem 0;
    font-size: 1rem;
    font-weight: 500;
  }
  
  button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #2563eb;
    }
  }
`;

// 잠긴 강의 관련 스타일 컴포넌트들
const LockedCourseCTA = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
`;

const LockedCourseMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const PaymentButton = styled.button`
  background: linear-gradient(135deg, #514fe4, #4338ca);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(81, 79, 228, 0.3);
  }
`;

// 결제 모달 관련 스타일 컴포넌트들
const PaymentModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const PaymentModal = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const PaymentModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${growsomeTheme.color.Gray200};
  background: ${growsomeTheme.color.Gray50};
  border-radius: 20px 20px 0 0;
`;

const PaymentModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const PaymentModalCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${growsomeTheme.color.Gray500};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: ${growsomeTheme.color.Gray200};
    color: ${growsomeTheme.color.Black800};
  }
`;

const PaymentModalContent = styled.div`
  padding: 2rem;
  background: ${growsomeTheme.color.White};
`;

const LockedCourseInfo = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${growsomeTheme.color.Gray50};
  border-radius: 12px;
  border-left: 4px solid ${growsomeTheme.color.Primary500};
`;

const LockedCourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const LockedCourseDescription = styled.p`
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const LockedCourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #9ca3af;
`;

const PaymentFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const PaymentFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${growsomeTheme.color.Gray50};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${growsomeTheme.color.Black800};
  font-weight: 500;
`;

const PaymentButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentPrimaryButton = styled.button`
  background: linear-gradient(135deg, #514fe4, #4338ca);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(81, 79, 228, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PaymentPrice = styled.div`
  margin-top: 0.5rem;
  
  .original {
    text-decoration: line-through;
    opacity: 0.7;
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
  
  .discounted {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;

const PaymentSecondaryButton = styled.button`
  background: transparent;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`;

const PaymentFooter = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid ${growsomeTheme.color.Gray200};
`;

const PaymentDisclaimer = styled.p`
  font-size: 0.875rem;
  color: ${growsomeTheme.color.Gray500};
  line-height: 1.5;
  margin-bottom: 1rem;
  
  strong {
    color: ${growsomeTheme.color.Red500};
    font-weight: 700;
  }
`;

const PaymentTestimonial = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid ${growsomeTheme.color.Primary500};
  font-style: italic;
  color: ${growsomeTheme.color.Black800};
  font-size: 0.875rem;
`;

export default CoursesPage;