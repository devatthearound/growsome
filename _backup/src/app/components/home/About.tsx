import styled from 'styled-components';
import { motion } from 'framer-motion';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      number: '5000+',
      label: '활성 유저',
      subLabel: '자체 서비스 운영'
    },
    {
      number: '10억+',
      label: '자금 유치',
      subLabel: '투자와 정부지원 유치 경험'
    },
    {
      number: '10+',
      label: '런칭 서비스',
      subLabel: '매칭부터 데이터까지 사업화 경험'
    }
  ];

  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <SectionTag>About Us</SectionTag>
          <h2>
            혁신적인 AI 솔루션으로<br />
            비즈니스의 미래를 그립니다
          </h2>
        </SectionHeader>

        <AboutContent
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Description>
            단순히 멋지고 예쁘게가 아닌, 고객가치에 집중하는 파트너입니다.<br />
            자체 서비스 운영과 성공적인 프로젝트 경험을 통해<br />
            실질적인 비즈니스 성과를 만들어내는 솔루션을 제공합니다.
          </Description>
        </AboutContent>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              as={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Number>{stat.number}</Number>
              <Label>{stat.label}</Label>
              <SubLabel>{stat.subLabel}</SubLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </Container>
    </AboutSection>
  );
};

const AboutSection = styled.section`
  padding: 8rem 0;
  background: white;
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
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 2rem;
      br {
        display: none;
      }
    }
  }
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

const AboutContent = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #666;

  @media (max-width: 768px) {
    font-size: 1rem;
    br {
      display: none;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Number = styled.span`
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SubLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #666;
`;

export default About;
