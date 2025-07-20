'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TiptapEditor from '@/components/editor/tiptap-editor'
import { useCreateContent, useUpdateContent, useBlogCategories, useBlogContent } from '@/hooks/use-blog'
import { CreateContentInput, UpdateContentInput } from '@/lib/graphql-client'

// 파일 업로드 함수
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('파일 업로드 실패')
  }

  const data = await response.json()
  return data.url
}

// 오픈그래프 데이터 가져오기 함수
const fetchOpenGraph = async (url: string) => {
  const response = await fetch('/api/opengraph', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error('오픈그래프 데이터 가져오기 실패')
  }

  return response.json()
}

interface BlogWriterProps {
  contentId?: number
  mode?: 'create' | 'edit'
}

const BlogWriter = ({ contentId, mode = 'create' }: BlogWriterProps) => {
  console.log('🔍 BlogWriter 초기화:', { contentId, mode })
  
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'PRIVATE'>('DRAFT')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [autoSlugEnabled, setAutoSlugEnabled] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Hooks
  const { createContent, loading: createLoading, error: createError } = useCreateContent()
  const { updateContent, loading: updateLoading, error: updateError } = useUpdateContent()
  const { categories, loading: categoriesLoading } = useBlogCategories(true)
  const { content: existingContent, loading: contentLoading, error: contentError } = useBlogContent(contentId)

  console.log('📊 Hook 상태:', {
    mode,
    contentId,
    contentLoading,
    contentError,
    existingContent: !!existingContent,
    dataLoaded
  })

  // Edit 모드인 경우 기존 컨텐츠 로드
  useEffect(() => {
    console.log('📥 useEffect 트리거:', {
      mode,
      contentId,
      existingContent: !!existingContent,
      contentLoading,
      dataLoaded
    })
    
    if (mode === 'edit' && existingContent && !contentLoading && !dataLoaded) {
      console.log('✅ 기존 컨텐츠 로딩:', existingContent)
      
      setTitle(existingContent.title || '')
      setSlug(existingContent.slug || '')
      setContent(existingContent.contentBody || '')
      setExcerpt(existingContent.excerpt || '')
      setCategoryId(existingContent.categoryId || undefined)
      setStatus(existingContent.status || 'DRAFT')
      setThumbnailUrl(existingContent.thumbnailUrl || '')
      setMetaTitle(existingContent.metaTitle || '')
      setMetaDescription(existingContent.metaDescription || '')
      setIsFeatured(existingContent.isFeatured || false)
      setAutoSlugEnabled(false) // 수정 모드에서는 자동 slug 생성 비활성화
      setDataLoaded(true)
      
      console.log('🎯 상태 업데이트 완료:', {
        title: existingContent.title,
        content: existingContent.contentBody?.slice(0, 100) + '...',
        categoryId: existingContent.categoryId
      })
    }
  }, [mode, existingContent, contentLoading, dataLoaded])

  // 제목에서 자동으로 slug 생성
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '') // 알파벳, 숫자, 한글, 공백, 하이픈만 허용
      .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
      .replace(/-+/g, '-') // 연속된 하이픈을 하나로
      .trim()
      .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
  }

  // 제목 변경 시 자동 slug 생성
  useEffect(() => {
    if (autoSlugEnabled && title) {
      setSlug(generateSlug(title))
    }
  }, [title, autoSlugEnabled])

  // 저장 함수
  const handleSave = async (saveStatus: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' = status) => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    if (!slug.trim()) {
      alert('슬러그를 입력해주세요.')
      return
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    try {
      if (mode === 'create') {
        const input: CreateContentInput = {
          title: title.trim(),
          slug: slug.trim(),
          contentBody: content,
          authorId: 1, // TODO: 실제 사용자 ID로 변경
          categoryId: categoryId,
          status: saveStatus,
          isFeatured,
          isHero: false,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          tags: [] // TODO: 태그 기능 추가
        }

        const result = await createContent(input)
        if (result) {
          alert('블로그 포스트가 성공적으로 생성되었습니다.')
          router.push(`/blog/${result.slug}`)
        }
      } else if (mode === 'edit' && contentId) {
        const input: UpdateContentInput = {
          title: title.trim(),
          slug: slug.trim(),
          contentBody: content,
          categoryId: categoryId,
          status: saveStatus,
          isFeatured,
          isHero: false,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          tags: [] // TODO: 태그 기능 추가
        }

        const result = await updateContent(contentId, input)
        if (result) {
          alert('블로그 포스트가 성공적으로 수정되었습니다.')
          router.push(`/blog/${result.slug}`)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const loading = createLoading || updateLoading || categoriesLoading || (mode === 'edit' && contentLoading)
  const error = createError || updateError || contentError

  if (mode === 'edit' && contentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">컨텐츠를 불러오는 중... (ID: {contentId})</p>
        </div>
      </div>
    )
  }

  if (mode === 'edit' && contentError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">컨텐츠 로드 실패</h1>
          <p className="text-gray-600 mb-4">ID: {contentId}</p>
          <p className="text-red-600 mb-6">{contentError}</p>
          <button
            onClick={() => router.push('/blog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            블로그 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  console.log('🎨 현재 상태:', {
    title: title.slice(0, 50) + '...',
    content: content.slice(0, 100) + '...',
    dataLoaded
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-none mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'create' ? '새 블로그 포스트 작성' : `블로그 포스트 수정 (ID: ${contentId})`}
            </h1>
            <p className="text-gray-600">
              {mode === 'create' ? '새로운 블로그 포스트를 작성해보세요.' : '기존 블로그 포스트를 수정해보세요.'}
            </p>
            {mode === 'edit' && (
              <div className="mt-2 text-sm text-gray-500">
                로딩 상태: {contentLoading ? '로딩 중' : '완료'} | 
                데이터 존재: {existingContent ? '있음' : '없음'} | 
                폼 로드됨: {dataLoaded ? '예' : '아니오'}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Main Content - 반응형 너비 */}
          <div className="flex-1 max-w-4xl space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="블로그 포스트 제목을 입력하세요"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                슬러그 (URL) *
                <button
                  type="button"
                  onClick={() => setAutoSlugEnabled(!autoSlugEnabled)}
                  className={`ml-2 text-xs px-2 py-1 rounded ${
                    autoSlugEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {autoSlugEnabled ? '자동생성 ON' : '자동생성 OFF'}
                </button>
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setAutoSlugEnabled(false)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="blog-post-url"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL: /blog/{slug || 'your-slug'}
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <div className="w-full">
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="블로그 포스트 내용을 작성하세요..."
                  className="min-h-[500px]"
                  onFileUpload={uploadFile}
                  onOpenGraphFetch={fetchOpenGraph}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                현재 콘텐츠 길이: {content.length} 글자
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                요약 (SEO 설명)
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="블로그 포스트의 간단한 요약을 입력하세요"
              />
              <p className="mt-1 text-sm text-gray-500">
                {excerpt.length}/300 글자
              </p>
            </div>
          </div>

          {/* Sidebar - 고정 너비 */}
          <div className="flex-shrink-0 w-80 space-y-6">
            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">발행</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상태
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED' | 'PRIVATE')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">초안</option>
                    <option value="PUBLISHED">발행됨</option>
                    <option value="PRIVATE">비공개</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    추천 포스트
                  </label>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSave('DRAFT')}
                    disabled={loading}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
                  >
                    {loading ? '저장 중...' : '초안 저장'}
                  </button>
                  <button
                    onClick={() => handleSave('PUBLISHED')}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? '발행 중...' : '발행하기'}
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">카테고리</h3>
              
              {categoriesLoading ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
              ) : (
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">대표 이미지</h3>
              
              {/* 파일 업로드 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 파일 업로드
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const url = await uploadFile(file)
                        setThumbnailUrl(url)
                      } catch (error) {
                        alert('이미지 업로드에 실패했습니다.')
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG, GIF 파일을 지원합니다
                </p>
              </div>
              
              {/* URL 직접 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  또는 이미지 URL 직접 입력
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* 이미지 미리보기 */}
              {thumbnailUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
                  <div className="relative">
                    <img
                      src={thumbnailUrl}
                      alt="미리보기"
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="이미지 제거"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              {/* 이미지가 없을 때 기본 이미지 안내 */}
              {!thumbnailUrl && (
                <div className="mt-3 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    이미지를 설정하지 않으면 카테고리에 맞는 기본 이미지가 자동으로 생성됩니다.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                      📷
                    </div>
                    <span>자동 생성 이미지 예시</span>
                  </div>
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">SEO 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO 제목
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={title || "SEO 제목"}
                  />
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO 설명
                  </label>
                  <textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={excerpt || "SEO 설명"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogWriter