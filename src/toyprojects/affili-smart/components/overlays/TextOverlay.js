import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  padding: 20px;
  z-index: 10;
`;

const RankText = styled.div`
  font-size: 72px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: ${fadeUp} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const PriceInfo = styled.div`
  font-size: 48px;
  color: white;
  margin: 10px 0;
  animation: ${fadeUp} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const RatingStars = styled.div`
  font-size: 36px;
  color: #FFD700;
  margin: 10px 0;
  animation: ${fadeUp} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const FeaturePoint = styled.div`
  font-size: 32px;
  color: white;
  margin: 8px 0;
  padding-left: 20px;
  position: relative;
  animation: ${fadeUp} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #FFD700;
  }
`;

const TextOverlay = ({ product, rank }) => {
  const renderRating = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <Container>
      <RankText delay="0.2s">TOP {rank}</RankText>
      <PriceInfo delay="0.4s">
        {product.price.toLocaleString()}원
      </PriceInfo>
      <RatingStars delay="0.6s">
        {renderRating(product.rating)}
        <span style={{ fontSize: '24px', color: 'white' }}>
          ({product.reviewCount}개 상품평)
        </span>
      </RatingStars>
      {product.features.map((feature, index) => (
        <FeaturePoint 
          key={index}
          delay={`${0.8 + (index * 0.2)}s`}
        >
          {feature}
        </FeaturePoint>
      ))}
    </Container>
  );
};

export default TextOverlay;
