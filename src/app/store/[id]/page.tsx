'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getProductData } from '@/app/store/[id]/getProductData';
import Image from 'next/image';

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

  const handleDetailNavigation = (productId: number) => {
    router.push(`/store/${productId}`);
  };

  return (
    <DetailContainer>
      <ImageWrapper>
        <Image 
          src={product.image} 
          alt={product.title}
          width={500}
          height={300}
        />
      </ImageWrapper>
      <InfoWrapper>
        <h1>{product.title || 'No Title'}</h1>
        <p>{product.description || 'No Description'}</p>
        <Price>{product.price ? `${product.price.toLocaleString()}원` : 'Price not available'}</Price>
        <TagList>
          {product.tags?.map((tag: string, index: number) => (
            <Tag key={index}>{tag}</Tag>
          )) || <Tag>No Tags</Tag>}
        </TagList>
      </InfoWrapper>
    </DetailContainer>
  );
};

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

const InfoWrapper = styled.div`
  max-width: 600px;
  margin-top: 2rem;
  text-align: center;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #514FE4;
  margin: 1rem 0;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.3rem 0.8rem;
  background: #f1f3f5;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #666;
`;

export default ProductDetail;