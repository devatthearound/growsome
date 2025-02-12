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
      year: '2023'
    },
    {
      id: 'withslow',
      image: '/images/projects/withslow/main_thumb_800x500.png',
      title: '느린걸음 플러스',
      description: '발달장애인을 위한 비대면 교육과 중개 플랫폼',
      category: 'Web Platform',
      client: '느린걸음',
      year: '2023'
    },
    {
      id: 'affiliate',
      image: '/images/projects/affiliate/main_thumb_800x500.png',
      title: '제휴마케팅',
      description: 'N잡러를 위한 가성비 제품을 큐레이션하는 쿠팡파트너스 유튜브 채널',
      category: 'Marketing',
      client: '그로썸',
      year: '2023'
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
          <ProjectCard
            key={project.id}
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
              <ViewProject href={`/portfolio/${project.id}`}>
                View Project
              </ViewProject>
            </ProjectInfo>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </ProjectsPage>
  );
};

const ProjectsPage = styled.div`
  padding: 120px 0;
  background: #f8f9fa;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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
