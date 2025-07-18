'use client'

import { useState, useEffect } from 'react'
import { blogAPI, BlogContent, BlogCategory } from '@/lib/graphql-client'

export default function GraphQLTestPage() {
  const [contents, setContents] = useState<BlogContent[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('contents')

  // 컨텐츠 불러오기
  const loadContents = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogAPI.getContents({ first: 10, status: 'PUBLISHED' })
      if (response.data) {
        setContents(response.data.contents)
      } else if (response.errors) {
        setError(response.errors[0].message)
      }
    } catch (err) {
      setError('컨텐츠를 불러오는데 실패했습니다: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 불러오기
  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogAPI.getCategories({ isVisible: true })
      if (response.data) {
        setCategories(response.data.categories)
      } else if (response.errors) {
        setError(response.errors[0].message)
      }
    } catch (err) {
      setError('카테고리를 불러오는데 실패했습니다: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Hello 테스트
  const testHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await blogAPI.hello()
      if (response.data) {
        alert(`GraphQL 연결 성공!\n${response.data.hello}\nVersion: ${response.data.version}`)
      } else if (response.errors) {
        setError(response.errors[0].message)
      }
    } catch (err) {
      setError('GraphQL 연결 테스트 실패: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'contents') {
      loadContents()
    } else if (activeTab === 'categories') {
      loadCategories()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            GraphQL API 테스트 페이지
          </h1>

          {/* 테스트 버튼들 */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={testHello}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '테스트 중...' : 'GraphQL 연결 테스트'}
            </button>
            
            <button
              onClick={() => setActiveTab('contents')}
              className={`px-4 py-2 rounded ${
                activeTab === 'contents'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              컨텐츠 목록
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded ${
                activeTab === 'categories'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              카테고리 목록
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h3 className="font-bold">오류 발생:</h3>
              <p>{error}</p>
            </div>
          )}

          {/* 로딩 상태 */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              데이터를 불러오는 중...
            </div>
          )}

          {/* 컨텐츠 탭 */}
          {activeTab === 'contents' && !loading && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                블로그 컨텐츠 ({contents.length}개)
              </h2>
              
              {contents.length === 0 ? (
                <div className="p-4 bg-gray-100 rounded text-gray-600">
                  등록된 컨텐츠가 없습니다.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contents.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {content.title}
                        </h3>
                        {content.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            추천
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {content.excerpt || '요약이 없습니다.'}
                      </p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>작성자: {content.author?.username || '알 수 없음'}</div>
                        <div>카테고리: {content.category?.name || '없음'}</div>
                        <div>상태: {content.status}</div>
                        <div>조회수: {content.viewCount} | 좋아요: {content.likeCount}</div>
                        <div>슬러그: {content.slug}</div>
                        {content.publishedAt && (
                          <div>발행일: {new Date(content.publishedAt).toLocaleDateString()}</div>
                        )}
                      </div>
                      
                      {content.tags && content.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {content.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 카테고리 탭 */}
          {activeTab === 'categories' && !loading && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                블로그 카테고리 ({categories.length}개)
              </h2>
              
              {categories.length === 0 ? (
                <div className="p-4 bg-gray-100 rounded text-gray-600">
                  등록된 카테고리가 없습니다.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {category.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          category.isVisible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isVisible ? '표시' : '숨김'}
                        </span>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>슬러그: {category.slug}</div>
                        <div>정렬 순서: {category.sortOrder}</div>
                        <div>컨텐츠 수: {category.contentCount || 0}개</div>
                        <div>생성일: {new Date(category.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API 정보 */}
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">API 정보</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>GraphQL Endpoint: /api/graphql</div>
              <div>Prisma를 사용한 데이터베이스 연결</div>
              <div>테이블 매핑: blog_contents → Content, blog_categories → Category</div>
              <div>지원 기능: 조회, 생성, 수정, 삭제 (CRUD)</div>
            </div>
          </div>

          {/* 샘플 쿼리 */}
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">샘플 GraphQL 쿼리</h3>
            <pre className="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`query GetContents {
  contents(first: 5, status: "PUBLISHED") {
    id
    title
    slug
    excerpt
    author {
      username
    }
    category {
      name
    }
    tags {
      name
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
