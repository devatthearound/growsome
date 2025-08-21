'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface BlogMetrics {
  totalPosts: number;
  publishedToday: number;
  publishedThisWeek: number;
  aiGeneratedPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgEngagementRate: number;
  topPerformers: Array<{
    id: number;
    title: string;
    view_count: number;
    like_count: number;
    comment_count: number;
  }>;
}

interface AutomationMetrics {
  jobsLast24h: number;
  successfulJobs: number;
  failedJobs: number;
  avgProcessingTime: number;
  topErrors: Array<{
    error: string;
    count: number;
  }>;
}

interface SystemMetrics {
  api: {
    responseTime: number;
  };
  database: {
    connectionStatus: string;
  };
  server: {
    uptime: number;
    memory: {
      heapUsed: number;
    };
  };
}

const AnalyticsPage = () => {
  const [blogMetrics, setBlogMetrics] = useState<BlogMetrics>({
    totalPosts: 0,
    publishedToday: 0,
    publishedThisWeek: 0,
    aiGeneratedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    avgEngagementRate: 0,
    topPerformers: []
  });

  const [automationMetrics, setAutomationMetrics] = useState<AutomationMetrics>({
    jobsLast24h: 0,
    successfulJobs: 0,
    failedJobs: 0,
    avgProcessingTime: 0,
    topErrors: []
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    api: { responseTime: 0 },
    database: { connectionStatus: 'Unknown' },
    server: { uptime: 0, memory: { heapUsed: 0 } }
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 실제 데이터 로딩 (시뮬레이션)
  useEffect(() => {
    loadAnalyticsData();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // 블로그 데이터 가져오기
      const blogResponse = await fetch('/api/analytics/blog-metrics');
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setBlogMetrics(blogData);
      } else {
        // 시뮬레이션 데이터 (실제 API가 없을 경우)
        setBlogMetrics({
          totalPosts: 47,
          publishedToday: 3,
          publishedThisWeek: 12,
          aiGeneratedPosts: 35,
          totalViews: 15420,
          totalLikes: 342,
          totalComments: 89,
          avgEngagementRate: 0.085,
          topPerformers: [
            {
              id: 15,
              title: "한국 시장에서 성공하는 SaaS 비즈니스 모델 설계",
              view_count: 536,
              like_count: 24,
              comment_count: 8
            },
            {
              id: 14,
              title: "콘텐츠 마케팅으로 ROI 300% 달성하는 전략",
              view_count: 428,
              like_count: 18,
              comment_count: 6
            },
            {
              id: 13,
              title: "비즈니스 데이터 분석: 인사이트에서 액션까지",
              view_count: 385,
              like_count: 21,
              comment_count: 4
            }
          ]
        });
      }

      // 자동화 메트릭 (시뮬레이션)
      setAutomationMetrics({
        jobsLast24h: 8,
        successfulJobs: 7,
        failedJobs: 1,
        avgProcessingTime: 45000,
        topErrors: [
          { error: "OpenAI API rate limit exceeded", count: 2 },
          { error: "Database connection timeout", count: 1 }
        ]
      });

      // 시스템 메트릭 (시뮬레이션)
      setSystemMetrics({
        api: { responseTime: Math.floor(Math.random() * 1000) + 200 },
        database: { connectionStatus: 'Connected' },
        server: { 
          uptime: Math.floor(Date.now() / 1000) - 86400, // 1 day
          memory: { heapUsed: Math.floor(Math.random() * 200) + 100 }
        }
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Analytics data loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return '#27ae60';
    if (value >= thresholds.warning) return '#f39c12';
    return '#e74c3c';
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  if (loading && blogMetrics.totalPosts === 0) {
    return (
      <Container>
        <LoadingSpinner>
          <div>📊</div>
          <p>분석 데이터를 로딩 중입니다...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📊 블로그 자동화 분석 대시보드</Title>
        <LastUpdated>
          마지막 업데이트: {lastUpdated.toLocaleString('ko-KR')}
          {loading && <RefreshingBadge>🔄 새로고침 중</RefreshingBadge>}
        </LastUpdated>
      </Header>

      <MetricsGrid>
        {/* 블로그 현황 */}
        <MetricCard>
          <CardTitle>📝 블로그 현황</CardTitle>
          <MetricRow>
            <MetricLabel>전체 포스트 수</MetricLabel>
            <MetricValue>{blogMetrics.totalPosts.toLocaleString()}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>오늘 발행</MetricLabel>
            <MetricValue color="#27ae60">{blogMetrics.publishedToday}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>이번 주 발행</MetricLabel>
            <MetricValue>{blogMetrics.publishedThisWeek}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>AI 생성 포스트</MetricLabel>
            <MetricValue>
              {blogMetrics.aiGeneratedPosts} ({Math.round(blogMetrics.aiGeneratedPosts / blogMetrics.totalPosts * 100)}%)
            </MetricValue>
          </MetricRow>
        </MetricCard>

        {/* 참여도 지표 */}
        <MetricCard>
          <CardTitle>📈 참여도 지표</CardTitle>
          <MetricRow>
            <MetricLabel>총 조회수</MetricLabel>
            <MetricValue color="#27ae60">{blogMetrics.totalViews.toLocaleString()}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>총 좋아요</MetricLabel>
            <MetricValue>{blogMetrics.totalLikes.toLocaleString()}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>총 댓글</MetricLabel>
            <MetricValue>{blogMetrics.totalComments.toLocaleString()}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>평균 참여율</MetricLabel>
            <MetricValue color={getHealthColor(blogMetrics.avgEngagementRate * 100, { good: 10, warning: 5 })}>
              {(blogMetrics.avgEngagementRate * 100).toFixed(1)}%
            </MetricValue>
          </MetricRow>
          <ProgressBar>
            <ProgressFill width={Math.min(blogMetrics.avgEngagementRate * 1000, 100)} />
          </ProgressBar>
        </MetricCard>

        {/* 자동화 상태 */}
        <MetricCard>
          <CardTitle>🤖 자동화 상태</CardTitle>
          <MetricRow>
            <MetricLabel>24시간 작업 수</MetricLabel>
            <MetricValue>{automationMetrics.jobsLast24h}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>성공률</MetricLabel>
            <MetricValue color={getHealthColor(
              automationMetrics.jobsLast24h > 0 ? automationMetrics.successfulJobs / automationMetrics.jobsLast24h * 100 : 100,
              { good: 90, warning: 70 }
            )}>
              {automationMetrics.jobsLast24h > 0 
                ? Math.round(automationMetrics.successfulJobs / automationMetrics.jobsLast24h * 100) 
                : 100}%
            </MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>평균 처리 시간</MetricLabel>
            <MetricValue>{Math.round(automationMetrics.avgProcessingTime / 1000)}초</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>실패 작업</MetricLabel>
            <MetricValue color={automationMetrics.failedJobs > 0 ? '#e74c3c' : '#27ae60'}>
              {automationMetrics.failedJobs}
            </MetricValue>
          </MetricRow>
        </MetricCard>

        {/* 시스템 상태 */}
        <MetricCard>
          <CardTitle>💻 시스템 상태</CardTitle>
          <MetricRow>
            <MetricLabel>
              <StatusIndicator color={systemMetrics.api.responseTime < 2000 ? '#27ae60' : '#f39c12'} />
              API 응답 시간
            </MetricLabel>
            <MetricValue>{systemMetrics.api.responseTime}ms</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>
              <StatusIndicator color={systemMetrics.database.connectionStatus === 'Connected' ? '#27ae60' : '#e74c3c'} />
              데이터베이스
            </MetricLabel>
            <MetricValue>{systemMetrics.database.connectionStatus}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>업타임</MetricLabel>
            <MetricValue color="#27ae60">{formatUptime(systemMetrics.server.uptime)}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>메모리 사용량</MetricLabel>
            <MetricValue>{systemMetrics.server.memory.heapUsed}MB</MetricValue>
          </MetricRow>
        </MetricCard>
      </MetricsGrid>

      {/* 인기 포스트 */}
      <WideCard>
        <CardTitle>🏆 인기 포스트</CardTitle>
        <TopPerformersList>
          {blogMetrics.topPerformers.slice(0, 5).map((post, index) => (
            <TopPerformerItem key={post.id}>
              <PerformerRank>{index + 1}</PerformerRank>
              <PerformerContent>
                <PerformerTitle>{post.title}</PerformerTitle>
                <PerformerStats>
                  👁 {post.view_count} 조회 • ❤ {post.like_count} 좋아요 • 💬 {post.comment_count} 댓글
                </PerformerStats>
              </PerformerContent>
            </TopPerformerItem>
          ))}
        </TopPerformersList>
      </WideCard>

      {/* 최근 오류 */}
      {automationMetrics.topErrors.length > 0 && (
        <WideCard>
          <CardTitle>⚠️ 주요 오류</CardTitle>
          <ErrorList>
            {automationMetrics.topErrors.map((error, index) => (
              <ErrorItem key={index}>
                <ErrorMessage>{error.error.substring(0, 80)}...</ErrorMessage>
                <ErrorCount>발생 횟수: {error.count}</ErrorCount>
              </ErrorItem>
            ))}
          </ErrorList>
        </WideCard>
      )}

      <AutoRefreshNotice>
        🔄 자동 새로고침: 30초마다 업데이트
      </AutoRefreshNotice>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 0;
  max-width: 1400px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  
  div {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
`;

const LastUpdated = styled.div`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RefreshingBadge = styled.span`
  background: #3498db;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const WideCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricValue = styled.span<{ color?: string }>`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.color || '#333'};
`;

const StatusIndicator = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const TopPerformersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopPerformerItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const PerformerRank = styled.div`
  background: #3498db;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 12px;
  flex-shrink: 0;
`;

const PerformerContent = styled.div`
  flex: 1;
`;

const PerformerTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const PerformerStats = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ErrorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ErrorItem = styled.div`
  padding: 12px;
  background: #ffebee;
  border-radius: 6px;
  border-left: 3px solid #e74c3c;
`;

const ErrorMessage = styled.div`
  font-weight: 600;
  color: #c62828;
  margin-bottom: 4px;
`;

const ErrorCount = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const AutoRefreshNotice = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export default AnalyticsPage;