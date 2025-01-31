import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock } from '@fortawesome/free-solid-svg-icons';

const VideoModal = ({ video, isOpen, onClose, hasPurchased }) => {
  if (!isOpen) return null;

  const canWatch = video.isFree || hasPurchased;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        
        <VideoContainer>
          {canWatch ? (
            <VimeoWrapper>
              <iframe
                src={`https://player.vimeo.com/video/${video.vimeoId}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </VimeoWrapper>
          ) : (
            <LockedContent>
              <FontAwesomeIcon icon={faLock} size="2x" />
              <h3>구매가 필요한 콘텐츠입니다</h3>
              <p>전체 강의를 구매하시면 모든 콘텐츠를 이용하실 수 있습니다.</p>
            </LockedContent>
          )}
        </VideoContainer>
        
        <VideoInfo>
          <h2>{video.title}</h2>
          <p>재생 시간: {video.duration}</p>
        </VideoInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 1000px;
  border-radius: 12px;
  position: relative;
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  z-index: 1;
`;

const VideoContainer = styled.div`
  margin-bottom: 20px;
`;

const VimeoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const LockedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  color: #666;

  h3 {
    margin: 1rem 0 0.5rem;
    color: #333;
  }
`;

const VideoInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
  }
`;

export default VideoModal; 