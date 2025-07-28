"use client";

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { editorApi } from '@/services/editorApi'

// 동적 import로 SSR 문제 해결 - 안전한 에디터 사용
const SafeEditor = dynamic(
  () => import('@/components/editor/SafeEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg bg-white min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">에디터를 불러오는 중...</div>
      </div>
    )
  }
)

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Eye, 
  Send, 
  ArrowLeft,
  BarChart3,
  FileText,
  Tag,
  User,
  Calendar,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ArticleData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  isPublished: boolean
  isDraft: boolean
  metaTitle: string
  metaDescription: string
  featuredImage: string
  publishDate: string
}

export default function WritePage() {
  const [articleData, setArticleData] = useState<ArticleData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    author: '',
    isPublished: false,
    isDraft: true,
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    publishDate: ''
  })

  const [wordCount, setWordCount] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [newTag, setNewTag] = useState('')

  // 카테고리 목록
  const categories = [
    '개발 블로그',
    '기술 리뷰',
    '튜토리얼',
    '업데이트',
    '공지사항',
    '일반'
  ]

  const handleContentChange = (content: string) => {
    setArticleData(prev => ({ ...prev, content }))
    // Calculate word count (rough estimation)
    const textContent = content.replace(/<[^>]*>/g, '')
    setWordCount(textContent.length)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      setArticleData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setArticleData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // 자동 저장 함수
  const autoSave = async () => {
    if (!articleData.title && !articleData.content) return // 빈 내용은 저장하지 않음
    
    setAutoSaveStatus('saving')
    
    try {
      // localStorage에 임시 저장
      const saveData = {
        ...articleData,
        lastModified: new Date().toISOString(),
        autoSaved: true
      }
      localStorage.setItem('article_draft', JSON.stringify(saveData))
      
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
      
      // 3초 후 상태 초기화
      setTimeout(() => {
        setAutoSaveStatus('saved')
      }, 3000)
      
    } catch (error) {
      console.error('Auto save failed:', error)
      setAutoSaveStatus('error')
      
      // 5초 후 에러 상태 초기화
      setTimeout(() => {
        setAutoSaveStatus('saved')
      }, 5000)
    }
  }

  // 자동 저장 디바운스
  const debouncedAutoSave = useCallback(
    debounce(() => {
      autoSave()
    }, 2000), // 2초 후 자동 저장
    [articleData]
  )

  // 디바운스 유틸리티 함수
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // 초기 로드 시 저장된 데이터 복원
  useEffect(() => {
    const savedData = localStorage.getItem('article_draft')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // 24시간 이내 데이터만 복원
        const lastModified = new Date(parsed.lastModified || 0)
        const now = new Date()
        const hoursDiff = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          setArticleData(prev => ({
            ...prev,
            ...parsed,
            lastModified: undefined,
            autoSaved: undefined
          }))
          setLastSaved(lastModified)
        } else {
          // 24시간 지난 데이터는 삭제
          localStorage.removeItem('article_draft')
        }
      } catch (error) {
        console.error('Failed to restore saved data:', error)
        localStorage.removeItem('article_draft')
      }
    }
  }, [])

  // 데이터 변경 시 자동 저장 트리거
  useEffect(() => {
    if (articleData.title || articleData.content) {
      debouncedAutoSave()
    }
  }, [articleData, debouncedAutoSave])

  const handleSaveDraft = () => {
    console.log('Saving draft...', { ...articleData, isDraft: true })
    alert('임시저장되었습니다.')
  }

  const handlePublish = () => {
    if (!articleData.title || !articleData.content) {
      alert('제목과 내용은 필수 입력 항목입니다.')
      return
    }
    console.log('Publishing article...', { ...articleData, isPublished: true, isDraft: false })
    alert('글이 발행되었습니다!')
  }

  const handlePreview = () => {
    window.open('/preview', '_blank')
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">로딩 중...</div>}>
    <div className="write-page min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
                
                {/* Auto Save Status */}
                <div className="flex items-center gap-2 text-sm">
                  {autoSaveStatus === 'saving' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>저장 중...</span>
                    </div>
                  )}
                  {autoSaveStatus === 'saved' && lastSaved && (
                    <div className="flex items-center gap-1 text-green-600">
                      <span>✓ 자동 저장됨</span>
                      <span className="text-xs text-gray-500">
                        {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {autoSaveStatus === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <span>✗ 저장 실패</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{wordCount} 글자</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveDraft}
                >
                  <Save className="w-4 h-4 mr-2" />
                  임시저장
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  미리보기
                </Button>
                <Button 
                  size="sm"
                  onClick={handlePublish}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  발행하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 px-6 py-8 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                제목 *
              </label>
              <Input
                id="title"
                placeholder="매력적인 제목을 입력하세요..."
                value={articleData.title}
                onChange={(e) => setArticleData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg h-12 border-gray-300"
              />
            </div>

            {/* Editor */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                내용 *
              </label>
              <SafeEditor
                content={articleData.content}
                onChange={handleContentChange}
                placeholder="여기에 글을 작성해보세요! 강력한 에디터 기능을 활용해보세요."
                onFileUpload={editorApi.uploadImage}
                className="min-h-[500px]"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l py-8 px-4 bg-gray-50/50 overflow-y-auto max-h-screen">
            <div className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  기본 정보
                </h3>
                
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">카테고리</label>
                  <select
                    value={articleData.category}
                    onChange={(e) => setArticleData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">요약</label>
                  <textarea
                    placeholder="글의 간단한 요약을 입력하세요..."
                    value={articleData.excerpt}
                    onChange={(e) => setArticleData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    작성자
                  </label>
                  <Input
                    placeholder="작성자 이름"
                    value={articleData.author}
                    onChange={(e) => setArticleData(prev => ({ ...prev, author: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  태그
                </h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="태그 입력"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="text-sm"
                  />
                  <Button onClick={handleAddTag} size="sm" variant="outline">
                    추가
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {articleData.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Card */}
              <div className="bg-white rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  SEO 설정
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SEO 제목</label>
                    <Input
                      placeholder="검색엔진에 표시될 제목"
                      value={articleData.metaTitle}
                      onChange={(e) => setArticleData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="text-sm mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">{articleData.metaTitle.length}/60</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">SEO 설명</label>
                    <textarea
                      placeholder="검색엔진에 표시될 설명"
                      value={articleData.metaDescription}
                      onChange={(e) => setArticleData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm h-16 resize-none mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">{articleData.metaDescription.length}/160</p>
                  </div>
                </div>
              </div>

              {/* Publish Settings Card */}
              <div className="bg-white rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  발행 설정
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">발행 일시</label>
                    <Input
                      type="datetime-local"
                      value={articleData.publishDate}
                      onChange={(e) => setArticleData(prev => ({ ...prev, publishDate: e.target.value }))}
                      className="text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">대표 이미지 URL</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={articleData.featuredImage}
                      onChange={(e) => setArticleData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="text-sm mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">통계</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>글자 수:</span>
                    <span>{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>예상 읽기 시간:</span>
                    <span>{Math.max(1, Math.ceil(wordCount / 300))}분</span>
                  </div>
                  <div className="flex justify-between">
                    <span>태그 수:</span>
                    <span>{articleData.tags.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  )
}
