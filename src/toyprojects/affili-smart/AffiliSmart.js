import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { testProducts } from './utils/testData';
import { getTopKeywords } from './utils/keywordAnalyzer';
import { crawlProducts } from './utils/productCrawler';
import { searchCoupangProducts, generateAffiliateLink } from './utils/coupangAPI';
import { useCoupangApi } from '../../contexts/CoupangApiContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faYoutube, 
  faChartLine, 
  faShoppingCart,
  faVideo
} from '@fortawesome/free-solid-svg-icons';

const initialKeywordData = {
  keywords: [
    { keyword: "게이밍PC", searchVolume: 15000, competition: 0.8, trend: [10, 15, 20, 25, 30] },
    { keyword: "RTX 4060", searchVolume: 12000, competition: 0.6, trend: [5, 10, 15, 20, 25] },
    { keyword: "고사양 게이밍PC", searchVolume: 10000, competition: 0.7, trend: [15, 20, 25, 30, 35] },
    { keyword: "20만원대 게이밍PC", searchVolume: 8000, competition: 0.4, trend: [8, 12, 16, 20, 24] },
    { keyword: "가성비 게이밍PC", searchVolume: 7500, competition: 0.5, trend: [12, 14, 16, 18, 20] }
  ]
};

const initialProducts = [
  { id: 1, name: "고성능 게이밍PC i7", price: 1500000, rating: 4.5 },
  { id: 2, name: "RTX 4060 게이밍 데스크탑", price: 1200000, rating: 4.3 },
  { id: 3, name: "조립 게이밍PC 풀패키지", price: 900000, rating: 4.7 },
  { id: 4, name: "고사양 게이밍 컴퓨터", price: 1800000, rating: 4.6 },
  { id: 5, name: "가성비 게이밍PC 세트", price: 800000, rating: 4.4 },
  { id: 6, name: "프리미엄 게이밍 데스크탑", price: 2000000, rating: 4.8 },
  { id: 7, name: "게이밍용 조립PC", price: 1100000, rating: 4.2 },
  { id: 8, name: "고성능 RTX PC", price: 1600000, rating: 4.5 },
  { id: 9, name: "게임용 컴퓨터 풀세트", price: 1300000, rating: 4.4 },
  { id: 10, name: "프로게이머용 PC", price: 2200000, rating: 4.9 }
];

const AffiliSmart = () => {
  const navigate = useNavigate();
  const { apiKeys } = useCoupangApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [generatedComment, setGeneratedComment] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('naver');
  const [timeRange, setTimeRange] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [step, setStep] = useState(1);
  const [keywordData, setKeywordData] = useState(initialKeywordData);
  const [relatedProducts, setRelatedProducts] = useState(initialProducts);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [coupangProducts, setCoupangProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [keywordMetrics, setKeywordMetrics] = useState({
    searchVolume: 0,
    competition: 0,
    trend: [],
    relatedKeywords: []
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const timeRanges = [
    { value: '1d', label: '1일' },
    { value: '3d', label: '3일' },
    { value: '7d', label: '7일' },
    { value: '30d', label: '30일' },
    { value: '90d', label: '90일' },
    { value: '12m', label: '12개월' }
  ];

  useEffect(() => {
    handlePlatformChange(selectedPlatform);
  }, []);

  useEffect(() => {
    if (!apiKeys.accessKey || !apiKeys.secretKey || !apiKeys.subId) {
      setError('쿠팡 API 설정이 필요합니다.');
    } else {
      setError(null);
    }
  }, [apiKeys]);

  const formatNumber = (value) => {
    if (!value && value !== 0) return '0';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePlatformChange = async (platform) => {
    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    try {
      const data = await getTopKeywords(platform, timeRange);
      setKeywordData({
        keywords: data?.keywords || [],
        relatedKeywords: data?.relatedKeywords || []
      });
    } catch (error) {
      setError('키워드 분석 중 오류가 발생했습니다.');
      setKeywordData({ keywords: [], relatedKeywords: [] });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setStep(2);
  };

  const handleKeywordSelect = (keyword) => {
    if (!keyword) return;
    setSelectedKeyword(keyword);
    setStep(3);
    setSelectedProducts([]);
  };

  const handleProductSelect = (productId) => {
    if (!productId) return;
    
    setSelectedProducts(prev => {
      const product = relatedProducts.find(p => p.id === productId);
      if (!product) return prev;

      const isSelected = prev.some(p => p.id === productId);
      if (isSelected) {
        return prev.filter(p => p.id !== productId);
      } else {
        return [...prev, product];
      }
    });
  };

  const getProductRank = (productId) => {
    if (!productId) return null;
    const index = selectedProducts.findIndex(p => p.id === productId);
    return index > -1 ? index + 1 : null;
  };

  const generateComment = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      return '';
    }

    const title = `가성비 게이밍 PC TOP ${products.length}`;
    const disclaimer = '이 포스팅은 쿠팡파트너스 활동의 일환으로, 일정액의 수수료를 제공받습니다.';
    
    const productComments = products.map((product) => {
      if (!product) return '';
      
      const rank = products.length - products.indexOf(product);
      const stars = '★'.repeat(Math.floor(product.rating || 0)) + 
                   '☆'.repeat(5 - Math.floor(product.rating || 0));
      
      return `${rank}위: ${product.title || product.name || '상품명 없음'}
가격: ${formatNumber(product.price)}원
평점: ${stars} (${formatNumber(product.reviewCount || 0)}개 상품평)
특징: ${(product.features || []).map(feature => `- ${feature}`).join('\n') || '정보 없음'}
구매링크: ${product.affiliateLink || '#'}`;
    }).filter(Boolean).join('\n\n');

    const footer = '이 리스트로 게이밍 PC 구매 시 후회 없는 선택을 해보세요!';

    return `${title}\n\n${disclaimer}\n\n${productComments}\n\n${footer}`;
  };

  const handleVideoGeneration = async () => {
    if (selectedProducts.length === 0) {
      setError('최소 1개 이상의 상품을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // 임시 영상 생성 로직 (테스트용)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 테스트용 샘플 비디오 URL (실제 존재하는 비디오 URL로 교체)
      const mockVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      setVideoUrl(mockVideoUrl);
      
      // 댓글 생성
      const comment = generateComment(selectedProducts.reverse()); // 순위 역순으로 정렬
      setGeneratedComment(comment);
      
    } catch (err) {
      console.error('Video generation error:', err);
      setError('영상 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 임시 비디오 미리보기 컴포넌트
  const VideoPreviewMock = () => {
    const selectedProductDetails = selectedProducts
      .map(id => relatedProducts.find(p => p?.id === id))
      .filter(Boolean);

    return (
      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>선택된 상품 목록</h3>
        {selectedProductDetails.map((product, index) => {
          if (!product) return null;
          
          return (
            <div key={product.id || index} style={{
              background: 'white',
              margin: '10px',
              padding: '10px',
              borderRadius: '4px'
            }}>
              <strong>{index + 1}순위:</strong> {product.name || '상품명 없음'}
              <br />
              가격: {formatNumber(product?.price) || '0'}원
              <br />
              평점: {product?.rating || 0}점 ({product?.reviewCount || 0}개 리뷰)
            </div>
          );
        })}
      </div>
    );
  };

  // 임시 더미 데이터 추가
  useEffect(() => {
    const dummyKeywords = [
      { keyword: "게이밍PC", searchVolume: 15000, competition: 0.8, trend: [10, 15, 20, 25, 30] },
      { keyword: "RTX 4060", searchVolume: 12000, competition: 0.6, trend: [5, 10, 15, 20, 25] },
      { keyword: "고사양 게이밍PC", searchVolume: 10000, competition: 0.7, trend: [15, 20, 25, 30, 35] },
      { keyword: "20만원대 게이밍PC", searchVolume: 8000, competition: 0.4, trend: [20, 25, 30, 35, 40] },
      { keyword: "가성비 게이밍PC", searchVolume: 13000, competition: 0.5, trend: [25, 30, 35, 40, 45] },
    ];

    // 상위 5개 상품만 표시
    const dummyProducts = [
      {
        productId: 1,
        title: "고성능 게이밍PC 조립컴퓨터 RTX4060",
        price: 1599000,
        originalPrice: 1799000,
        imageUrl: "https://via.placeholder.com/200",
        rating: 4.8,
        reviewCount: 2457,
        isRocket: true
      },
      {
        productId: 2,
        title: "RTX 4060 게이밍PC 본체",
        price: 1299000,
        originalPrice: 1499000,
        imageUrl: "https://via.placeholder.com/200",
        rating: 4.7,
        reviewCount: 1234,
        isRocket: true
      },
      {
        productId: 3,
        title: "가성비 게이밍PC 조립컴퓨터",
        price: 899000,
        originalPrice: 999000,
        imageUrl: "https://via.placeholder.com/200",
        rating: 4.5,
        reviewCount: 890,
        isRocket: true
      },
      {
        productId: 4,
        title: "20만원대 게이밍PC 조립컴퓨터",
        price: 299000,
        originalPrice: 399000,
        imageUrl: "https://via.placeholder.com/200",
        rating: 4.3,
        reviewCount: 567,
        isRocket: false
      },
      {
        productId: 5,
        title: "고사양 게이밍PC 풀패키지",
        price: 2199000,
        originalPrice: 2499000,
        imageUrl: "https://via.placeholder.com/200",
        rating: 4.9,
        reviewCount: 345,
        isRocket: true
      }
    ];

    setKeywordData({
      keywords: dummyKeywords,
      relatedKeywords: dummyKeywords.map(k => ({ keyword: k.keyword, score: Math.random() }))
    });
    setCoupangProducts(dummyProducts);
  }, []);

  // handleSetup 함수 추가
  const handleSetup = () => {
    // 설정 관련 로직 구현
    console.log('Setup clicked');
  };

  const handleApiSettingsClick = () => {
    navigate('/mypage/api-settings');
  };

  return (
    <Container>
      <Section>
        <Title>AffiliSmart - 쿠팡 파트너스 영상 생성기</Title>
        
        <ApiErrorMessage>
          쿠팡 API 설정이 필요합니다.
          <ApiSettingsButton onClick={handleApiSettingsClick}>
            API 설정하러 가기
          </ApiSettingsButton>
        </ApiErrorMessage>

        <Section>
          <SectionTitle>쿠팡 파트너스 API 키 입력</SectionTitle>
          <ApiKeyInputContainer>
            <InputGroup>
              <label>Access Key:</label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Access Key를 입력하세요"
              />
            </InputGroup>
            <InputGroup>
              <label>Secret Key:</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Secret Key를 입력하세요"
              />
            </InputGroup>
          </ApiKeyInputContainer>
        </Section>

        {error && (
          <ErrorMessage>
            <p>{error}</p>
            <RetryButton onClick={handleVideoGeneration}>
              다시 시도하기
            </RetryButton>
          </ErrorMessage>
        )}

        <Section>
          <SectionTitle>0. 트렌드 키워드 분석</SectionTitle>
          
          <PlatformSelector>
            <PlatformButton 
              active={selectedPlatform === 'naver'}
              onClick={() => setSelectedPlatform('naver')}
            >
              <FontAwesomeIcon icon={faSearch} />
              네이버 검색량
            </PlatformButton>
            <PlatformButton 
              active={selectedPlatform === 'youtube'}
              onClick={() => setSelectedPlatform('youtube')}
            >
              <FontAwesomeIcon icon={faVideo} />
              유튜브 트렌드
            </PlatformButton>
          </PlatformSelector>

          <TimeRangeSelector>
            {['7일', '30일', '90일', '12개월'].map(range => (
              <TimeButton 
                key={range}
                active={timeRange === range}
                onClick={() => handleTimeRangeChange(range)}
              >
                {range}
              </TimeButton>
            ))}
          </TimeRangeSelector>

          {step >= 2 && keywordData?.keywords && (
            <KeywordTable>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>키워드</th>
                  <th>검색량</th>
                  <th>경쟁강도</th>
                  <th>트렌드</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {keywordData.keywords.map((kw, index) => (
                  <TableRow 
                    key={index} 
                    selected={selectedKeyword === kw.keyword}
                  >
                    <td>{index + 1}</td>
                    <td>{kw?.keyword || 'N/A'}</td>
                    <td>{formatNumber(kw?.searchVolume)}</td>
                    <td><CompetitionBar value={kw?.competition || 0} /></td>
                    <td><TrendIndicator trend={kw?.trend || []} /></td>
                    <td>
                      <SelectButton 
                        selected={selectedKeyword === kw?.keyword}
                        onClick={() => handleKeywordSelect(kw?.keyword)}
                      >
                        {selectedKeyword === kw?.keyword ? '선택됨' : '선택'}
                      </SelectButton>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </KeywordTable>
          )}

          {step >= 3 && relatedProducts && (
            <RelatedProducts>
              <SubTitle>
                연관 상품 선택 
                <SelectedCount>
                  (선택된 상품: {selectedProducts.length}개)
                </SelectedCount>
              </SubTitle>
              <ProductGrid>
                {relatedProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    selected={selectedProducts.some(p => p.id === product.id)}
                  >
                    {getProductRank(product.id) && (
                      <ProductRank>
                        {getProductRank(product.id)}순위
                      </ProductRank>
                    )}
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>
                        {formatNumber(product.price)}원
                      </ProductPrice>
                      <ProductRating>★ {product.rating}</ProductRating>
                    </ProductInfo>
                    <SelectButton 
                      selected={selectedProducts.some(p => p.id === product.id)}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      {selectedProducts.some(p => p.id === product.id) ? 
                        `${getProductRank(product.id)}순위` : '선택'}
                    </SelectButton>
                  </ProductCard>
                ))}
              </ProductGrid>

              {selectedProducts.length > 0 && (
                <SelectedProductsSummary>
                  <h3>선택된 상품 순서</h3>
                  {selectedProducts.map((product, index) => (
                    <ProductSummaryItem key={product.id}>
                      <span>{index + 1}순위:</span> {product.name}
                      <ProductPrice>{formatNumber(product.price)}원</ProductPrice>
                    </ProductSummaryItem>
                  ))}
                </SelectedProductsSummary>
              )}
            </RelatedProducts>
          )}
        </Section>

        {isLoading ? (
          <LoadingMessage>
            <LoadingSpinner />
            <div>
              {selectedProducts.length}개 상품의 홍보 영상을 생성하고 있습니다...
              <br />
              <small>잠시만 기다려주세요...</small>
            </div>
          </LoadingMessage>
        ) : (
          <GenerateButton 
            onClick={handleVideoGeneration}
            disabled={selectedProducts.length === 0}
          >
            {selectedProducts.length > 0 
              ? `${selectedProducts.length}개 상품으로 영상 생성하기` 
              : '상품을 선택해주세요'}
          </GenerateButton>
        )}

        {videoUrl && (
          <>
            <VideoPreview>
              <video 
                src={videoUrl} 
                controls 
                width="100%"
                style={{ borderRadius: '8px', marginTop: '20px' }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </VideoPreview>

            <CommentSection>
              <h3>📝 생성된 댓글</h3>
              <CommentBox>
                <pre>{generatedComment}</pre>
                <CopyButton onClick={() => {
                  navigator.clipboard.writeText(generatedComment);
                  alert('댓글이 클립보드에 복사되었습니다!');
                }}>
                  복사하기
                </CopyButton>
              </CommentBox>
            </CommentSection>
          </>
        )}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.div`
  position: relative;
  border: 1px solid ${props => props.selected ? '#514FE4' : '#eee'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${props => props.selected ? '#f8f9ff' : 'white'};
  transition: all 0.2s;

  &:hover {
    border-color: #514FE4;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  margin: 0;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  color: #514FE4;
`;

const ProductRating = styled.div`
  color: #fab005;
`;

const ErrorMessage = styled.div`
  background: #fff3f3;
  color: #e03131;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RetryButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;

  &:hover {
    background: #4340c0;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #514FE4;
  font-weight: bold;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #514FE4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GenerateButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  margin: 20px 0;

  &:hover {
    background: #4340c0;
  }
`;

const VideoPreview = styled.div`
  margin-top: 20px;
  
  video {
    width: 100%;
    border-radius: 8px;
  }
`;

const SelectionOrder = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: ${props => props.children ? '#514FE4' : 'transparent'};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const SelectedProductsList = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
`;

const SelectedProductItem = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: move;
`;

const OrderNumber = styled.div`
  width: 24px;
  height: 24px;
  background: #514FE4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-left: auto;
  padding: 4px 8px;

  &:hover {
    color: #e03131;
  }
`;

const SelectedProductsSummary = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;

  h3 {
    margin-bottom: 16px;
    color: #333;
  }
`;

const ProductSummaryItem = styled.div`
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: bold;
    color: #514FE4;
  }
`;

const CommentSection = styled.div`
  margin-top: 30px;
  
  h3 {
    margin-bottom: 16px;
    color: #333;
  }
`;

const CommentBox = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
    line-height: 1.6;
    margin: 0;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #514FE4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #4340c0;
  }
`;

const KeywordTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 600;
    color: #666;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }
`;

const TableRow = styled.tr`
  background: ${props => props.selected ? '#f0f0ff' : 'white'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? '#f0f0ff' : '#f8f9fa'};
  }
`;

const CompetitionBar = styled.div`
  width: 100px;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.value * 100}%;
    background: ${props => {
      if (props.value < 0.3) return '#40c057';
      if (props.value < 0.7) return '#fab005';
      return '#fa5252';
    }};
    border-radius: 2px;
  }
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;

  ${props => props.trend?.map((value, i, arr) => {
    const increase = i > 0 ? value > arr[i-1] : false;
    return `
      &::before {
        content: '';
        width: 4px;
        height: ${value}px;
        background: ${increase ? '#40c057' : '#fa5252'};
        border-radius: 2px;
      }
    `;
  })}
`;

const SelectButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.selected ? '#514FE4' : '#e9ecef'};
  color: ${props => props.selected ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? '#4340c0' : '#dee2e6'};
  }
`;

const SelectedCount = styled.span`
  font-size: 1rem;
  color: #666;
  margin-left: 10px;
`;

const PlatformSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const PlatformButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#514FE4' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#4340c0' : '#e9ecef'};
  }

  svg {
    font-size: 18px;
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TimeButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? '#514FE4' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  min-width: 70px;

  &:hover {
    background: ${props => props.active ? '#4340c0' : '#e9ecef'};
  }
`;

const RelatedProducts = styled.div`
  margin-top: 40px;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const ProductRank = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #514FE4;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  display: ${props => props.children ? 'block' : 'none'};
`;

const ApiKeyInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: bold;
    color: #495057;
  }

  input {
    padding: 10px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #514FE4;
    }
  }
`;

const ApiErrorMessage = styled.div`
  background-color: #fff5f5;
  border: 1px solid #ffe3e3;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e03131;
`;

const ApiSettingsButton = styled.button`
  background-color: #514FE4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #4340c0;
  }
`;

export default AffiliSmart;