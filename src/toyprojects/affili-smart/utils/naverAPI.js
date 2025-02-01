import CryptoJS from 'crypto-js';

const NAVER_API_URL = 'https://openapi.naver.com/v1/datalab/search';

// 인기 쇼핑 카테고리 키워드 그룹
const SHOPPING_CATEGORIES = [
  {
    groupName: "전자제품",
    keywords: ["노트북", "태블릿", "스마트폰", "이어폰", "스마트워치", "게이밍노트북", "블루투스이어폰"]
  },
  {
    groupName: "가전제품",
    keywords: ["공기청정기", "청소기", "냉장고", "세탁기", "TV", "에어컨", "건조기"]
  },
  {
    groupName: "패션의류",
    keywords: ["니트", "패딩", "원피스", "청바지", "운동화", "슬리퍼", "후드티"]
  },
  {
    groupName: "뷰티",
    keywords: ["립스틱", "선크림", "마스카라", "스킨케어", "향수", "파운데이션", "아이크림"]
  },
  {
    groupName: "식품",
    keywords: ["과일", "커피", "건강식품", "다이어트식품", "간식", "견과류", "프로틴"]
  },
  {
    groupName: "생활용품",
    keywords: ["샴푸", "치약", "세제", "화장지", "물티슈", "섬유유연제"]
  },
  {
    groupName: "주방용품",
    keywords: ["프라이팬", "전기밥솥", "에어프라이어", "전자레인지", "식기세척기"]
  }
];

export const getKeywordStats = async (keyword, startDate, endDate) => {
  try {
    const response = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        timeUnit: 'date',
        keywordGroups: [
          {
            groupName: keyword,
            keywords: [keyword]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('네이버 API 요청 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Naver API Error:', error);
    throw error;
  }
};

export const getYoutubeTopKeywords = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&type=video` +
      `&order=viewCount` +
      `&q=쇼핑+하울+리뷰` +
      `&regionCode=KR` +
      `&maxResults=10` +
      `&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('유튜브 API 요청 실패');
    }

    const data = await response.json();
    console.log('유튜브 API 응답:', data);

    // 비디오 상세 정보 가져오기 (조회수 등)
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=statistics` +
      `&id=${videoIds}` +
      `&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );

    const statsData = await statsResponse.json();

    // 데이터 변환
    const keywords = data.items.map((item, index) => {
      const stats = statsData.items[index]?.statistics || {};
      return {
        keyword: item.snippet.title,
        searchVolume: parseInt(stats.viewCount || 0),
        trend: [parseInt(stats.likeCount || 0)], // 좋아요 수를 트렌드로 사용
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle
      };
    });

    return {
      keywords: keywords
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, 5) // 상위 5개만 반환
    };

  } catch (error) {
    console.error('Error fetching YouTube trends:', error);
    return {
      keywords: []
    };
  }
};

// AffiliSmart.js에서 플랫폼 변경 시 호출할 함수
export const getTopKeywords = async (platform) => {
  if (platform === 'youtube') {
    return getYoutubeTopKeywords();
  } else {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // 네이버 데이터랩 API 호출
      const response = await fetch('https://openapi.naver.com/v1/datalab/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          timeUnit: 'date',
          keywordGroups: SHOPPING_CATEGORIES.map(category => ({
            groupName: category.groupName,
            keywords: category.keywords
          }))
        })
      });

      if (!response.ok) {
        throw new Error('네이버 API 요청 실패');
      }

      const data = await response.json();
      console.log('네이버 API 응답:', data);

      // 데이터 변환
      const keywords = data.results.map(result => ({
        keyword: result.title,
        searchVolume: Math.round(result.data[result.data.length - 1].ratio * 10000),
        trend: result.data.map(item => item.ratio)
      }));

      return {
        keywords: keywords
          .sort((a, b) => b.searchVolume - a.searchVolume)
          .slice(0, 10)
      };

    } catch (error) {
      console.error('Error fetching shopping trends:', error);
      return {
        keywords: []
      };
    }
  }
};

export const getRelatedKeywords = async (keyword) => {
  try {
    const response = await fetch(`https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(keyword)}`, {
      headers: {
        'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
      }
    });

    if (!response.ok) {
      throw new Error('네이버 API 요청 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Naver API Error:', error);
    throw error;
  }
}; 