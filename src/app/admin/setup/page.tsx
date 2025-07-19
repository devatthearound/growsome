'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface DatabaseStatus {
  success: boolean;
  tables: string[];
  counts: {
    categories: number;
    posts: number;
  };
}

const SetupPage = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/setup');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('데이터베이스 상태 확인 실패:', error);
      setStatus({
        success: false,
        tables: [],
        counts: { categories: 0, posts: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    if (!confirm('데이터베이스를 초기화하시겠습니까? 필요한 테이블과 기본 데이터가 생성됩니다.')) {
      return;
    }

    try {
      setInitializing(true);
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('데이터베이스가 성공적으로 초기화되었습니다!');
        checkDatabaseStatus(); // 상태 재확인
      } else {
        alert('데이터베이스 초기화 실패: ' + data.error);
      }
    } catch (error) {
      console.error('데이터베이스 초기화 중 에러:', error);
      alert('데이터베이스 초기화 중 오류가 발생했습니다.');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>🔧 데이터베이스 설정</h1>
        <Link href="/admin/blog">
          <BackButton>← 블로그 관리로 돌아가기</BackButton>
        </Link>
      </Header>

      <StatusCard>
        <h2>📊 데이터베이스 상태</h2>
        
        {loading ? (
          <LoadingText>상태 확인 중...</LoadingText>
        ) : (
          <>
            <StatusItem>
              <StatusLabel>연결 상태:</StatusLabel>
              <StatusValue success={status?.success}>
                {status?.success ? '✅ 연결됨' : '❌ 연결 실패'}
              </StatusValue>
            </StatusItem>

            <StatusItem>
              <StatusLabel>테이블:</StatusLabel>
              <StatusValue success={status?.tables.length ? status.tables.length > 0 : false}>
                {status?.tables.length || 0}개 
                {status?.tables.length ? `(${status.tables.join(', ')})` : ''}
              </StatusValue>
            </StatusItem>

            <StatusItem>
              <StatusLabel>카테고리 수:</StatusLabel>
              <StatusValue success={true}>
                {status?.counts.categories || 0}개
              </StatusValue>
            </StatusItem>

            <StatusItem>
              <StatusLabel>포스트 수:</StatusLabel>
              <StatusValue success={true}>
                {status?.counts.posts || 0}개
              </StatusValue>
            </StatusItem>
          </>
        )}
      </StatusCard>

      <ActionCard>
        <h2>⚙️ 관리 작업</h2>
        
        <ActionItem>
          <ActionDescription>
            <h3>데이터베이스 초기화</h3>
            <p>
              블로그 운영에 필요한 테이블들을 생성하고 기본 카테고리를 추가합니다.
              <br />
              <strong>포함 사항:</strong> post_categories, posts, post_comments, post_likes 테이블
            </p>
          </ActionDescription>
          <InitButton 
            onClick={initializeDatabase} 
            disabled={initializing}
          >
            {initializing ? '초기화 중...' : '🚀 데이터베이스 초기화'}
          </InitButton>
        </ActionItem>

        <ActionItem>
          <ActionDescription>
            <h3>상태 새로고침</h3>
            <p>현재 데이터베이스 상태를 다시 확인합니다.</p>
          </ActionDescription>
          <RefreshButton 
            onClick={checkDatabaseStatus} 
            disabled={loading}
          >
            {loading ? '확인 중...' : '🔄 상태 새로고침'}
          </RefreshButton>
        </ActionItem>
      </ActionCard>

      <InfoCard>
        <h2>📝 사용 방법</h2>
        <ol>
          <li>먼저 <strong>"데이터베이스 초기화"</strong>를 클릭하여 필요한 테이블을 생성하세요.</li>
          <li>초기화가 완료되면 블로그 관리 페이지에서 카테고리와 포스트를 관리할 수 있습니다.</li>
          <li>문제가 발생하면 "상태 새로고침"으로 현재 상태를 확인하세요.</li>
        </ol>
      </InfoCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #333;
  }
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: #5a6268;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h2 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

const StatusCard = styled(Card)``;
const ActionCard = styled(Card)``;
const InfoCard = styled(Card)``;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatusLabel = styled.span`
  font-weight: 500;
  color: #555;
`;

const StatusValue = styled.span<{ success: boolean }>`
  color: ${props => props.success ? '#28a745' : '#dc3545'};
  font-weight: 500;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 1rem;
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActionDescription = styled.div`
  flex: 1;
  margin-right: 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InitButton = styled(Button)`
  background: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const RefreshButton = styled(Button)`
  background: #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

export default SetupPage;
