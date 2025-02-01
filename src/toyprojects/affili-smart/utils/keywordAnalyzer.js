import axios from 'axios';

// 네이버 API 키 설정
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;

export const getTopKeywords = async (platform, timeRange = '7d') => {
  // 임시로 더미 데이터 반환
  return {
    keywords: [
      { keyword: "게이밍PC", searchVolume: 15000, competition: 0.8, trend: [10, 15, 20, 25, 30] },
      { keyword: "RTX 4060", searchVolume: 12000, competition: 0.6, trend: [5, 10, 15, 20, 25] },
      { keyword: "고사양 게이밍PC", searchVolume: 10000, competition: 0.7, trend: [15, 20, 25, 30, 35] },
      { keyword: "20만원대 게이밍PC", searchVolume: 8000, competition: 0.4, trend: [8, 12, 16, 20, 24] },
      { keyword: "가성비 게이밍PC", searchVolume: 7500, competition: 0.5, trend: [12, 14, 16, 18, 20] }
    ]
  };
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
