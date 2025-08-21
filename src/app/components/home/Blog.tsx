'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
import { blogAPI } from '@/lib/graphql-client';
import type { BlogContent } from '@/lib/graphql-client';

// 카테고리별 기본 이미지 생성 함수
const getDefaultImageUrl = (categoryName?: string, title?: string, width = 400, height = 240) => {
  // 카테고리에 따른 시드값 생성
  const categorySeeds = {
    'AI 기술': 'tech',
    '사업성장': 'business', 
    '디지털 마케팅': 'marketing',
    '스타트업 인사이트': 'startup',
    '데이터 분석': 'data',
    '자동화': 'automation',
    '트렌드': 'trend'
  }
  
  const seed = categorySeeds[categoryName as keyof typeof categorySeeds] || 'business'
  const titleHash = title ? title.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0
  
  return `https://picsum.photos/seed/${seed}${titleHash}/${width}/${height}`
}

export default function BlogSection() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedPosts();
  }, []);

  const loadFeaturedPosts = async () => {
    try {
      setLoading(true);
      
      // 먼저 추천 글을 가져오고, 없으면 최신 글을 가져옵니다
      const [featuredRes, contentsRes] = await Promise.all([
        blogAPI.getFeaturedContents({ limit: 3 }),
        blogAPI.getContents({ first: 3, status: 'PUBLISHED' })
      ]);

      let posts: BlogContent[] = [];
      
      if (featuredRes.data?.featuredContents && featuredRes.data.featuredContents.length > 0) {
        posts = featuredRes.data.featuredContents;
      } else if (contentsRes.data?.contents) {
        posts = contentsRes.data.contents.slice(0, 3);
      }
      
      setFeaturedPosts(posts);
    } catch (err) {
      console.error('블로그 데이터 로드 실패:', err);
      setError('블로그 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    // content가 undefined이거나 빈 문자열인 경우 처리
    if (!content) {
      return '1분';
    }
    
    // 대략적인 읽기 시간 계산 (분당 200단어 기준)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes}분`;
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <h1>최신 블로그</h1>
            <p>Growsome의 인사이트와 노하우를 만나보세요</p>
          </Header>
          <BlogGrid>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonImage />
                <SkeletonContent>
                  <SkeletonTag />
                  <SkeletonTitle />
                  <SkeletonDescription />
                  <SkeletonMeta />
                </SkeletonContent>
              </SkeletonCard>
            ))}
          </BlogGrid>
        </ContentWrapper>
      </Container>
    );
  }

  if (error || featuredPosts.length === 0) {
    return (
      <Container>
        <ContentWrapper>
          <Header>
            <h1>최신 블로그</h1>
            <p>Growsome의 인사이트와 노하우를 만나보세요</p>
          </Header>
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyText>
              {error || '아직 게시된 블로그 글이 없습니다.'}
            </EmptyText>
            <ViewAllButton as={Link} href="/blog">
              블로그 둘러보기
            </ViewAllButton>
          </EmptyState>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <h1>최신 블로그</h1>
          <p>Growsome의 인사이트와 노하우를 만나보세요</p>
        </Header>
        
        <BlogGrid>
          {featuredPosts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{textDecoration: 'none', color: 'inherit'}}>
              <BlogCard 
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                              <BlogImage>
                <Image
                  src={post.thumbnailUrl || getDefaultImageUrl(post.category?.name, post.title)}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {post.isFeatured && (
                  <FeaturedBadge>
                    ⭐ 추천
                  </FeaturedBadge>
                )}
              </BlogImage>
                
                <BlogContent $hasImage={true}>
                  <CategoryTag>{post.category?.name || '일반'}</CategoryTag>
                  <Title>{post.title}</Title>
                  <Description>
                    {post.excerpt || post.contentBody.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                  </Description>
                  
                                  <MetaInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} color="#94a3b8" />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.viewCount || 0}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={14} color="#94a3b8" />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.likeCount || 0}</span>
                  </div>
                </MetaInfo>
                </BlogContent>
              </BlogCard>
            </Link>
          ))}
        </BlogGrid>
        
        <ViewAllButton as={Link} href="/blog">
          모든 블로그 글 보기 →
        </ViewAllButton>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  background-color: white;
  padding: 150px 0 100px 0;

  @media (max-width: 1024px) {
    padding: 100px 0 80px 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1024px) {
    max-width: 900px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
  }

  @media (max-width: 1024px) {
    margin-bottom: 40px;

    h1 {
      font-size: 2.2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  padding: 20px 0;
  margin-bottom: 50px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.div)`
  background: white;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  border: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

const BlogImage = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f8f9fa;

  img {
    transition: transform 0.3s ease;
  }

  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 193, 7, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const BlogContent = styled.div<{ $hasImage: boolean }>`
  padding: ${props => props.$hasImage ? '24px 0' : '30px'};
`;

const CategoryTag = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  margin-bottom: 8px;
  color: #1e293b;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;

  ${BlogCard}:hover & {
    color: #1e293b;
  }
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.01em;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;



const ViewAllButton = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #514FE4, #6366F1);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(81, 79, 228, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(81, 79, 228, 0.4);
    background: linear-gradient(135deg, #3D39A1, #514FE4);
  }
`;

// 로딩 스켈레톤 컴포넌트들
const SkeletonCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eaeaea;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonContent = styled.div`
  padding: 25px;
`;

const SkeletonTag = styled.div`
  width: 80px;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
  margin-bottom: 15px;
`;

const SkeletonTitle = styled.div`
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const SkeletonDescription = styled.div`
  width: 90%;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const SkeletonMeta = styled.div`
  width: 60%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
`;
