'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/useAuth'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'

interface BlogEditData {
  id: string;
  title: string;
  slug: string;
  content_body: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  category_id: string;
  status: 'DRAFT' | 'PUBLISHED';
  is_featured: boolean;
  is_hero: boolean;
  thumbnail_url?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogEditPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading, isLoggedIn } = useAuth()
  const blogId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState<BlogEditData>({
    id: '',
    title: '',
    slug: '',
    content_body: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    category_id: '',
    status: 'DRAFT',
    is_featured: false,
    is_hero: false,
    thumbnail_url: ''
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn || !user?.isAdmin) {
        router.push('/blog')
        return
      }
      loadBlogPost()
      loadCategories()
    }
  }, [authLoading, isLoggedIn, user, blogId])

  const loadBlogPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('블로그 글을 불러올 수 없습니다.')
      }

      const data = await response.json()
      setFormData({
        id: data.id.toString(),
        title: data.title || '',
        slug: data.slug || '',
        content_body: data.content_body || '',
        excerpt: data.excerpt || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        category_id: data.category_id?.toString() || '',
        status: data.status || 'DRAFT',
        is_featured: data.is_featured || false,
        is_hero: data.is_hero || false,
        thumbnail_url: data.thumbnail_url || ''
      })
    } catch (error) {
      console.error('블로그 글 로드 실패:', error)
      setError('블로그 글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('카테고리 로드 실패:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle),
      meta_title: newTitle + ' | 그로우썸'
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content_body.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        alert('글이 성공적으로 수정되었습니다.')
        router.push(`/blog/${result.slug}`)
      } else {
        const error = await response.json()
        throw new Error(error.message || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-6">관리자만 접근할 수 있는 페이지입니다.</p>
          <Link href="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/admin/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            관리 페이지로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/blog"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>블로그 관리로 돌아가기</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {formData.slug && (
              <Link
                href={`/blog/${formData.slug}`}
                target="_blank"
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>미리보기</span>
              </Link>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">블로그 글 편집</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="블로그 글 제목을 입력하세요"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL 슬러그
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="url-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /blog/{formData.slug || 'your-slug'}
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 *
                </label>
                <textarea
                  name="content_body"
                  value={formData.content_body}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="HTML 형식으로 내용을 입력하세요..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  HTML 태그를 사용할 수 있습니다. (h1, h2, h3, p, ul, li, strong, em, blockquote 등)
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  요약
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="글의 간단한 요약을 입력하세요 (선택사항)"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">발행 설정</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상태
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="DRAFT">초안</option>
                      <option value="PUBLISHED">게시됨</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">추천 글</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_hero"
                        checked={formData.is_hero}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">히어로 글</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">썸네일 이미지</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO 설정</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메타 제목
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="페이지 제목 (60자 이내)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메타 설명
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="페이지 설명 (160자 이내)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}