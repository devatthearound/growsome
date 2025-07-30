'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getProductData } from '@/app/store/[id]/getProductData';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    // URL에서 id 파라미터 추출
    const pathSegments = window.location.pathname.split('/');
    const productId = pathSegments[pathSegments.length - 1];
    setId(productId);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProductData(id);
        setProduct(data);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>로딩 중...</div>;

  const handleBack = () => {
    router.push('/store');
  };

  const handlePurchase = () => {
    router.push('/payment');
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return price;
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          뒤로가기
        </BackButton>
      </Header>
      
      <DetailContainer>
        <ImageSection>
          <ImageWrapper>
            <Image 
              src={product.image} 
              alt={product.title}
              width={600}
              height={400}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/store/product1.jpg';
              }}
            />
          </ImageWrapper>
        </ImageSection>
        
        <InfoSection>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductDescription>{product.description}</ProductDescription>
          
          <TagList>
            {product.tags?.map((tag: string, index: number) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagList>
          
          <PriceSection>
            {product.originalPrice && (
              <OriginalPrice>{formatPrice(product.originalPrice)}원</OriginalPrice>
            )}
            <Price>{formatPrice(product.price)}원</Price>
          </PriceSection>
          
          <ActionButtons>
            <PurchaseButton onClick={handlePurchase}>
              <FontAwesomeIcon icon={faShoppingCart} />
              구매하기
            </PurchaseButton>
            <WishlistButton>
              <FontAwesomeIcon icon={faHeart} />
              찜하기
            </WishlistButton>
          </ActionButtons>
        </InfoSection>
      </DetailContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Header = styled.div`
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #514FE4;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.5rem 1rem;
  background: #514FE4;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #a0aec0;
  text-decoration: line-through;
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #514FE4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PurchaseButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #514FE4;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #403bb3;
  }
`;

const WishlistButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  color: #514FE4;
  border: 2px solid #514FE4;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #514FE4;
    color: white;
  }
`;

export default ProductDetail;