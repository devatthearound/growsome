import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
  animation: ${slideIn} 0.8s ease-out forwards;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Price = styled.div`
  font-size: 42px;
  color: #FFD700;
  margin-bottom: 15px;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

const ratingAnimation = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 32px;
  
  span {
    display: inline-block;
    animation: ${ratingAnimation} 0.5s ease-out forwards;
    animation-delay: ${props => props.index * 0.1}s;
    transform-origin: center;
    color: #FFD700;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
`;

const Feature = styled.li`
  font-size: 28px;
  margin-bottom: 10px;
  padding-left: 24px;
  position: relative;

  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #FFD700;
  }
`;

const ProductLayout = ({ product }) => {
  const renderRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
        {index < Math.floor(rating) ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <Container>
      <Title>{product.title}</Title>
      <Price>{product.price.toLocaleString()}원</Price>
      <Rating>
        {renderRating(product.rating)}
        <span style={{ marginLeft: '10px', color: '#ffffff' }}>
          ({product.reviewCount}개 상품평)
        </span>
      </Rating>
      <FeatureList>
        {product.features.map((feature, index) => (
          <Feature key={index}>{feature}</Feature>
        ))}
      </FeatureList>
    </Container>
  );
};

export default ProductLayout;
