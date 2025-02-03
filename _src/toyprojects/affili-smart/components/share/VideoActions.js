import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${props => props.primary ? '#007bff' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#007bff'};
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.primary ? '#0056b3' : '#e6f2ff'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ShareOptions = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  gap: 10px;
  margin-top: 15px;
`;

const ShareButton = styled(Button)`
  background: ${props => props.platform === 'facebook' ? '#1877f2' : 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'kakao' ? '#fee500' : '#fff'};
  border-color: ${props => props.platform === 'facebook' ? '#1877f2' : 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'kakao' ? '#fee500' : '#ddd'};
  color: ${props => props.platform === 'kakao' ? '#000' : '#fff'};
`;

const VideoActions = ({ videoUrl, onSave }) => {
  const [showShare, setShowShare] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promotional_video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error saving video:', error);
      alert('영상 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async (platform) => {
    const shareData = {
      title: '상품 홍보 영상',
      text: '자동 생성된 상품 홍보 영상입니다.',
      url: videoUrl
    };

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`);
          break;
        case 'kakao':
          // Kakao SDK 필요
          if (window.Kakao) {
            window.Kakao.Link.sendDefault({
              objectType: 'video',
              content: {
                title: '상품 홍보 영상',
                description: '자동 생성된 상품 홍보 영상입니다.',
                imageUrl: 'thumbnail_url',
                link: {
                  mobileWebUrl: videoUrl,
                  webUrl: videoUrl
                }
              }
            });
          }
          break;
        default:
          if (navigator.share) {
            await navigator.share(shareData);
          }
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      alert('공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <ActionButtons>
        <Button 
          primary 
          onClick={handleSave}
          disabled={saving || !videoUrl}
        >
          <i className="fas fa-download" />
          {saving ? '저장 중...' : '영상 저장하기'}
        </Button>
        <Button 
          onClick={() => setShowShare(!showShare)}
          disabled={!videoUrl}
        >
          <i className="fas fa-share-alt" />
          공유하기
        </Button>
      </ActionButtons>

      <ShareOptions show={showShare}>
        <ShareButton 
          platform="facebook" 
          onClick={() => handleShare('facebook')}
        >
          <i className="fab fa-facebook" />
          Facebook
        </ShareButton>
        <ShareButton 
          platform="twitter" 
          onClick={() => handleShare('twitter')}
        >
          <i className="fab fa-twitter" />
          Twitter
        </ShareButton>
        <ShareButton 
          platform="kakao" 
          onClick={() => handleShare('kakao')}
        >
          <i className="fas fa-comment" />
          Kakao
        </ShareButton>
      </ShareOptions>
    </Container>
  );
};

export default VideoActions;
