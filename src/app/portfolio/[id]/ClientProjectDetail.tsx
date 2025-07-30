'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faCode, faRocket } from '@fortawesome/free-solid-svg-icons';

interface ProjectDetailProps {
    project: any; // 실제 프로젝트 타입을 정의하면 좋습니다
}

export default function ClientProjectDetail({ project }: ProjectDetailProps) {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <ProjectDetailPage>
            <Hero $bgColor={project.bgColor || '#514FE4'}>
                <HeroContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <ProjectMeta>
                        <MetaItem>
                            <MetaLabel>Category</MetaLabel>
                            <MetaValue>{project.category}</MetaValue>
                        </MetaItem>
                        <MetaItem>
                            <MetaLabel>Client</MetaLabel>
                            <MetaValue>{project.client}</MetaValue>
                        </MetaItem>
                        <MetaItem>
                            <MetaLabel>Year</MetaLabel>
                            <MetaValue>{project.year}</MetaValue>
                        </MetaItem>
                    </ProjectMeta>
                </HeroContent>
            </Hero>

            <MainImageWrapper $bgColor={project.imageBgColor || '#FFFFFF'}>
                {project.images && project.images.length > 0 ? (
                    project.images.map((image: string, index: number) => (
                        <Image 
                            key={index}
                            src={image}
                            alt={`${project.title} image ${index + 1}`}
                            width={1600}
                            height={1000}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                            priority
                        />
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </MainImageWrapper>

            <ContentSection>
                <SectionTitle>Overview</SectionTitle>
                <SectionText>{project.overview}</SectionText>

                <SectionTitle>The Challenge</SectionTitle>
                <SectionText>{project.challenge}</SectionText>

                <SectionTitle>The Solution</SectionTitle>
                <SectionText>{project.solution}</SectionText>

                <FeaturesGrid>
                    {project.features.map((feature: any, index: number) => (
                        <FeatureCard
                            key={index}
                            as={motion.div}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            transition={{ delay: index * 0.2 }}
                        >
                            <FeatureIcon>
                                <FontAwesomeIcon icon={feature.icon} />
                            </FeatureIcon>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                        </FeatureCard>
                        
                    ))}
                </FeaturesGrid>
                {project.link && (
                <ProjectLink href={project.link} target="_blank" rel="noopener noreferrer">
                    Visit Project
                </ProjectLink>
            )}
            </ContentSection>
        </ProjectDetailPage>
    );
}

const ProjectDetailPage = styled.div`
    background: #f8f9fa;
`;

// bgColor를 $bgColor로 변경하여 transient prop으로 만들기
const Hero = styled.div<{ $bgColor: string }>`
    background: ${({ $bgColor }) => $bgColor};
    color: white;
    padding: 120px 0 60px;
`;

const HeroContent = styled.div`
    max-width: 700px;
    margin: 0 auto;
    padding: 0 2rem;
`;

const ProjectTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
    font-size: 1.5rem;
    opacity: 0.9;
    margin-bottom: 2rem;
`;

const ProjectMeta = styled.div`
    display: flex;
    gap: 4rem;
`;

const MetaItem = styled.div``;

const MetaLabel = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
`;

const MetaValue = styled.div`
    font-size: 1.1rem;
    font-weight: 500;
`;

// bgColor를 $bgColor로 변경하여 transient prop으로 만들기
const MainImageWrapper = styled.div<{ $bgColor: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1900px;
    width: 100%;
    height: auto;
    position: relative;
    margin: 0 auto;
    background-color: ${({ $bgColor }) => $bgColor};
`;

const ContentSection = styled.div`
    max-width: 700px;
    margin: 0 auto;
    padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    margin: 3rem 0 1.5rem;
`;

const SectionText = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666;
    margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 4rem 0;
`;

const FeatureCard = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const FeatureIcon = styled.div`
    font-size: 2rem;
    color: #514FE4;
    margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
    color: #666;
    line-height: 1.6;
`;

const ProjectLink = styled.a`
    display: inline-block;
    background: #514FE4;
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 2rem;
    transition: background 0.3s ease;

    &:hover {
        background: #3f3d9e;
    }
`; 