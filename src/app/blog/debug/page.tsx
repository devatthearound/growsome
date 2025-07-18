// 블로그 시스템 디버깅 페이지
// src/app/blog/debug/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BlogDebugPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // GraphQL 테스트 함수
  const testGraphQL = async () => {
    setLoading(true);
    try {
      // 1. 기본 연결 테스트
      const helloTest = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              hello
              version
            }
          `
        })
      });
      
      const helloResult = await helloTest.json();

      // 2. 카테고리 조회 테스트
      const categoriesTest = await fetch('/api/graphql', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              categories {
                id
                name
                slug
                description
                isVisible
              }
            }
          `
        })
      });

      const categoriesResult = await categoriesTest.json();

      // 3. 컨텐츠 조회 테스트
      const contentsTest = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              contents(first: 5) {
                id
                title
                slug
                status
                viewCount
                likeCount
                commentCount
                publishedAt
                category {
                  name
                  slug
                }
                author {
                  username
                  email
                }
              }
            }
          `
        })
      });

      const contentsResult = await contentsTest.json();

      // 4. 특정 컨텐츠 조회 테스트
      const contentTest = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              content(slug: "nextjs-15-new-features") {
                id
                title
                contentBody
                slug
                thumbnailUrl
                status
                viewCount
                likeCount
                commentCount
                publishedAt
                category {
                  name
                  slug
                }
                author {
                  username
                  email
                  company_name
                }
                tags {
                  tag {
                    name
                    slug
                  }
                }
              }
            }
          `
        })
      });

      const contentResult = await contentTest.json();

      setTestResults({
        hello: helloResult,
        categories: categoriesResult,
        contents: contentsResult,
        content: contentResult
      });

    } catch (error) {
      console.error('테스트 실패:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          블로그 시스템 디버깅
        </h1>

        {/* 테스트 버튼 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">GraphQL API 테스트</h2>
          <button
            onClick={testGraphQL}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '테스트 중...' : 'GraphQL API 테스트 실행'}
          </button>
        </div>

        {/* 결과 표시 */}
        {testResults && (
          <div className="space-y-6">
            {/* Hello 테스트 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">1. 기본 연결 테스트</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResults.hello, null, 2)}
              </pre>
            </div>

            {/* 카테고리 테스트 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">2. 카테고리 조회 테스트</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResults.categories, null, 2)}
              </pre>
            </div>

            {/* 컨텐츠 목록 테스트 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">3. 컨텐츠 목록 조회 테스트</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResults.contents, null, 2)}
              </pre>
            </div>

            {/* 단일 컨텐츠 테스트 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">4. 단일 컨텐츠 조회 테스트</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResults.content, null, 2)}
              </pre>
            </div>

            {/* 에러 */}
            {testResults.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">에러 발생</h3>
                <p className="text-red-700">{testResults.error}</p>
              </div>
            )}
          </div>
        )}

        {/* 유용한 링크들 */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">유용한 링크</h3>
          <div className="space-y-2">
            <a 
              href="/api/graphql" 
              target="_blank"
              className="block text-blue-600 hover:underline"
            >
              📄 GraphQL Playground (개발 모드에서만)
            </a>
            <Link 
              href="/blog" 
              className="block text-blue-600 hover:underline"
            >
              📝 블로그 메인 페이지
            </Link>
            <Link 
              href="/blog/nextjs-15-new-features" 
              className="block text-blue-600 hover:underline"
            >
              📖 테스트 포스트: Next.js 15 새 기능
            </Link>
            <Link 
              href="/blog/react-performance-optimization" 
              className="block text-blue-600 hover:underline"
            >
              📖 테스트 포스트: React 성능 최적화
            </Link>
          </div>
        </div>

        {/* 설정 가이드 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            ⚠️ 블로그 시스템 설정 가이드
          </h3>
          <div className="text-yellow-700 space-y-2">
            <p><strong>1단계:</strong> 터미널에서 <code className="bg-yellow-100 px-2 py-1 rounded">npm run blog:init</code> 실행</p>
            <p><strong>2단계:</strong> 위의 "GraphQL API 테스트 실행" 버튼 클릭</p>
            <p><strong>3단계:</strong> 모든 테스트가 성공하면 블로그 페이지 방문</p>
            <p><strong>문제 발생 시:</strong> 콘솔 로그와 네트워크 탭을 확인하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}