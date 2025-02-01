import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSync,
  faCog,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useCoupangApi } from '../../contexts/CoupangApiContext';
import AffiliateSettingsPopup from './components/AffiliateSettingsPopup';
import { getTopKeywords } from './utils/keywordAnalyzer';

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

const StyledContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const AffiliSmart = () => {
  const navigate = useNavigate();
  const { apiKeys, updateApiKeys } = useCoupangApi();
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
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const timeRanges = [
    { value: '1d', label: '1일' },
    { value: '3d', label: '3일' },
    { value: '7d', label: '7일' },
    { value: '30d', label: '30일' },
    { value: '90d', label: '90일' },
  ];

  useEffect(() => {
    // 첫 로드 시 네이버 쇼핑을 기본값으로 설정
    setSelectedPlatform('naver');
    handlePlatformChange('naver');
  }, []);

  const formatNumber = (value) => {
    if (!value && value !== 0) return '0';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePlatformChange = async (platform) => {
    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await getTopKeywords(platform);
      setKeywordData({
        keywords: data?.keywords || initialKeywordData.keywords,
      });
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setKeywordData(initialKeywordData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTimeRangeChange = async (range) => {
    setTimeRange(range);
    setIsAnalyzing(true);
    try {
      const data = await getTopKeywords(selectedPlatform, range);
      setKeywordData({
        keywords: data?.keywords || [],
        relatedKeywords: data?.relatedKeywords || []
      });
    } catch (error) {
      setError('키워드 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeywordSelect = async (keyword) => {
    try {
      setIsLoadingProducts(true);
      setError(null);
      setSelectedKeyword(keyword);

      const response = await fetch(
        `http://localhost:9003/api/search/shop?query=${encodeURIComponent(keyword.keyword)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        setError('검색 결과가 없습니다.');
        setRelatedProducts([]);
        return;
      }

      const products = data.items.map(item => ({
        id: item.productId || Math.random().toString(36).substr(2, 9),
        title: item.title.replace(/<[^>]*>?/g, ''),
        price: parseInt(item.lprice),
        image: item.image,
        link: item.link,
        mallName: item.mallName,
        brand: item.brand || '',
        category: item.category1 || '',
        reviewCount: parseInt(item.reviewCount || '0'),
        rating: parseFloat(item.rating || '0')
      }));

      setRelatedProducts(products);

    } catch (error) {
      console.error('Error:', error);
      setError('상품 검색 중 오류가 발생했습니다: ' + error.message);
      setRelatedProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
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

  const handleSetupCoupang = () => {
    navigate('/mypage/api-settings');  // API 설정 페이지로 이동
  };

  return (
    <StyledContainer>
      <Navigation>
        <NavItem>
          <NavLink to="/toyprojects">
            <FontAwesomeIcon icon={faArrowLeft} /> 돌아가기
          </NavLink>
        </NavItem>
      </Navigation>
      <Container>
        <Title>AffiliSmart - AI 제휴마케팅 도우미</Title>
        
        <Section>
          <SectionTitle>
            <TrendIcon>📈</TrendIcon> 
            쇼핑 트렌드 분석
            <RefreshButton onClick={() => handlePlatformChange(selectedPlatform)}>
              <FontAwesomeIcon icon={faSync} /> 새로고침
            </RefreshButton>
          </SectionTitle>

          <PlatformSelector>
            <PlatformButton $active={selectedPlatform === 'naver'} onClick={() => setSelectedPlatform('naver')}>
              <FontAwesomeIcon icon={faSearch} /> 네이버 쇼핑
            </PlatformButton>
            <PlatformButton $active={selectedPlatform === 'youtube'} onClick={() => setSelectedPlatform('youtube')}>
              <FontAwesomeIcon icon={faYoutube} /> 유튜브 쇼핑
            </PlatformButton>
          </PlatformSelector>

          <TrendDescription>
            최근 7일간의 인기 검색어와 트렌드를 분석합니다.
            상위 10개의 키워드를 검색량과 함께 보여드립니다.
          </TrendDescription>

          {isAnalyzing ? (
            <LoadingWrapper>
              <LoadingSpinner />
              <LoadingText>트렌드 분석 중...</LoadingText>
            </LoadingWrapper>
          ) : error ? (
            <ErrorMessage>
              {error}
              <RetryButton onClick={() => handlePlatformChange('naver')}>
                다시 시도
              </RetryButton>
            </ErrorMessage>
          ) : (
            <KeywordTable>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>키워드</th>
                  <th>검색량</th>
                  <th>트렌드</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {keywordData.keywords.slice(0, 5).map((kw, index) => (
                  <TableRow 
                    key={index} 
                    selected={selectedKeyword === kw.keyword}
                  >
                    <td>
                      <RankBadge>
                        {index + 1}
                      </RankBadge>
                    </td>
                    <td>{kw.keyword}</td>
                    <td>{formatNumber(kw.searchVolume)}</td>
                    <td>
                      {kw.trend && kw.trend.length > 0 ? (
                        <TrendGraph data={kw.trend} />
                      ) : (
                        <div>데이터 없음</div>
                      )}
                    </td>
                    <td>
                      <ActionButton 
                        onClick={() => handleKeywordSelect(kw)}
                      >
                        <FontAwesomeIcon icon={faSearch} /> 상품 검색
                      </ActionButton>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </KeywordTable>
          )}
        </Section>

        {selectedKeyword && (
          <Section>
            <SectionTitle>
              "{selectedKeyword.keyword}" 관련 상품
            </SectionTitle>
            
            {isLoadingProducts ? (
              <LoadingWrapper>
                <LoadingSpinner />
                <LoadingText>상품을 검색하고 있습니다...</LoadingText>
              </LoadingWrapper>
            ) : relatedProducts.length > 0 ? (
              <ProductGrid>
                {relatedProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    selected={selectedProducts.includes(product)}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <ProductImage src={product.image} alt={product.title} />
                    <ProductInfo>
                      <ProductName>{product.title}</ProductName>
                      <ProductPrice>{formatNumber(product.price)}원</ProductPrice>
                      <ProductMall>{product.mallName}</ProductMall>
                    </ProductInfo>
                  </ProductCard>
                ))}
              </ProductGrid>
            ) : (
              <EmptyMessage>검색된 상품이 없습니다.</EmptyMessage>
            )}
          </Section>
        )}

        <Section>
          <SettingsBox>
            <SettingsHeader>
              <h3>제휴 플랫폼 설정</h3>
              <SettingsButton onClick={() => setShowSettingsPopup(true)}>
                <FontAwesomeIcon icon={faCog} /> 설정하기
              </SettingsButton>
            </SettingsHeader>
            <PlatformStatus>
              <StatusItem>
                <StatusIcon $connected={apiKeys.accessKey}>🛒</StatusIcon>
                <StatusText>쿠팡 파트너스: {apiKeys.accessKey ? '연동됨' : '미연동'}</StatusText>
              </StatusItem>
              {/* Add more platform status items */}
            </PlatformStatus>
          </SettingsBox>
        </Section>

        {showSettingsPopup && (
          <AffiliateSettingsPopup
            currentSettings={{
              coupang: {
                accessKey: apiKeys.accessKey,
                secretKey: apiKeys.secretKey
              }
            }}
            onSubmit={(settings) => {
              updateApiKeys(settings.coupang);
              setShowSettingsPopup(false);
            }}
            onClose={() => setShowSettingsPopup(false)}
          />
        )}

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
      </Container>
    </StyledContainer>
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.selected ? '#f3f0ff' : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  margin-top: 10px;
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  margin: 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  color: #514FE4;
  margin-top: 4px;
`;

const ProductMall = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
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
  background: ${props => props.$active ? '#514FE4' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#4340c0' : '#e9ecef'};
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

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PlatformCard = styled.div`
  background: white;
  border: 1px solid ${props => props.active ? '#514FE4' : '#eee'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  position: relative;
`;

const PlatformIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const PlatformName = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
`;

const PlatformStatus = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
`;

const SetupButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #4340c0;
  }
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff922b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const TrendIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #514FE4;
  cursor: pointer;
  margin-left: 12px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const TrendDescription = styled.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 40px;
`;

const LoadingText = styled.div`
  color: #514FE4;
  margin-top: 12px;
  font-weight: 500;
`;

const RankBadge = styled.span`
  background: ${props => props.children <= 3 ? '#514FE4' : '#e9ecef'};
  color: ${props => props.children <= 3 ? 'white' : '#666'};
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
`;

const TrendGraph = styled.div`
  width: 100px;
  height: 30px;
  background: ${props => {
    const trend = props.data || [];
    const lastValue = trend[trend.length - 1];
    const firstValue = trend[0];
    return lastValue > firstValue ? '#e8f5e9' : '#fff3f3';
  }};
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '${props => {
      const trend = props.data || [];
      const lastValue = trend[trend.length - 1];
      const firstValue = trend[0];
      return lastValue > firstValue ? '↑' : '↓';
    }}';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => {
      const trend = props.data || [];
      const lastValue = trend[trend.length - 1];
      const firstValue = trend[0];
      return lastValue > firstValue ? '#2e7d32' : '#c62828';
    }};
  }
`;

const ActionButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #4340c0;
  }
`;

const SettingsBox = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: #514FE4;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.$connected ? '#514FE4' : '#666'};
`;

const StatusText = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ShoppingIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 8px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const Navigation = styled.nav`
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #eee;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #514FE4;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default AffiliSmart;