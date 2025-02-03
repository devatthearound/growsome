import React, { useState } from 'react';
import styled from 'styled-components';
import VideoTemplate from '../templates/VideoTemplate';

const PreviewContainer = styled.div`
  margin: 20px 0;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PreviewTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const PreviewControls = styled.div`
  display: flex;
  gap: 10px;
`;

const PreviewButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#007bff' : '#fff'};
  color: ${props => props.active ? '#fff' : '#007bff'};
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: #fff;
  }
`;

const PreviewWindow = styled.div`
  width: 100%;
  aspect-ratio: 9/16;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const SectionSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const SectionThumbnail = styled.div`
  width: 120px;
  aspect-ratio: 9/16;
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const VideoPreview = ({ products }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [previewMode, setPreviewMode] = useState('template'); // 'template' or 'video'

  const sections = [
    { type: 'intro', title: '인트로' },
    ...products.map((product, index) => ({
      type: 'product',
      title: `${products.length - index}위`,
      product
    })),
    { type: 'outro', title: '아웃트로' }
  ];

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>영상 미리보기</PreviewTitle>
        <PreviewControls>
          <PreviewButton 
            active={previewMode === 'template'}
            onClick={() => setPreviewMode('template')}
          >
            템플릿 보기
          </PreviewButton>
          <PreviewButton
            active={previewMode === 'video'}
            onClick={() => setPreviewMode('video')}
          >
            영상 보기
          </PreviewButton>
        </PreviewControls>
      </PreviewHeader>

      <PreviewWindow>
        {previewMode === 'template' ? (
          <VideoTemplate 
            product={sections[currentSection].product}
            rank={products.length - currentSection + 1}
            showTransition={false}
          />
        ) : (
          <video 
            controls
            style={{ width: '100%', height: '100%' }}
            src={sections[currentSection].videoUrl}
          />
        )}
      </PreviewWindow>

      <SectionSelector>
        {sections.map((section, index) => (
          <SectionThumbnail
            key={index}
            active={currentSection === index}
            onClick={() => setCurrentSection(index)}
          >
            <div style={{ padding: '8px', textAlign: 'center' }}>
              {section.title}
            </div>
          </SectionThumbnail>
        ))}
      </SectionSelector>
    </PreviewContainer>
  );
};

export default VideoPreview;
