'use client';

import React from 'react';
import styled from 'styled-components';
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
            <Hero
                as={motion.div}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
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

            <MainImage>
                <img src={project.mainImage} alt={project.title} />
            </MainImage>

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

                <ImageGallery>
                    {project.images.map((image: string, index: number) => (
                        <GalleryImage
                            key={index}
                            as={motion.div}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <img src={image} alt={`${project.title} screenshot ${index + 1}`} />
                        </GalleryImage>
                    ))}
                </ImageGallery>
            </ContentSection>
        </ProjectDetailPage>
    );
}

const ProjectDetailPage = styled.div`
    background: #f8f9fa;
`;

const Hero = styled.div`
    background: #514FE4;
    color: white;
    padding: 120px 0 60px;
`;

const HeroContent = styled.div`
    max-width: 1440px;
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

const MainImage = styled.div`
    width: 100%;
    height: 600px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ContentSection = styled.div`
    max-width: 1440px;
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
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
    color: #666;
    line-height: 1.6;
`;

const ImageGallery = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 4rem;
`;

const GalleryImage = styled.div`
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`; 