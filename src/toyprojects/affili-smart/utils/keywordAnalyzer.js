import axios from 'axios';

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;

export const getTopKeywords = async (category = '게이밍PC') => {
  try {
    // 네이버 데이터 (임시 테스트 데이터)
    const naverKeywords = [
      { keyword: '가성비 게이밍컴퓨터', score: 850 },
      { keyword: 'RTX 4060 게이밍PC', score: 720 },
      { keyword: '고사양 게이밍PC 추천', score: 650 },
      { keyword: '20만원대 게이밍PC', score: 450 },
      { keyword: '조립 게이밍PC 추천', score: 380 }
    ];

    // 유튜브 데이터 (임시 테스트 데이터)
    const youtubeKeywords = [
      { keyword: '가성비 게이밍PC 추천', videoCount: 1200, avgViews: 45000 },
      { keyword: 'RTX 4060 게이밍컴퓨터', videoCount: 850, avgViews: 38000 },
      { keyword: '백만원대 게이밍PC', videoCount: 920, avgViews: 32000 },
      { keyword: '게이밍PC 조립 가이드', videoCount: 750, avgViews: 28000 },
      { keyword: '고사양 게이밍PC 리뷰', videoCount: 680, avgViews: 25000 }
    ];

    // 데이터 결합 및 점수 계산
    const combinedKeywords = combineKeywordData(naverKeywords, youtubeKeywords);

    // 관련 영상 데이터
    const relatedVideos = [
      {
        title: '200만원으로 살 수 있는 최강의 게이밍PC 추천!',
        viewCount: '123,456',
        channelTitle: '컴퓨터 전문가',
        thumbnail: 'https://example.com/thumbnail1.jpg',
        tags: ['게이밍PC', 'RTX4060', '조립컴퓨터']
      },
      {
        title: '가성비 게이밍PC 추천 2024 최신버전',
        viewCount: '98,765',
        channelTitle: 'PC 리뷰채널',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        tags: ['가성비PC', '게이밍컴퓨터', '추천']
      }
    ];

    return {
      keywords: combinedKeywords,
      relatedVideos: relatedVideos
    };

  } catch (error) {
    console.error('키워드 분석 오류:', error);
    return {
      keywords: [],
      relatedVideos: []
    };
  }
};

const combineKeywordData = (naverData, youtubeData) => {
  const keywordMap = new Map();

  // 네이버 데이터 처리
  naverData.forEach(item => {
    keywordMap.set(item.keyword, {
      keyword: item.keyword,
      naverScore: item.score,
      youtubeViews: 0,
      videoCount: 0,
      totalScore: item.score
    });
  });

  // 유튜브 데이터 처리
  youtubeData.forEach(item => {
    const existing = keywordMap.get(item.keyword) || {
      keyword: item.keyword,
      naverScore: 0,
      youtubeViews: 0,
      videoCount: 0,
      totalScore: 0
    };

    existing.youtubeViews = item.avgViews;
    existing.videoCount = item.videoCount;
    // 유튜브 점수를 네이버 점수 스케일로 정규화
    existing.totalScore = existing.naverScore + (item.avgViews / 100);
    
    keywordMap.set(item.keyword, existing);
  });

  // 결합된 데이터를 배열로 변환하고 정렬
  return Array.from(keywordMap.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
    .map(item => ({
      ...item,
      score: Math.round(item.totalScore)
    }));
};

// 나중에 실제 API 연동 시 사용할 유틸리티 함수들
const getDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    startDate: formatDate(thirtyDaysAgo),
    endDate: formatDate(today)
  };
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};
