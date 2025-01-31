import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
`;

const ProductList = styled.div`
  margin: 20px 0;
`;

const ProductItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StyledVideo = styled.video`
  width: 100%;
  max-width: 640px;
  margin: 20px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: #ddd;
  border-radius: 10px;
  margin: 20px 0;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${props => props.value}%;
  height: 100%;
  background: #4C6EF5;
  transition: width 0.3s ease;
`;

const StatusText = styled.div`
  color: #666;
  margin: 10px 0;
`;

const StyledButton = styled.button`
  background: #4C6EF5;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin: 20px 0;
  transition: background 0.3s ease;

  &:hover {
    background: #364FC7;
  }

  &:disabled {
    background: #868E96;
    cursor: not-allowed;
  }
`;

const VideoGenerator = ({ products = [] }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [outputVideo, setOutputVideo] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    workerPath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.worker.js'
  }));

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    try {
      setStatus('FFmpeg 초기화 중...');
      const ffmpeg = ffmpegRef.current;
      
      // CORS 설정
      const corsHeaders = new Headers();
      corsHeaders.append('Cross-Origin-Opener-Policy', 'same-origin');
      corsHeaders.append('Cross-Origin-Embedder-Policy', 'require-corp');

      // FFmpeg 코어 로드
      await ffmpeg.load({
        coreURL: await toBlobURL(
          'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
          'text/javascript',
          corsHeaders
        ),
        wasmURL: await toBlobURL(
          'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
          'application/wasm',
          corsHeaders
        ),
      });

      setFfmpegLoaded(true);
      setStatus('FFmpeg 준비 완료');
      console.log('FFmpeg 로드 성공');

      ffmpeg.on('progress', ({ ratio }) => {
        setProgress(Math.round(ratio * 100));
        setStatus(`처리 중... ${Math.round(ratio * 100)}%`);
      });
    } catch (error) {
      console.error('FFmpeg 로드 실패:', error);
      setStatus('FFmpeg 초기화 실패: ' + error.message);
    }
  };

  const generateVideo = async () => {
    if (!ffmpegLoaded) {
      alert('FFmpeg가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      setGenerating(true);
      setStatus('영상 생성 시작...');
      const ffmpeg = ffmpegRef.current;

      // 이미지 다운로드 및 처리
      for (let i = 0; i < products.length; i++) {
        setStatus(`상품 ${i + 1}/${products.length} 이미지 처리 중...`);
        
        try {
          const response = await fetch(products[i].thumbnail, {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`이미지 다운로드 실패: ${response.statusText}`);
          }

          const imageBlob = await response.blob();
          const arrayBuffer = await imageBlob.arrayBuffer();
          await ffmpeg.writeFile(`image${i}.jpg`, new Uint8Array(arrayBuffer));
          console.log(`이미지 ${i + 1} 처리 완료`);
        } catch (error) {
          console.error(`이미지 ${i + 1} 처리 실패:`, error);
          throw error;
        }
      }

      // 영상 생성
      setStatus('영상 생성 중...');
      const command = [
        '-framerate', '1/3',
        '-i', 'image%d.jpg',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        'output.mp4'
      ];

      await ffmpeg.exec(command);
      console.log('영상 생성 완료');

      // 생성된 영상 읽기
      const data = await ffmpeg.readFile('output.mp4');
      const videoBlob = new Blob([data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      
      setOutputVideo(videoUrl);
      setStatus('영상 생성 완료!');
    } catch (error) {
      console.error('영상 생성 오류:', error);
      setStatus('영상 생성 실패: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container>
      <h2>상품 홍보 영상 생성기</h2>
      
      <ProductList>
        {products.map((product, index) => (
          <ProductItem key={index}>
            <h3>{product.title}</h3>
            <p>가격: {product.price.toLocaleString()}원</p>
            <p>평점: {product.rating}점 ({product.reviewCount}개 리뷰)</p>
          </ProductItem>
        ))}
      </ProductList>

      <StatusText>
        {status.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </StatusText>

      <StyledButton 
        onClick={generateVideo}
        disabled={generating || !ffmpegLoaded}
      >
        {generating ? '영상 생성 중...' : '홍보 영상 만들기'}
      </StyledButton>

      {generating && (
        <ProgressBar>
          <Progress value={progress} />
        </ProgressBar>
      )}
      
      {outputVideo && (
        <div>
          <h3>생성된 영상</h3>
          <StyledVideo 
            src={outputVideo} 
            controls
            playsInline
          />
        </div>
      )}
    </Container>
  );
};

export default VideoGenerator;
