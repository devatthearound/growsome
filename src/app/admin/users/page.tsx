'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface User {
  id: number;
  email: string;
  username: string;
  status: string;
  createdAt: string;
  companyName?: string;
  position?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시 사용자 데이터 (실제로는 API에서 가져와야 함)
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'bbuzaddaa@gmail.com',
        username: 'Growsome Admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        companyName: 'Growsome',
        position: 'Administrator'
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>👥 사용자 관리</h1>
        </Header>
        <LoadingText>사용자 목록을 불러오는 중...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>👥 사용자 관리</h1>
        <StatusInfo>총 {users.length}명의 사용자</StatusInfo>
      </Header>

      <UsersTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>사용자명</th>
            <th>회사</th>
            <th>직책</th>
            <th>상태</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.companyName || '-'}</td>
              <td>{user.position || '-'}</td>
              <td>
                <StatusBadge status={user.status}>
                  {user.status === 'active' ? '활성' : '비활성'}
                </StatusBadge>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
            </tr>
          ))}
        </tbody>
      </UsersTable>

      <InfoCard>
        <h3>📋 사용자 관리 기능</h3>
        <p>현재는 기본적인 사용자 목록 조회 기능을 제공합니다.</p>
        <p>추후 다음 기능들이 추가될 예정입니다:</p>
        <ul>
          <li>사용자 상세 정보 보기</li>
          <li>사용자 상태 변경 (활성/비활성)</li>
          <li>사용자 권한 관리</li>
          <li>사용자 활동 로그</li>
        </ul>
      </InfoCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
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

const StatusInfo = styled.div`
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #666;
  font-size: 0.9rem;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.status === 'active' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.status === 'active' ? '#155724' : '#721c24'};
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  p {
    margin: 0 0 0.5rem 0;
    color: #666;
    line-height: 1.5;
  }
  
  ul {
    margin: 0.5rem 0 0 1rem;
    color: #666;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

export default UsersPage;
