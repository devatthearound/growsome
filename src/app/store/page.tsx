'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

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
      description: 'AI로 제작된 귀여운 캐릭터 일러스트입니다.'
    },
    {
      id: 4,
      image: '/images/store/product4.jpg',
      title: '제품 상세페이지 템플릿',
      tags: ['디자인', '쇼핑몰', '템플릿'],
      price: '40,000'
    },
    {
      id: 5,
      image: '/images/store/product5.jpg',
      title: '프로덕트 목업 세트',
      tags: ['목업', '브랜딩', '3D'],
      price: '28,000'
    },
    {
      id: 6,
      image: '/images/store/product6.jpg',
      title: '추상 아트 컬렉션',
      tags: ['Midjourney', '추상', '예술'],
      price: '32,000'
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

  return (
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
                <img src={product.image} alt={product.title} />
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

        <ViewAllButton href="/store">
          전체 에셋 보기 <FontAwesomeIcon icon={faArrowRight} />
        </ViewAllButton>
      </Container>
    </StoreSection>
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

export default Store;
