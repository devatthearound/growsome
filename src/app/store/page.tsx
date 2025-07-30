'use client';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRocket, faChartLine, faUsers, faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Store = () => {
  const router = useRouter();

  // fadeIn 애니메이션 정의 추가
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const products = [
    {
      id: 1,
      image: '/images/store/product1.jpg',
      title: '자연스러운 동정 결렉션',
      tags: ['Midjourney', '동정', '자연'],
      price: 25000,
      originalPrice: 30000,
      description: 'AI로 제작된 자연스러운 동정 컬렉션입니다.'
    },
    {
      id: 2,
      image: '/images/store/product2.jpg',
      title: '미니멀 로고 디자인',
      tags: ['DALL-E', '로고', '브랜딩'],
      price: 35000,
      originalPrice: 40000,
      description: 'AI로 제작된 미니멀한 로고 디자인 템플릿입니다.'
    },
    {
      id: 3,
      image: '/images/store/product3.jpg',
      title: '캐릭터 일러스트',
      tags: ['Stable Diffusion', '캐릭터', '일러스트'],
      price: 30000,
      originalPrice: 35000,
      description: 'AI로 제작된 귀여운 캐릭터 일러스트입니다.'
    },
    {
      id: 4,
      image: '/images/store/product4.jpg',
      title: '제품 상세페이지 템플릿',
      tags: ['디자인', '쇼핑몰', '템플릿'],
      price: 40000,
      originalPrice: 45000,
      description: 'AI로 제작된 제품 상세페이지 템플릿입니다.'
    },
    {
      id: 5,
      image: '/images/store/product5.jpg',
      title: '프로덕트 목업 세트',
      tags: ['목업', '브랜딩', '3D'],
      price: 28000,
      originalPrice: 32000,
      description: 'AI로 제작된 프로덕트 목업 세트입니다.'
    },
    {
      id: 6,
      image: '/images/store/product6.jpg',
      title: '추상 아트 컬렉션',
      tags: ['Midjourney', '추상', '예술'],
      price: 32000,
      originalPrice: 38000,
      description: 'AI로 제작된 추상 아트 컬렉션입니다.'
    }
  ];

  const handleDetailNavigation = (productId: number) => {
    // Navigate to the product detail page
    router.push(`/store/${productId}`);
  };

  const handlePurchase = (productId: number) => {
    // Navigate to the payment page
    router.push('/payment', {
      // state: {
      //   product: products.find(p => p.id === productId)
      // }
    });
  };

  const handleToolAction = (toolId: string) => {
    if (toolId === 'affiliate') {
      // 제휴자동화 서비스 시작
      router.push('/affil');
    } else if (toolId === 'funnel') {
      // 퍼널자동화 다운로드
      window.open('http://localhost:3001/funnel', '_blank');
    }
  };

  // Tools 섹션을 위한 데이터
  const tools = [
    {
      id: 'affiliate',
      title: "제휴자동화",
      subtitle: "Affiliate Automation",
      description: "쿠팡 파트너스 API를 활용한 자동화된 제휴 마케팅 솔루션",
      image: "/images/tools/product1.png",
      features: [
        "쿠팡 파트너스 API 자동 연동",
        "상품 검색 및 영상 자동 생성",
        "유튜브 자동 업로드",
        "템플릿 기반 영상 제작",
        "실시간 성과 분석"
      ],
      color: "#514FE4",
      bgColor: "rgba(81, 79, 228, 0.1)",
      icon: <FontAwesomeIcon icon={faRocket} />,
      link: "/affil"
    },
    {
      id: 'funnel',
      title: "퍼널자동화", 
      subtitle: "Funnel Automation",
      description: "AI 기반 퍼널 자동화로 리드 생성부터 전환까지 완벽 자동화",
      image: "/images/tools/product2.png",
      features: [
        "AI 기반 퍼널 설계",
        "자동 리드 생성",
        "스마트 전환 최적화",
        "실시간 퍼널 분석",
        "A/B 테스트 자동화"
      ],
      color: "#667eea",
      bgColor: "rgba(102, 126, 234, 0.1)",
      icon: <FontAwesomeIcon icon={faChartLine} />,
      link: "/funnel"
    }
  ];

  const stats = [
    {
      number: "10,000+",
      label: "발행된 콘텐츠",
      icon: <FontAwesomeIcon icon={faRocket} />
    },
    {
      number: "80%",
      label: "시간 단축",
      icon: <FontAwesomeIcon icon={faUsers} />
    },
    {
      number: "60%",
      label: "비용 절약",
      icon: <FontAwesomeIcon icon={faChartLine} />
    }
  ];

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">스토어 페이지 로딩중...</div>}>
    <StoreSection id="store">
      <Container>
        <SectionHeader
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >

       <SectionTag>Store</SectionTag>
          <h2>AI 도구 모음</h2>
          <Description>각 도구는 특정 비즈니스 요구사항에 최적화되어 있습니다. <br />
          필요에 따라 개별 도구를 선택하거나 전체 솔루션을 활용하세요.</Description>
        </SectionHeader>


        {/* Tools Section */}
        <ToolsSection
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <ToolsGrid>
            {tools.map((tool, index) => (
              <ToolCard 
                key={tool.id}
                $color={tool.color}
                $bgColor={tool.bgColor}
                as={motion.div}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
              >
                <ToolThumbnail>
                  <Image 
                    src={tool.image} 
                    alt={tool.title} 
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/tools/product1.png';
                    }}
                  />
                </ToolThumbnail>
                
                <ToolHeader>
                  <ToolIcon $color={tool.color}>
                    {tool.icon}
                  </ToolIcon>
                  <ToolSubtitle>{tool.subtitle}</ToolSubtitle>
                </ToolHeader>
                
                <ToolTitle>{tool.title}</ToolTitle>
                <ToolDescription>{tool.description}</ToolDescription>
                
                <ToolFeatures>
                  <FeatureTitle>주요 기능:</FeatureTitle>
                  <FeatureList>
                    {tool.features.map((feature, featureIndex) => (
                      <FeatureItem key={featureIndex}>
                        <FeatureIcon>✓</FeatureIcon>
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                </ToolFeatures>
                
                <ToolActions>
                  <ToolLink href={tool.link}>
                    자세히 보기
                    <FontAwesomeIcon icon={faArrowRight} />
                  </ToolLink>
                  <ToolButton 
                    $color={tool.color}
                    onClick={() => handleToolAction(tool.id)}
                  >
                    {tool.id === 'affiliate' ? '프로그램 다운받기' : '사전판매 해보기'}
                  </ToolButton>
                </ToolActions>
              </ToolCard>
            ))}
          </ToolsGrid>
        </ToolsSection>

       {/*  } {process.env.NODE_ENV === 'development' && (
          <>
            <SectionHeader
              as={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <SectionTag>Store</SectionTag>
              <h2>AI 에셋 스토어</h2>
              <Description>AI로 제작된 고퀄리티 디자인 에셋을 제공합니다</Description>
            </SectionHeader>
            <ProductGrid>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  as={motion.div}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: index * 0.2 }}
                >
                  <ProductImage onClick={() => handleDetailNavigation(product.id)}>
                    <Image 
                      src={product.image || '/images/store/product1.jpg'} 
                      alt={product.title || 'Product'} 
                      width={300}
                      height={200}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/store/product1.jpg';
                      }}
                    />
                  </ProductImage>
                  <ProductInfo>
                    <TagList>
                      {product.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </TagList>
                    <ProductTitle onClick={() => handleDetailNavigation(product.id)}>
                      {product.title}
                    </ProductTitle>
                  </ProductInfo>
                  <ProductFooter>
                    <PriceWrapper>
                      <OriginalPrice>{product.originalPrice?.toLocaleString() || 'N/A'}원</OriginalPrice>
                      <Price>{product.price.toLocaleString()}원</Price>
                    </PriceWrapper>
                    <PurchaseButton onClick={() => handlePurchase(product.id)}>
                      구매하기
                    </PurchaseButton>
                  </ProductFooter>
                </ProductCard>
              ))}
            </ProductGrid>
          </>
        )} */}





      </Container>
    </StoreSection>
    </Suspense>
  );
};

const StoreSection = styled.section`
  padding: 8rem 0;
  background-color: #fff;
`;

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const ProductImage = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    cursor: pointer;
  }
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.3rem 0.8rem;
  background: #f1f3f5;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #666;
`;

const ProductFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #514FE4;
`;

const PurchaseButton = styled.button`
  padding: 0.5rem 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4340c0;
  }
`;

const ViewAllButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 4rem;
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

    svg {
      transform: translateX(5px);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
`;

// Tools 섹션을 위한 스타일 컴포넌트들
const StatsSection = styled.section`
  padding: 4rem 0;
  margin-top: 8rem;
  background: #514FE4;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ToolsSection = styled.section`
  padding: 0rem 0;
  background: white;
  margin-bottom: 8rem;
`;

const ToolsHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ToolsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const ToolsDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ToolCard = styled.div<{ $color: string; $bgColor: string }>`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.$color}20;
  }
`;

const ToolThumbnail = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
`;

const ToolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ToolIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ToolSubtitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToolTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const ToolDescription = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ToolFeatures = styled.div`
  margin-bottom: 2rem;
`;

const FeatureTitle = styled.h4`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #4a5568;
`;

const FeatureIcon = styled.span`
  color: #10b981;
  margin-right: 0.75rem;
  font-weight: bold;
`;

const ToolActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToolLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #514FE4;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    gap: 0.75rem;
  }
`;

const ToolButton = styled.button<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.$color};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ComparisonSection = styled.section`
  padding: 5rem 0;
  background: #f8fafc;
`;

const ComparisonHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ComparisonTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const ComparisonDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const ComparisonCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ComparisonCardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const ComparisonCardDescription = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ComparisonFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const ComparisonFeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #4a5568;
`;

const ComparisonButton = styled(Link)<{ gradient?: boolean }>`
  display: inline-block;
  width: 100%;
  padding: 1rem 2rem;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  ${props => props.gradient 
    ? `
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      
      &:hover {
        opacity: 0.9;
        color: white;
      }
    `
    : `
      background: #514FE4;
      color: white;
      
      &:hover {
        background: #403bb3;
        color: white;
      }
    `
  }
`;

export default Store;
