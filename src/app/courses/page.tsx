'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PlayCircle, CheckCircle, Lock, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success && data.courses.length > 0) {
        setCourses(data.courses);
        setSelectedCourse(data.courses[0]);
      } else {
        // 데이터베이스에 강의가 없으면 테스트 데이터 사용
        console.log('API에서 강의 데이터를 받지 못했습니다. 테스트 데이터를 사용합니다.');
        const testCourses: Course[] = [
          {
            id: 1,
            title: '1강 흑수저',
            slug: '1-black-spoon',
            description: 'AI 사업계획서 작성의 첫 번째 강의입니다. 기본 개념과 시작 방법을 배웁니다.',
            vimeoId: '1027151927',
            vimeoUrl: 'https://player.vimeo.com/video/1027151927?badge=0&autopause=0&player_id=0&app_id=58479',
            thumbnailUrl: '',
            duration: 1800, // 30분
            level: '초급',
            isPublic: true,
            isPremium: true
          }
        ];
        setCourses(testCourses);
        setSelectedCourse(testCourses[0]);
      }
      // TODO: 사용자 진도 정보도 함께 가져오기
    } catch (error) {
      console.error('강의 데이터 로드 오류:', error);
      // 에러 시에도 테스트 데이터 사용
      const testCourses: Course[] = [
        {
          id: 1,
          title: '1강 흑수저',
          slug: '1-black-spoon',
          description: 'AI 사업계획서 작성의 첫 번째 강의입니다. 기본 개념과 시작 방법을 배웁니다.',
          vimeoId: '1027151927',
          vimeoUrl: 'https://player.vimeo.com/video/1027151927?badge=0&autopause=0&player_id=0&app_id=58479',
          thumbnailUrl: '',
          duration: 1800,
          level: '초급',
          isPublic: true,
          isPremium: true
        }
      ];
      setCourses(testCourses);
      setSelectedCourse(testCourses[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleVideoComplete = async (courseId: number) => {
    try {
      // TODO: 진도 업데이트 API 호출
      const response = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId,
          isCompleted: true,
          watchTime: selectedCourse?.duration || 0
        })
      });

      if (response.ok) {
        setUserProgress(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            isCompleted: true
          }
        }));
      }
    } catch (error) {
      console.error('진도 업데이트 오류:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const completedCount = Object.values(userProgress).filter(p => p.isCompleted).length;
    return courses.length > 0 ? (completedCount / courses.length) * 100 : 0;
  };

  // 올바른 비메오 임베드 URL 생성
  const getVimeoEmbedUrl = (course: Course) => {
    if (course.vimeoId) {
      return `https://player.vimeo.com/video/${course.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`;
    }
    return course.vimeoUrl;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>강의를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>AI 사업계획서 작성 완성 솔루션</Title>
        </TitleSection>
        <ProgressBar>
          <ProgressFill $progress={getProgressPercentage()} />
        </ProgressBar>
        <ProgressText>
          진도: {Object.values(userProgress).filter(p => p.isCompleted).length} / {courses.length} 강의 완료
        </ProgressText>
      </Header>

      <MainContent>
        {/* 강의 목록 */}
        <Sidebar>
          <SidebarTitle>강의 목록</SidebarTitle>
          <CourseTable>
            <CourseTableHeader>
              <CourseTableRow>
                <CourseTableHeaderCell>순번</CourseTableHeaderCell>
                <CourseTableHeaderCell>강의명</CourseTableHeaderCell>
                <CourseTableHeaderCell>시간</CourseTableHeaderCell>
                <CourseTableHeaderCell>상태</CourseTableHeaderCell>
              </CourseTableRow>
            </CourseTableHeader>
            <CourseTableBody>
              {courses.map((course, index) => {
                const progress = userProgress[course.id];
                const isCompleted = progress?.isCompleted || false;
                const canAccess = index === 0 || course.isPublic; // 첫 번째 강의(OT)만 접근 가능

                return (
                  <CourseTableRow
                    key={course.id}
                    isSelected={selectedCourse?.id === course.id}
                    isCompleted={isCompleted}
                    onClick={() => canAccess && handleCourseSelect(course)}
                    disabled={!canAccess}
                  >
                    <CourseTableCell>
                      <CourseNumber>{index + 1}</CourseNumber>
                    </CourseTableCell>
                    
                    <CourseTableCell>
                      <CourseContent>
                        <CourseItemTitle canAccess={canAccess}>
                          {course.title}
                          {!canAccess && <LockIcon><Lock size={14} /></LockIcon>}
                        </CourseItemTitle>
                        <CourseLevel>{course.level}</CourseLevel>
                      </CourseContent>
                    </CourseTableCell>
                    
                    <CourseTableCell>
                      <Duration>
                        <Clock size={12} />
                        {formatDuration(course.duration)}
                      </Duration>
                    </CourseTableCell>
                    
                    <CourseTableCell>
                      <StatusIcon>
                        {!canAccess ? (
                          <Lock size={16} color="#94a3b8" />
                        ) : isCompleted ? (
                          <CheckCircle size={16} color="#10B981" />
                        ) : (
                          <PlayCircle size={16} color="#3b82f6" />
                        )}
                      </StatusIcon>
                    </CourseTableCell>
                  </CourseTableRow>
                );
              })}
            </CourseTableBody>
          </CourseTable>
        </Sidebar>

        {/* 영상 플레이어 */}
        <VideoSection>
          {selectedCourse ? (
            <>
              <VideoContainer>
                <VimeoPlayer
                  src={getVimeoEmbedUrl(selectedCourse)}
                  title={selectedCourse.title}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => console.log('Vimeo player loaded:', selectedCourse.title)}
                  onError={() => console.log('Vimeo player error:', selectedCourse.title)}
                />
              </VideoContainer>
              
              <VideoInfo>
                <VideoTitle>{selectedCourse.title}</VideoTitle>
                <VideoDescription>{selectedCourse.description}</VideoDescription>
                
                <VideoMeta>
                  <MetaItem>
                    <Clock size={16} />
                    {formatDuration(selectedCourse.duration)}
                  </MetaItem>
                  <MetaItem>
                    <span>레벨: {selectedCourse.level}</span>
                  </MetaItem>
                </VideoMeta>

                {userProgress[selectedCourse.id]?.isCompleted && (
                  <CompletionBadge>
                    <CheckCircle size={16} />
                    완료됨
                  </CompletionBadge>
                )}
                
                {/* 진도 완료 버튼 (테스트용) */}
                {!userProgress[selectedCourse.id]?.isCompleted && (
                  <CompleteButton onClick={() => handleVideoComplete(selectedCourse.id)}>
                    강의 완료 표시
                  </CompleteButton>
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
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  
  &:active {
    transform: translateY(1px);
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  flex: 1;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #10B981, #059669);
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
`;

const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 120px);
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

const CourseTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CourseTableHeader = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const CourseTableBody = styled.tbody``;

const CourseTableRow = styled.tr.withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isCompleted', 'disabled'].includes(prop),
})<{ isSelected: boolean; isCompleted: boolean; disabled: boolean }>`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => {
    if (props.disabled) return '#f8fafc';
    if (props.isSelected) return '#eff6ff';
    return 'white';
  }};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background: ${props => {
      if (props.disabled) return '#f8fafc';
      if (props.isSelected) return '#eff6ff';
      return '#f8fafc';
    }};
  }
`;

const CourseTableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:first-child {
    width: 60px;
  }
  
  &:nth-child(3) {
    width: 80px;
  }
  
  &:last-child {
    width: 60px;
    text-align: center;
  }
`;

const CourseTableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
  
  &:last-child {
    text-align: center;
  }
`;

const CourseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CourseItemTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'canAccess',
})<{ canAccess: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.canAccess ? '#1a202c' : '#9ca3af'};
  margin: 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CourseLevel = styled.span`
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 500;
`;

const LockIcon = styled.span`
  color: #94a3b8;
`;

const CourseNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Duration = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
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
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
`;

const VimeoPlayer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
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

const VideoMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const CompletionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #d1fae5;
  color: #065f46;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const CompleteButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
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

export default CoursesPage;