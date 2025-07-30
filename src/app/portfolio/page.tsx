'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Portfolio = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const projects = [
    {
      id: 'skykey',
      image: '/images/projects/skykey/main_thumb_800x500.png',
      title: '스카이키',
      description: '급매 부동산 데이터를 제공하는 투자 지원 플랫폼',
      category: 'Web Platform',
      client: '스카이키',
      year: '2024~2025'
    },
    {
      id: 'withslow',
      image: '/images/projects/withslow/main_thumb_800x500.png',
      title: '느린걸음 플러스',
      description: '발달장애인을 위한 비대면 교육과 중개 플랫폼',
      category: 'Web Platform',
      client: '더느린걸음',
      year: '2024~2025'
    },
    {
      id: 'pickup',
      image: '/images/projects/pickup/main_thumb_800x500.png',
      title: '픽업해',
      description: '0% 배달수수료 픽업해',
      category: 'Service SaaS',
      client: '디어라운드',
      year: '2025'
    },
    {
      id: 'cupas',
      image: '/images/projects/cupas/main_thumb_800x500.png',
      title: '쿠파스 자동화',
      description: 'N잡러를 위한 쿠팡파트너스 자동화 솔루션',
      category: 'Marketing',
      client: '디어라운드',
      year: '2025'
    },
    {
      id: 'doasome',
      image: '/images/projects/doasome/main_thumb_800x500.png',
      title: '두-어썸',
      description: '성과를 복사하세요',
      category: 'Service SaaS',
      client: '디어라운드',
      year: '2025'
    }
  ];

  return (
    <ProjectsPage>
      <PageHeader
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1>Projects</h1>
        <p>우리가 만든 혁신적인 프로젝트들을 소개합니다</p>
      </PageHeader>

      <ProjectGrid>
        {projects.map((project, index) => (
          <Link key={project.id} href={`/portfolio/${project.id}`} passHref>
            <ProjectCard
              as={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <ProjectImage>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </ProjectImage>
              <ProjectInfo>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectMeta>
                  <MetaItem>
                    <MetaLabel>Category:</MetaLabel>
                    <MetaValue>{project.category}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Client:</MetaLabel>
                    <MetaValue>{project.client}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Year:</MetaLabel>
                    <MetaValue>{project.year}</MetaValue>
                  </MetaItem>
                </ProjectMeta>
              </ProjectInfo>
            </ProjectCard>
          </Link>
        ))}
      </ProjectGrid>
    </ProjectsPage>
  );
  
};



const ProjectsPage = styled.div`
  padding: 120px 0;
  background: #f8f9fa;
  min-height: 90vh;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const ProjectGrid = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  overflow: hidden;
  
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-radius: 20px;

  img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ProjectInfo = styled.div`
  padding: 2rem;
`;

const ProjectTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProjectMeta = styled.div`
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  min-width: 100px;
`;

const MetaValue = styled.span`
  color: #666;
`;

const ViewProject = styled(Link)`
  display: inline-block;
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

export default Portfolio;
