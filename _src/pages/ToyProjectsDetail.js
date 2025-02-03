import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CouponBanner from '../components/common/CouponBanner'; // 쿠폰 배너 임포트

const ToyProjectsDetail = () => {
  const { id } = useParams();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // 프로젝트 데이터 (실제로는 API나 데이터베이스에서 가져올 것)
  const projectData = {
    'coupang-auto': {
      title: '쿠팡파트너스 자동화',
      description: '쿠팡 파트너스 상품을 자동으로 검색하고 포스팅할 수 있는 서비스입니다.',
      mainImage: '/images/projects/coupang-auto.jpg',
      overview: '이 서비스는 불편함을 해소하기 위해 개발되었습니다. 자동화된 시스템으로 더 많은 시간을 절약하세요.',
      benefits: [
        '시간 절약: 자동화된 프로세스로 수작업을 줄입니다.',
        '정확성: 데이터 수집 및 포스팅의 정확성을 높입니다.',
        '편리함: 사용자가 쉽게 접근할 수 있는 인터페이스를 제공합니다.'
      ],
      currentStage: 'Beta', // 현재 개발 런칭 단계
      pricing: {
        stage: 'Beta',
        price: '$20/month',
        description: '정식 출시 후 가격입니다.'
      },
      couponInfo: {
        message: '쿠폰이 있는 경우,무료로 사용해보실 수 있습니다.쿠폰 코드를 입력하세요!',
        expiration: '2023년 12월 31일까지 유효합니다.'
      },
      callToAction: '지금 바로 사용해보세요! 가격은 오를 예정입니다.',
      testimonials: [
        { name: '홍길동', feedback: '이 서비스 덕분에 시간을 많이 절약했습니다!' },
        { name: '김철수', feedback: '정확한 데이터 수집이 가능해져서 정말 만족합니다.' },
        { name: '이영희', feedback: '사용하기 매우 편리하고 유용합니다!' },
        { name: '박지민', feedback: '이 서비스 덕분에 업무 효율이 높아졌습니다.' },
        { name: '최민수', feedback: '정말 추천합니다! 사용해보세요.' }
      ]
    },
    // 다른 프로젝트 데이터도 추가
  };

  const project = projectData[id];

  if (!project) {
    return <div>Project not found</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 슬라이더에서 3개씩 보여줌
    slidesToScroll: 1,
    autoplay: true, // 자동 재생
    autoplaySpeed: 2000, // 2초마다 슬라이드 변경
  };

  return (
    <ProjectDetailPage>
      <Hero
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <HeroContent>
          <ProjectTitle>{project.title}</ProjectTitle>
          <ProjectDescription>{project.description}</ProjectDescription>
          <UseButton inverted>지금 사용하기</UseButton>
        </HeroContent>
      </Hero>

      <MainImage>
        <img src={project.mainImage} alt={project.title} />
      </MainImage>

      <CouponBanner 
        message="쿠폰이 있는 경우, 무료로 사용해보실 수 있습니다. 쿠폰 코드를 입력하세요!" 
        expiration="2023년 12월 31일까지 유효합니다." 
      />

      <ContentSection>
        <SectionTitle>서비스 개요</SectionTitle>
        <SectionText>{project.overview}</SectionText>

        <SectionTitle>주요 혜택</SectionTitle>
        <BenefitsList>
          {project.benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <FontAwesomeIcon icon={faRocket} />
              <BenefitText>{benefit}</BenefitText>
            </BenefitItem>
          ))}
        </BenefitsList>

        <SectionTitle>현재 개발 단계</SectionTitle>
        <CurrentStage>
          <Stage>{project.currentStage}</Stage>
          <Price>{project.pricing.price}</Price>
          <Description>{project.pricing.description}</Description>
        </CurrentStage>

        <SectionTitle>고객 후기</SectionTitle>
        <TestimonialsList>
          <Slider {...settings}>
            {project.testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <TestimonialFeedback>
                  <Stars>⭐⭐⭐⭐⭐</Stars>
                  {testimonial.feedback}
                </TestimonialFeedback>
                <TestimonialName>{testimonial.name}</TestimonialName>
              </TestimonialCard>
            ))}
          </Slider>
        </TestimonialsList>

        <CallToAction>{project.callToAction}</CallToAction>
        <UseButton>지금 사용하기</UseButton>
      </ContentSection>
    </ProjectDetailPage>
  );
};

const ProjectDetailPage = styled.div`
  background: #f8f9fa;
`;

const Hero = styled.div`
  background: #514FE4;
  color: white;
  padding: 120px 0 60px;
`;

const HeroContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ProjectTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  width: 100%;
  height: 600px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentSection = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 3rem 0 1.5rem;
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 2rem;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #444;

  svg {
    margin-right: 0.5rem;
    color: #514FE4;
  }
`;

const BenefitText = styled.span`
  font-size: 1.1rem;
`;

const CurrentStage = styled.div`
  margin: 2rem 0;
`;

const Stage = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Price = styled.p`
  font-size: 1.2rem;
  color: #514FE4;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const TestimonialsList = styled.div`
  margin-bottom: 2rem;
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const TestimonialName = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const TestimonialFeedback = styled.p`
  font-size: 0.9rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
`;

const Stars = styled.span`
  display: block;
  margin-top: 5px;
`;

const CallToAction = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff5722;
  margin-top: 2rem;
`;

const UseButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${(props) => (props.inverted ? 'white' : '#514FE4')};
  color: ${(props) => (props.inverted ? '#514FE4' : 'white')};
  border: 2px solid #514FE4;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  margin-top: 2rem;

  &:hover {
    background: ${(props) => (props.inverted ? '#514FE4' : '#4340c0')};
    color: white;
  }
`;

export default ToyProjectsDetail; 