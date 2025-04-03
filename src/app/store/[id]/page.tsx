'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getProductData } from '@/app/store/[id]/getProductData';

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const router = useRouter();
  const data = await getProductData(id);

  if (!data) {
    return <p>Product not found</p>;
  }

  const handleDetailNavigation = (productId: number) => {
    router.push(`/store/${productId}`);
  };

  return (
    <DetailContainer>
      <ImageWrapper>
        <img src={data.image || '/default-image.jpg'} alt={data.title || 'Product'} />
      </ImageWrapper>
      <InfoWrapper>
        <h1>{data.title || 'No Title'}</h1>
        <p>{data.description || 'No Description'}</p>
        <Price>{data.price ? `${data.price.toLocaleString()}원` : 'Price not available'}</Price>
        <TagList>
          {data.tags?.map((tag: string, index: number) => (
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