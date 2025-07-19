"use client"

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faLock } from '@fortawesome/free-solid-svg-icons';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// 색상 팔레트
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
    hero: 'linear-gradient(135deg, rgba(92, 89, 232, 0.08) 0%, rgba(92, 89, 232, 0.02) 100%)',
    accent: 'linear-gradient(135deg, #5C59E8 0%, #4A47D5 100%)'
  }
};

// 강의 미리보기 섹션
const CoursePreviewSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, #F7F9FC 0%, #FFFFFF 100%);
`;

const CoursePreviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const CoursePreviewTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.text.primary};
`;

const CoursePreviewSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: ${colors.text.secondary};
  margin-bottom: 60px;
  line-height: 1.6;
`;

// 테이블 스타일 컴포넌트들
const CourseTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 60px;
`;

const CourseTableHeader = styled.div`
  background: #f8fafc;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 80px;
  gap: 20px;
  align-items: center;
  font-weight: 600;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 12px;
    
    > span:nth-child(3),
    > span:nth-child(4) {
      display: none;
    }
  }
`;

const CourseTableRow = styled.div<{ $isPublic?: boolean }>`
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 80px;
  gap: 20px;
  align-items: center;
  transition: all 0.2s ease;
  cursor: ${props => props.$isPublic ? 'pointer' : 'default'};
  opacity: ${props => props.$isPublic ? 1 : 0.6};
  
  &:hover {
    background: ${props => props.$isPublic ? '#f8fafc' : 'transparent'};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 12px;
    
    > div:nth-child(3),
    > div:nth-child(4) {
      display: none;
    }
  }
`;

const CourseNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.text.secondary};
  text-align: center;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CourseTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
  line-height: 1.4;
`;

const CourseDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const CourseDuration = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CourseLevel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(92, 89, 232, 0.1);
  color: ${colors.accent};
  text-align: center;
`;

const CourseStatus = styled.div<{ $isPublic?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${props => props.$isPublic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  color: ${props => props.$isPublic ? '#10B981' : '#6B7280'};
`;

const CoursePreviewCTA = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const HeroButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition', 'as'].includes(prop)
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #06FF01;
  color: #000000;
  font-size: 1.4rem;
  font-weight: 800;
  padding: 20px 40px;
  border-radius: 100px;
  border: none;
  text-decoration: none;
  margin-top: 32px;
  box-shadow: 0 6px 25px rgba(6, 255, 1, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 35px rgba(6, 255, 1, 0.5);
    background: #00F100;
  }

  svg {
    color: #000000;
  }
`;

interface Course {
  id: number;
  title: string;
  description?: string;
  shortDescription?: string;
  duration: number;
  level: string;
  isPublic: boolean;
  vimeoUrl?: string;
}

const CoursePreviewTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses?preview=true');
        const data = await response.json();
        
        if (data.success) {
          setCourses(data.courses);
        } else {
          console.error('강의 데이터 로드 실패:', data.error);
        }
      } catch (error) {
        console.error('강의 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 로딩 중이거나 강의가 없을 때 샘플 데이터 사용
  const previewCourses = courses.length > 0 ? courses : [
    {
      id: 1,
      title: "#작성팁1. 챗GPT로 사업계획서 작성하기_ 초보자를 위한 가이드",
      description: "AI를 활용한 체계적인 사업계획서 작성 방법론을 배웁니다.",
      duration: 1800,
      level: "초급",
      isPublic: true
    },
    {
      id: 2,
      title: "1강. 흑수저의 실패자금 정부지원금으로 창업의 꿈을 이루세요",
      description: "정부지원금을 활용한 창업 성공 전략을 다룹니다.",
      duration: 2100,
      level: "초급",
      isPublic: false
    },
    {
      id: 3,
      title: "2강. 정부지원 사업 정보는 어디에 있는 걸까?",
      description: "정부지원사업 정보를 찾는 방법과 전략을 알아봅시다.",
      duration: 1800,
      level: "초급",
      isPublic: false
    },
    {
      id: 4,
      title: "2주차1강 합격하는 무적의 사업계획서의 비밀",
      description: "심사에 통과하는 사업계획서 작성의 핵심 비밀을 배웁니다.",
      duration: 2400,
      level: "중급",
      isPublic: false
    },
    {
      id: 5,
      title: "2주차3강읽고 싶게 만드는 사업계획서 글쓰기 원칙",
      description: "읽기 쉽고 매력적인 사업계획서 작성 방법을 익힙니다.",
      duration: 2100,
      level: "중급",
      isPublic: false
    },
    {
      id: 6,
      title: "2주차5강작성팁 02: 미드저니 인공지능으로 비전 시각화하기",
      description: "AI 도구를 활용한 비전 시각화 방법을 학습합니다.",
      duration: 1500,
      level: "중급",
      isPublic: false
    },
    {
      id: 7,
      title: "3강. 선정 확률을 높이는 나만의 정부 지원 사업 골라내기",
      description: "자신에게 맞는 정부지원사업을 선별하는 전략을 다룹니다.",
      duration: 2700,
      level: "고급",
      isPublic: false
    },
    {
      id: 8,
      title: "3주차1강 심사에 통과하는 팜플렛 전략",
      description: "효과적인 팜플렛 제작과 활용 전략을 배웁니다.",
      duration: 2400,
      level: "고급",
      isPublic: false
    }
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCourseClick = (course: Course) => {
    if (course.isPublic && course.vimeoUrl) {
      // 미리보기 가능한 강의는 바로 재생
      console.log('미리보기 강의 재생:', course.title);
      window.open(course.vimeoUrl, '_blank');
    } else {
      // 유료 강의는 강의 페이지로 이동
      window.location.href = '/courses';
    }
  };

  if (loading) {
    return (
      <CoursePreviewSection>
        <CoursePreviewContainer>
          <CoursePreviewTitle>
            💪 강의 미리보기
          </CoursePreviewTitle>
          <CoursePreviewSubtitle>
            강의 데이터를 로드하고 있습니다...
          </CoursePreviewSubtitle>
        </CoursePreviewContainer>
      </CoursePreviewSection>
    );
  }

  return (
    <CoursePreviewSection>
      <CoursePreviewContainer>
        <CoursePreviewTitle>
          💪 강의 미리보기
        </CoursePreviewTitle>
        <CoursePreviewSubtitle>
          실제 강의 내용을 미리 확인해보세요.<br/>
          첫 번째 강의는 무료로 시청할 수 있습니다.
        </CoursePreviewSubtitle>
        
        <CourseTable>
          <CourseTableHeader>
            <span>순번</span>
            <span>강의명</span>
            <span>시간</span>
            <span>레벨</span>
            <span>상태</span>
          </CourseTableHeader>
          
          {previewCourses.map((course, index) => (
            <CourseTableRow
              key={course.id}
              $isPublic={course.isPublic}
              onClick={() => handleCourseClick(course)}
            >
              <CourseNumber>{index + 1}</CourseNumber>
              
              <CourseInfo>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDescription>
                  {course.description || course.shortDescription || '강의 설명이 준비 중입니다.'}
                </CourseDescription>
              </CourseInfo>
              
              <CourseDuration>
                <Clock size={14} />
                {formatDuration(course.duration || 0)}
              </CourseDuration>
              
              <CourseLevel>{course.level || '초급'}</CourseLevel>
              
              <CourseStatus $isPublic={course.isPublic}>
                {course.isPublic ? (
                  <>
                    <FontAwesomeIcon icon={faPlay} />
                    무료
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} />
                    잠김
                  </>
                )}
              </CourseStatus>
            </CourseTableRow>
          ))}
        </CourseTable>
        
        <CoursePreviewCTA>
          <Link href="/courses" passHref>
            <HeroButton
              as="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={() => {}}
            >
              전체 강의 패키지 시작하기
              <ArrowRight size={20} />
            </HeroButton>
          </Link>
        </CoursePreviewCTA>
      </CoursePreviewContainer>
    </CoursePreviewSection>
  );
};

export default CoursePreviewTable;
