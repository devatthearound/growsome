import React from 'react';
import styled from 'styled-components';
import VideoTemplate from '../templates/VideoTemplate';

const Container = styled.div`
  margin: 20px 0;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SectionCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SectionThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  background: #f0f0f0;
  position: relative;
`;

const SectionInfo = styled.div`
  padding: 15px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const SectionDuration = styled.div`
  font-size: 14px;
  color: #666;
`;

const SectionPreview = ({ sections }) => {
  return (
    <Container>
      <h3>섹션별 미리보기</h3>
      <SectionGrid>
        {sections.map((section, index) => (
          <SectionCard key={index}>
            <SectionThumbnail>
              {section.type === 'product' && (
                <VideoTemplate 
                  product={section.product}
                  rank={sections.length - index}
                  showTransition={false}
                />
              )}
            </SectionThumbnail>
            <SectionInfo>
              <SectionTitle>{section.title}</SectionTitle>
              <SectionDuration>Duration: {section.duration}s</SectionDuration>
            </SectionInfo>
          </SectionCard>
        ))}
      </SectionGrid>
    </Container>
  );
};

export default SectionPreview;
