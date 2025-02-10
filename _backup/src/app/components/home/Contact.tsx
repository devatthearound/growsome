import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ContactSection id="contact">
      <Container>
        <SectionHeader
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <SectionTag>Contact</SectionTag>
          <h2>프로젝트 문의</h2>
        </SectionHeader>

        <ContactContent
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContactInfo>
            <KakaoItem>
              <FontAwesomeIcon icon={faComment} />
              <KakaoButton 
                href="https://pf.kakao.com/_Lpaln/chat" 
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡 채널 상담하기
              </KakaoButton>
            </KakaoItem>
          </ContactInfo>

          <ContactDetails>
            <DetailItem>
              <DetailLabel>이메일</DetailLabel>
              <DetailValue>
                <a href="mailto:master@growsome.kr">master@growsome.kr</a>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>전화</DetailLabel>
              <DetailValue>
                <a href="tel:010-7554-2397">010-7554-2397</a>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>주소</DetailLabel>
              <DetailValue>
                서울특별시 영등포구 영등포로19길 15, 3층 301-14호
              </DetailValue>
            </DetailItem>
          </ContactDetails>
        </ContactContent>
      </Container>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  padding: 8rem 0;
  background: #f8f9fa;
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

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ContactInfo = styled.div`
  margin-bottom: 4rem;
`;

const KakaoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  svg {
    font-size: 2rem;
    color: #3B1E1E;
  }
`;

const KakaoButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 1.2rem 2.5rem;
  background: #FEE500;
  color: #3B1E1E;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const ContactDetails = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const DetailLabel = styled.span`
  min-width: 100px;
  font-weight: 600;
  color: #333;
`;

const DetailValue = styled.span`
  color: #666;
  
  a {
    color: #514FE4;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #4340c0;
    }
  }
`;

export default Contact;
