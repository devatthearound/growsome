'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { blogAPI } from '@/lib/graphql-client';
import type { BlogContent } from '@/lib/graphql-client';

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
      </Container>
    );
  }

  if (error || featuredPosts.length === 0) {
    return (
      <Container>
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
      </Container>
    );
  }

  return (
    <Container>
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
              {post.thumbnailUrl && (
                <BlogImage>
                  <Image
                    src={post.thumbnailUrl}
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
              )}
              
              <BlogContent $hasImage={!!post.thumbnailUrl}>
                <CategoryTag>{post.category?.name || '일반'}</CategoryTag>
                <Title>{post.title}</Title>
                <Description>
                  {post.excerpt || post.contentBody.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                </Description>
                
                <MetaInfo>
                  <AuthorInfo>
                    {post.author?.avatar && (
                      <AuthorAvatar>
                        <Image
                          src={post.author.avatar}
                          alt={post.author.username}
                          width={24}
                          height={24}
                          style={{ borderRadius: '50%' }}
                        />
                      </AuthorAvatar>
                    )}
                    <span>{post.author?.username || '작성자'}</span>
                  </AuthorInfo>
                  
                  <MetaDetails>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <span>•</span>
                    <span>{getReadingTime(post.contentBody)} 읽기</span>
                  </MetaDetails>
                </MetaInfo>
                
                <BlogStats>
                  <StatItem>
                    <span>👁</span>
                    <span>{post.viewCount}</span>
                  </StatItem>
                  <StatItem>
                    <span>❤️</span>
                    <span>{post.likeCount}</span>
                  </StatItem>
                  <StatItem>
                    <span>💬</span>
                    <span>{post.commentCount}</span>
                  </StatItem>
                </BlogStats>
              </BlogContent>
            </BlogCard>
          </Link>
        ))}
      </BlogGrid>
      
      <ViewAllButton as={Link} href="/blog">
        모든 블로그 글 보기 →
      </ViewAllButton>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 150px 20px 100px 20px;
  background-color: #F8F9FA;

  @media (min-width: 700px) {
    padding: 150px 20px;
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
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  padding: 20px 0;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border-color: #514FE4;
  }
`;

const BlogImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

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
  padding: ${props => props.$hasImage ? '25px' : '30px'};
`;

const CategoryTag = styled.span`
  background: linear-gradient(135deg, #514FE4, #6366F1);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${BlogCard}:hover & {
    color: #514FE4;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const MetaDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #888;

  span:nth-child(2) {
    color: #ddd;
  }
`;

const BlogStats = styled.div`
  display: flex;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #888;

  span:first-child {
    font-size: 1rem;
  }
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
