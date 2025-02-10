import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 60px;
  height: 60px;
  background: #FF0000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);

    ${PlayButton} {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const Youtube = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const videos = [
    {
      id: 1,
      thumbnail: '/images/youtube/thumbnail1.jpg',
      title: 'AI 기술로 만드는 부동산 데이터 분석',
      views: '2.1만',
      date: '2024.01.15'
    },
    {
      id: 2,
      thumbnail: '/images/youtube/thumbnail2.jpg',
      title: '발달장애인을 위한 AI 교육 플랫폼',
      views: '1.8만',
      date: '2024.01.10'
    },
    {
      id: 3,
      thumbnail: '/images/youtube/thumbnail3.jpg',
      title: '제휴마케팅으로 월 100만원 수익 만들기',
      views: '3.2만',
      date: '2024.01.05'
    }
  ];

  return (
    <YoutubeSection id="youtube">
      <Container>
        <SectionHeader
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <SectionTag>YouTube</SectionTag>
          <h2>AI 트렌드와 인사이트</h2>
          <Description>최신 AI 기술과 산업 동향을 공유합니다</Description>
        </SectionHeader>

        <VideoGrid>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              as={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <ThumbnailWrapper>
                <Thumbnail src={video.thumbnail} alt={video.title} />
                <PlayButton>
                  <FontAwesomeIcon icon={faYoutube} />
                </PlayButton>
              </ThumbnailWrapper>
              <VideoInfo>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoMeta>
                  <span>조회수 {video.views}회</span>
                  <span>{video.date}</span>
                </VideoMeta>
              </VideoInfo>
            </VideoCard>
          ))}
        </VideoGrid>

        <SocialLinks>
          <SocialLink href="https://youtube.com/@growsome" target="_blank">
            <FontAwesomeIcon icon={faYoutube} />
            YouTube 채널 바로가기
            <FontAwesomeIcon icon={faArrowRight} className="arrow" />
          </SocialLink>
          <SocialLink href="https://instagram.com/growsome.ai" target="_blank" className="instagram">
            <FontAwesomeIcon icon={faInstagram} />
            Instagram 바로가기
            <FontAwesomeIcon icon={faArrowRight} className="arrow" />
          </SocialLink>
        </SocialLinks>
      </Container>
    </YoutubeSection>
  );
};

const YoutubeSection = styled.section`
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
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
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

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: #FF0000;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.instagram {
    background: #E1306C;
  }

  &:hover {
    transform: translateY(-2px);

    .arrow {
      transform: translateX(5px);
    }
  }

  .arrow {
    transition: transform 0.3s ease;
  }
`;

export default Youtube;
