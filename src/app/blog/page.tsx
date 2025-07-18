'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled, { ThemeProvider, keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { Tag, Search, Filter, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { growsomeTheme } from '@/components/design-system/theme'
import { Typography } from '@/components/design-system/Typography'
import { ColumnBox, RowBox, Container } from '@/components/design-system/Layout'
import { GreenButton, SecondaryButton, PrimaryButton } from '@/components/design-system/Button'
import { blogAPI, type BlogContent, type BlogCategory } from '@/lib/graphql-client'

// Main Container for 1240px width
const MainContainer = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const BlogPageContainer = styled.div`
  width: 100%;
  background: ${growsomeTheme.color.White};
  min-height: 100vh;
  padding-top: 60px;
`;

const HeroSection = styled.section`
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.xl} 0;
  border-bottom: 1px solid ${growsomeTheme.color.Gray200};
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.div)`
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const BrandText = styled.span`
  color: ${growsomeTheme.color.Primary500};
  font-weight: ${growsomeTheme.fontWeight.Bold};
`;

const HeroSubtitle = styled(motion.div)`
  margin-bottom: ${growsomeTheme.spacing['2xl']};
  animation: ${float} 6s ease-in-out infinite;
`;

const StatsRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${growsomeTheme.spacing['2xl']};
  margin-top: ${growsomeTheme.spacing['2xl']};
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
    gap: ${growsomeTheme.spacing.lg};
    align-items: center;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${growsomeTheme.spacing.lg} ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.div`
  font-size: ${growsomeTheme.fontSize.DisplayS};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Green400};
  margin-bottom: ${growsomeTheme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${growsomeTheme.fontSize.TextS};
  color: rgba(255, 255, 255, 0.8);
`;

const ContentSection = styled.section`
  padding: ${growsomeTheme.spacing.lg} 0 ${growsomeTheme.spacing.xl} 0;
  background: ${growsomeTheme.color.White};
`;



const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.sm};
  background: ${growsomeTheme.color.Gray100};
  color: ${growsomeTheme.color.Gray600};
  padding: ${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius1};
  margin-bottom: ${growsomeTheme.spacing.xl};
  font-weight: ${growsomeTheme.fontWeight.Medium};
`;

const FilterSection = styled.div`
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.md} 0;
  border-bottom: 1px solid ${growsomeTheme.color.Gray200};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${growsomeTheme.spacing.sm};
  margin-bottom: 0;
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    justify-content: flex-start;
    padding: 0 20px ${growsomeTheme.spacing.lg} 20px;
  }
`;

const CategoryButton = styled(motion.button)<{ $active?: boolean }>`
  background: ${props => props.$active ? growsomeTheme.color.Black800 : growsomeTheme.color.White};
  color: ${props => props.$active ? growsomeTheme.color.White : growsomeTheme.color.Gray600};
  border: 1px solid ${props => props.$active ? growsomeTheme.color.Black800 : growsomeTheme.color.Gray300};
  padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius1};
  font-size: ${growsomeTheme.fontSize.TextS};
  font-weight: ${growsomeTheme.fontWeight.Medium};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  
  &:hover {
    background: ${growsomeTheme.color.Black800};
    color: ${growsomeTheme.color.White};
    border-color: ${growsomeTheme.color.Black800};
    transform: translateY(-1px);
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${growsomeTheme.spacing['2xl']};
  justify-items: start;
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${growsomeTheme.spacing.xl};
  }
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
    gap: ${growsomeTheme.spacing.lg};
  }
`;

const PostsLoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${growsomeTheme.spacing['2xl']};
  justify-items: start;
  opacity: 1;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${growsomeTheme.spacing.xl};
  }
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
    gap: ${growsomeTheme.spacing.lg};
  }
`;

const BlogCard = styled(motion.article)`
  background: ${growsomeTheme.color.White};
  border-radius: 0;
  overflow: hidden;
  border: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

const BlogImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: ${growsomeTheme.color.Gray100};
`;

const BlogImage = styled(Image)`
  transition: transform ${growsomeTheme.transition.slow};
  
  ${BlogCard}:hover & {
    transform: scale(1.05);
  }
`;

const BlogContent = styled.div`
  padding: ${growsomeTheme.spacing.lg} 0;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const CategoryTag = styled.span`
  background: ${growsomeTheme.color.Gray100};
  color: ${growsomeTheme.color.Gray600};
  padding: ${growsomeTheme.spacing.xs} ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  font-size: ${growsomeTheme.fontSize.TextXS};
  font-weight: ${growsomeTheme.fontWeight.Medium};
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;



const BlogTitle = styled.h3`
  font-size: ${growsomeTheme.fontSize.TextXL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  margin-bottom: ${growsomeTheme.spacing.sm};
  line-height: 1.4;
  letter-spacing: -0.01em;
  
  ${BlogCard}:hover & {
    color: ${growsomeTheme.color.Black800};
  }
`;

const BlogExcerpt = styled.p`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Gray500};
  line-height: 1.6;
  margin-bottom: ${growsomeTheme.spacing.lg};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.01em;
`;



const LoadingCard = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: 0;
  overflow: hidden;
  border: none;
`;

const LoadingSkeleton = styled.div<{ width?: string; height?: string }>`
  background: ${growsomeTheme.color.Gray100};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${growsomeTheme.radius.radius1};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.4), 
      transparent
    );
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`;

const EmptyState = styled.div`
  text-align: left;
  padding: ${growsomeTheme.spacing['2xl']} 0;
  background: ${growsomeTheme.color.White};
  border-radius: 0;
  box-shadow: none;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${growsomeTheme.spacing.xl};
  animation: ${float} 3s ease-in-out infinite;
`;

const LoadMoreSection = styled.div`
  text-align: left;
  margin-top: ${growsomeTheme.spacing['2xl']};
`;

// Featured Post Styles
const HeroCard = styled(motion.div)`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

const HeroCardContainer = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: 0;
  overflow: hidden;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  
  &:hover {
    box-shadow: none;
    transform: none;
  }
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
  }
`;

const HeroImageSection = styled.div`
  position: relative;
  width: 50%;
  min-height: 320px;
  
  @media ${growsomeTheme.device.mobile} {
    width: 100%;
    height: 240px;
  }
`;

const HeroImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HeroBadge = styled.div`
  position: absolute;
  top: ${growsomeTheme.spacing.lg};
  left: ${growsomeTheme.spacing.lg};
  background: ${growsomeTheme.color.Black800};
  padding: ${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius1};
`;

const HeroContentSection = styled.div`
  width: 50%;
  padding: ${growsomeTheme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media ${growsomeTheme.device.mobile} {
    width: 100%;
    padding: ${growsomeTheme.spacing.xl};
  }
`;

const CategoryBadge = styled.div`
  background: ${growsomeTheme.color.Gray100};
  color: ${growsomeTheme.color.Gray600};
  padding: ${growsomeTheme.spacing.xs} ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius1};
  display: inline-block;
  width: fit-content;
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const HeroPostTitle = styled.div`
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const HeroExcerpt = styled.div`
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const HeroMetaRow = styled.div`
  display: flex;
  gap: ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    flex-wrap: wrap;
    gap: ${growsomeTheme.spacing.md};
  }
`;

const EmptyHeroCard = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: 0;
  padding: ${growsomeTheme.spacing['2xl']} 0;
  text-align: left;
  border: none;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

const NewStoriesSection = styled.section`
  padding: ${growsomeTheme.spacing.lg} 0 0 0;
  background: ${growsomeTheme.color.White};
`;

const SectionTitle = styled.div`
  margin-bottom: ${growsomeTheme.spacing.lg};
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  
  h2 {
    font-size: ${growsomeTheme.fontSize.DisplayM};
    font-weight: ${growsomeTheme.fontWeight.Bold};
    color: ${growsomeTheme.color.Black800};
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.sm};
`;

const ReadMoreButton = styled.div`
  @media ${growsomeTheme.device.mobile} {
    display: flex;
    justify-content: center;
  }
`;

export default function BlogMainPage() {
  const [contents, setContents] = useState<BlogContent[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [featuredContents, setFeaturedContents] = useState<BlogContent[]>([])
  const [heroContent, setHeroContent] = useState<BlogContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      loadPosts()
    }
  }, [selectedCategory, categories])

  const loadInitialData = async () => {
    try {
      setLoading(true)

      const [
        categoriesRes,
        featuredRes,
        heroRes
      ] = await Promise.all([
        blogAPI.getCategories({ isVisible: true }),
        blogAPI.getFeaturedContents({ limit: 3 }),
        blogAPI.getHeroContent()
      ])

      if (categoriesRes.data) setCategories(categoriesRes.data.categories)
      if (featuredRes.data) setFeaturedContents(featuredRes.data.featuredContents)
      if (heroRes.data) setHeroContent(heroRes.data.heroContent)

      // 초기 포스트 로드
      const contentsRes = await blogAPI.getContents({ 
        first: 12, 
        status: 'PUBLISHED' 
      })
      if (contentsRes.data) setContents(contentsRes.data.contents)

    } catch (error) {
      console.error('블로그 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    try {
      setPostsLoading(true)

      const contentsRes = await blogAPI.getContents({ 
        first: 12, 
        categoryId: selectedCategory || undefined,
        status: 'PUBLISHED' 
      })

      if (contentsRes.data) setContents(contentsRes.data.contents)

    } catch (error) {
      console.error('포스트 로드 실패:', error)
    } finally {
      setPostsLoading(false)
    }
  }



  const LoadingComponent = () => (
    <BlogPageContainer>
      <ThemeProvider theme={growsomeTheme}>
        <HeroSection>
          <MainContainer>
            <HeroContent>
              <ColumnBox $gap={3} $ai="center">
                <LoadingSkeleton height="40px" width="200px" style={{ 
                  margin: '0 auto 2rem', 
                  borderRadius: growsomeTheme.radius.full,
                  backgroundColor: growsomeTheme.color.Gray200
                }} />
                <LoadingSkeleton height="300px" width="100%" style={{ 
                  borderRadius: growsomeTheme.radius.radius4, 
                  maxWidth: '1000px',
                  backgroundColor: growsomeTheme.color.Gray200
                }} />
              </ColumnBox>
            </HeroContent>
          </MainContainer>
        </HeroSection>
        
        <ContentSection>
          <MainContainer>
            <PostsGrid>
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i}>
                  <LoadingSkeleton height="240px" />
                  <div style={{ padding: `${growsomeTheme.spacing.lg} 0` }}>
                    <LoadingSkeleton height="20px" width="30%" style={{ marginBottom: '1rem' }} />
                    <LoadingSkeleton height="60px" width="100%" style={{ marginBottom: '1rem' }} />
                    <LoadingSkeleton height="80px" width="100%" style={{ marginBottom: '1rem' }} />
                    <LoadingSkeleton height="20px" width="50%" />
                  </div>
                </LoadingCard>
              ))}
            </PostsGrid>
          </MainContainer>
        </ContentSection>
      </ThemeProvider>
    </BlogPageContainer>
  )

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <ThemeProvider theme={growsomeTheme}>
      <BlogPageContainer>
        {/* Hero Section - Featured Post */}
        <HeroSection>
          <MainContainer>
            {heroContent || (featuredContents.length > 0) ? (
              <HeroCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Link href={`/blog/${(heroContent || featuredContents[0])?.slug}`}>
                  <HeroCardContainer>
                    <HeroImageSection>
                      {(heroContent || featuredContents[0])?.thumbnailUrl && (
                        <HeroImageContainer>
                          <BlogImage
                            src={(heroContent || featuredContents[0])!.thumbnailUrl!}
                            alt={(heroContent || featuredContents[0])!.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'cover' }}
                          />
                        </HeroImageContainer>
                      )}
                      <HeroBadge>
                        <Typography.TextS600 color={growsomeTheme.color.White}>
                          이주의 특별 추천 글
                        </Typography.TextS600>
                      </HeroBadge>
                    </HeroImageSection>
                    
                    <HeroContentSection>
                      <CategoryBadge>
                        <Typography.TextXS600 color={growsomeTheme.color.Primary600}>
                          {(heroContent || featuredContents[0])?.category?.name}
                        </Typography.TextXS600>
                      </CategoryBadge>
                      
                      <HeroPostTitle>
                        <Typography.DisplayM700 color={growsomeTheme.color.Black800} style={{ lineHeight: '1.2', marginBottom: growsomeTheme.spacing.md }}>
                          {(heroContent || featuredContents[0])?.title}
                        </Typography.DisplayM700>
                      </HeroPostTitle>
                      
                      <HeroExcerpt>
                        <Typography.TextL400 color={growsomeTheme.color.Gray400} style={{ lineHeight: '1.6', marginBottom: growsomeTheme.spacing.lg }}>
                          {(heroContent || featuredContents[0])?.excerpt}
                        </Typography.TextL400>
                      </HeroExcerpt>
                      
                      <HeroMetaRow>



                      </HeroMetaRow>
                    </HeroContentSection>
                  </HeroCardContainer>
                </Link>
              </HeroCard>
            ) : (
              <EmptyHeroCard>
                <ColumnBox $gap={2} $ai="center">
                  <Typography.DisplayL700 color={growsomeTheme.color.Black800} style={{ textAlign: 'center' }}>
                    <BrandText>Growsome</BrandText> 블로그
                  </Typography.DisplayL700>
                  <Typography.TextL400 color={growsomeTheme.color.Gray400} style={{ textAlign: 'center' }}>
                    AI 시대, 비즈니스 성장을 위한 인사이트와 노하우
                  </Typography.TextL400>
                </ColumnBox>
              </EmptyHeroCard>
            )}
          </MainContainer>
        </HeroSection>

        {/* New Stories Section with Filter Tabs */}
        <NewStoriesSection>
          <MainContainer>
            <SectionTitle>
              <h2>새로 올라온 이야기</h2>
            </SectionTitle>
            
            {/* Filter Tabs */}
            <FilterContainer>
              <CategoryButton
                $active={selectedCategory === null}
                onClick={() => setSelectedCategory(null)}
              >
                전체 글
              </CategoryButton>
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  $active={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </FilterContainer>
          </MainContainer>
        </NewStoriesSection>

        {/* All Posts Section */}
        <ContentSection style={{ paddingTop: 0 }}>
          <MainContainer>
 
            {postsLoading ? (
              <PostsLoadingGrid>
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i}>
                    <LoadingSkeleton height="240px" />
                    <div style={{ padding: `${growsomeTheme.spacing.lg} 0` }}>
                      <LoadingSkeleton height="20px" width="30%" style={{ marginBottom: '1rem' }} />
                      <LoadingSkeleton height="60px" width="100%" style={{ marginBottom: '1rem' }} />
                      <LoadingSkeleton height="80px" width="100%" style={{ marginBottom: '1rem' }} />
                      <LoadingSkeleton height="20px" width="50%" />
                    </div>
                  </LoadingCard>
                ))}
              </PostsLoadingGrid>
            ) : contents.length === 0 ? (
              <EmptyState>
                <EmptyIcon>😔</EmptyIcon>
                <h3>아직 게시된 글이 없습니다</h3>
                <p>곧 유용한 콘텐츠로 찾아뵙겠습니다!</p>
              </EmptyState>
            ) : (
              <PostsGrid>
                {contents.map((content, index) => (
                  <Link key={content.id} href={`/blog/${content.slug}`}>
                    <BlogCard
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {content.thumbnailUrl && (
                        <BlogImageContainer>
                          <BlogImage
                            src={content.thumbnailUrl}
                            alt={content.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                          />
                        </BlogImageContainer>
                      )}
                      <BlogContent>
                        <BlogMeta>
                          <CategoryTag>{content.category?.name}</CategoryTag>
                        </BlogMeta>
                        
                        <BlogTitle>{content.title}</BlogTitle>
                        <BlogExcerpt>{content.excerpt}</BlogExcerpt>
                        

                      </BlogContent>
                    </BlogCard>
                  </Link>
                ))}
              </PostsGrid>
            )}

            {/* Load More */}
            {contents.length >= 12 && (
              <LoadMoreSection>
                <PrimaryButton $size="large">
                  더 많은 글 보기
                  <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </PrimaryButton>
              </LoadMoreSection>
            )}
          </MainContainer>
        </ContentSection>
      </BlogPageContainer>
    </ThemeProvider>
  )
}
