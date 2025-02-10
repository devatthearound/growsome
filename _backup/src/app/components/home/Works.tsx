'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const projects = [
  {
    id: 1,
    image: '/images/projects/skykey/main_thumb_800x500.png',
    title: '스카이키',
    description: '급매 부동산 데이터를 제공하는 투자 지원 플랫폼',
    link: '/projects/skykey'
  },
  {
    id: 2,
    image: '/images/projects/withslow/main_thumb_800x500.png',
    title: '느린걸음 플러스',
    description: '발달장애인을 위한 비대면 교육과 중개 플랫폼',
    link: '/projects/withslow'
  },
  {
    id: 3,
    image: '/images/projects/affiliate/main_thumb_800x500.png',
    title: '제휴마케팅',
    description: 'N잡러를 위한 가성비 제품을 큐레이션하는 쿠팡파트너스 유튜브 채널',
    link: '/projects/affiliate'
  },
  {
    id: 4,
    image: '/images/projects/aiimage/main_thumb_800x500.png',
    title: 'Biinuu',
    description: 'AI를 활용한 강화도 특산물을 활용한 천연 피부 관리 비누 브랜딩 및 상세페이지',
    link: '/projects/biinuu'
  },
  {
    id: 5,
    image: '/images/projects/bigdata/main_thumb_800x500.png',
    title: '빅데이터 수집가공, 표준화',
    description: '헬스케어 빅데이터 수집가공',
    link: '/projects/bigdata'
  }
];

const Works = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    if (sliderRef.current) {
      const isLastSlide = currentIndex === projects.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: sliderRef.current.clientWidth * newIndex,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  const prevSlide = useCallback(() => {
    if (sliderRef.current) {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? projects.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: sliderRef.current.clientWidth * newIndex,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 5000);
    return () => clearInterval(autoSlide);
  }, [nextSlide]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side code
    }
  }, []);

  return (
    <WorksSection id="works">
      <Container>
        <SectionHeader>
          <SectionTag>Projects</SectionTag>
          <h2>주요 프로젝트</h2>
        </SectionHeader>
        
        <WorksSliderContainer>
          <WorksGrid ref={sliderRef}>
            {projects.map((project) => (
              <WorkCard key={project.id}>
                <WorkImage src={project.image} alt={project.title} />
                <WorkInfo>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ReadMore href={project.link}>
                    자세히 보기 <FontAwesomeIcon icon={faArrowRight} />
                  </ReadMore>
                </WorkInfo>
              </WorkCard>
            ))}
          </WorksGrid>

          <SlideButton onClick={prevSlide} className="prev">
            <FontAwesomeIcon icon={faChevronLeft} />
          </SlideButton>
          <SlideButton onClick={nextSlide} className="next">
            <FontAwesomeIcon icon={faChevronRight} />
          </SlideButton>
        </WorksSliderContainer>

        <ViewAllButton href="/portfolio">
          전체 프로젝트 보기 <FontAwesomeIcon icon={faArrowRight} />
        </ViewAllButton>
      </Container>
    </WorksSection>
  );
};

const WorksSection = styled.section`
  padding: 6rem 0;
  background: #f8f9fa;
`;

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }
`;

const SectionTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(81, 79, 228, 0.1);
  color: #514FE4;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const WorksSliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0 -2rem;
  padding: 0 2rem;
`;

const WorksGrid = styled.div`
  display: flex;
  gap: 2rem;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const WorkCard = styled.div`
  min-width: calc(100% - 4rem);
  flex-shrink: 0;
  scroll-snap-align: start;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    min-width: calc(50% - 1rem);
  }

  @media (min-width: 1200px) {
    min-width: calc(33.333% - 1.333rem);
  }
`;

const WorkImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const WorkInfo = styled.div`
  padding: 1.5rem;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const ReadMore = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #514FE4;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: #514FE4;
    color: white;
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ViewAllButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 3rem;
  padding: 1rem 2rem;
  background: #514FE4;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

export default Works;
