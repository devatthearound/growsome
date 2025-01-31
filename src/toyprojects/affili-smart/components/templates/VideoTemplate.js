import React from 'react';
import styled from 'styled-components';
import RankAnimation from '../animations/RankAnimation';
import ProductLayout from './ProductLayout';
import TransitionEffects from '../transitions/TransitionEffects';
import TextOverlay from '../overlays/TextOverlay';

const TemplateContainer = styled.div`
  width: 1080px;
  height: 1920px;
  position: relative;
  background: #000;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  transform: scale(1.1);
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.7)
  );
`;

const RankDisplay = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  font-size: 120px;
  font-weight: bold;
  color: #FFD700;
  opacity: 0;
  animation: fadeInScale 1s forwards;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ProductInfo = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50px;
  right: 50px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
`;

const ProductTitle = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
  animation: slideInLeft 1s forwards;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ProductPrice = styled.div`
  font-size: 36px;
  color: #FFD700;
  margin-bottom: 15px;
`;

const ProductRating = styled.div`
  font-size: 32px;
  margin-bottom: 15px;
`;

const ProductFeatures = styled.ul`
  font-size: 28px;
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #FFD700;
    }
  }
`;

const VideoTemplate = ({ product, rank, showTransition }) => {
  return (
    <TemplateContainer>
      <BackgroundImage image={product.thumbnail} />
      <ContentOverlay>
        <RankAnimation rank={rank} />
        <TextOverlay product={product} rank={rank} />
        <ProductLayout product={product} />
        {showTransition && <TransitionEffects type="fade" duration="2s" />}
      </ContentOverlay>
    </TemplateContainer>
  );
};

export default VideoTemplate;
