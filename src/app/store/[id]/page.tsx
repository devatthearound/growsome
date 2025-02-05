'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';

// Sample data, replace with actual data fetching logic
const products = [
  {
    id: 1,
    image: '/images/store/product1.jpg',
    title: '자연스러운 동정 결렉션',
    tags: ['Midjourney', '동정', '자연'],
    price: 25000,
    description: 'AI로 제작된 자연스러운 동정 컬렉션입니다.'
  },
  // Add other products here...
];

const ProductDetail = () => {
  const { id } = useParams(); // Use useParams to get the dynamic route parameter

  // Find the product by ID
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <DetailContainer>
      <ImageWrapper>
        <img src={product.image} alt={product.title} />
      </ImageWrapper>
      <InfoWrapper>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <Price>{product.price.toLocaleString()}원</Price>
        <TagList>
          {product.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
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