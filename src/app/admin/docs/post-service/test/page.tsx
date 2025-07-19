'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  getCategories,
  getPosts,
  getPostById
} from '../../../../../services/postService';

const TestPage = () => {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState({
    postId: '1',
    tag: 'react',
    page: '1',
    limit: '10',
    categoryId: '1'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const logResult = (title: string, data: any) => {
    setResults(prev => 
      `${prev}\n\n=== ${title} ===\n${JSON.stringify(data, null, 2)}`
    );
  };

  const handleTest = async (fn: () => Promise<any>, title: string) => {
    try {
      setLoading(true);
      const result = await fn();
      logResult(title, result);
    } catch (error) {
      logResult(title, `에러 발생: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCases = [
    {
      title: '카테고리 목록 조회',
      fn: () => getCategories(),
      inputs: []
    },
    {
      title: '포스트 목록 조회',
      fn: () => getPosts({
        page: Number(inputs.page),
        limit: Number(inputs.limit),
        categoryId: inputs.categoryId || undefined,
        tag: inputs.tag || undefined
      }),
      inputs: ['page', 'limit', 'categoryId', 'tag']
    },
    {
      title: '포스트 상세 조회',
      fn: () => getPostById(inputs.postId),
      inputs: ['postId']
    }
  ];

  const clearResults = () => {
    setResults('');
  };

  return (
    <Container>
      <Header>
        <h1>PostService 테스트 페이지</h1>
        <BackLink href="/admin/docs/post-service">← 문서로 돌아가기</BackLink>
      </Header>

      <TestSection>
        <InputsContainer>

        <InputGroup>
            <InputLabel>포스터 ID:</InputLabel>
            <Input
              name="postId"
              value={inputs.postId}
              onChange={handleInputChange}
              placeholder="포스트 ID"
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>태그:</InputLabel>
            <Input
              name="tag"
              value={inputs.tag}
              onChange={handleInputChange}
              placeholder="태그"
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>페이지:</InputLabel>
            <Input
              name="page"
              type="number"
              value={inputs.page}
              onChange={handleInputChange}
              placeholder="페이지 번호"
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>개수 제한:</InputLabel>
            <Input
              name="limit"
              type="number"
              value={inputs.limit}
              onChange={handleInputChange}
              placeholder="개수 제한"
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>카테고리 ID:</InputLabel>
            <Input
              name="categoryId"
              type="number"
              value={inputs.categoryId}
              onChange={handleInputChange}
              placeholder="카테고리 ID"
            />
          </InputGroup>
        </InputsContainer>

        <TestControls>
          {testCases.map((test, index) => (
            <TestButton
              key={index}
              onClick={() => handleTest(test.fn, test.title)}
              disabled={loading}
            >
              {test.title}
              {test.inputs.length > 0 && (
                <RequiredInputs>
                  필요한 입력값: {test.inputs.join(', ')}
                </RequiredInputs>
              )}
            </TestButton>
          ))}
          <ClearButton onClick={clearResults}>결과 지우기</ClearButton>
        </TestControls>

        <ResultsContainer>
          <ResultsHeader>
            <h3>테스트 결과</h3>
            {loading && <LoadingIndicator>테스트 실행 중...</LoadingIndicator>}
          </ResultsHeader>
          <ResultsDisplay>
            {results || '테스트 버튼을 클릭하여 결과를 확인하세요.'}
          </ResultsDisplay>
        </ResultsContainer>
      </TestSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const BackLink = styled.a`
  color: #666;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const TestSection = styled.section`
  display: grid;
  gap: 2rem;
`;

const TestControls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Button = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TestButton = styled(Button)`
  background: #4a90e2;
  color: white;

  &:hover:not(:disabled) {
    background: #357abd;
  }
`;

const ClearButton = styled(Button)`
  background: #e74c3c;
  color: white;

  &:hover:not(:disabled) {
    background: #c0392b;
  }
`;

const ResultsContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.2rem;
    color: #333;
  }
`;

const LoadingIndicator = styled.div`
  color: #666;
  font-style: italic;
`;

const ResultsDisplay = styled.pre`
  background: #fff;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #333;
`;

const InputsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const RequiredInputs = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
`;

export default TestPage; 