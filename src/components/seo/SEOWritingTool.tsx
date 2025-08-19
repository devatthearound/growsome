'use client'

import { useState, useEffect } from 'react'
import { Save, Search, TrendingUp, AlertCircle, Lightbulb, Hash, Target } from 'lucide-react'
import SEOAnalyzer from '@/components/seo/SEOAnalyzer'

interface SEOWritingToolProps {
  initialContent?: string
  initialTitle?: string
  initialDescription?: string
  onSave?: (data: any) => void
}

export default function SEOWritingTool({
  initialContent = '',
  initialTitle = '',
  initialDescription = '',
  onSave
}: SEOWritingToolProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [content, setContent] = useState(initialContent)
  const [targetKeyword, setTargetKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [showSEOAnalysis, setShowSEOAnalysis] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // 자동 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content || description) {
        setIsAutoSaving(true)
        // 자동 저장 로직
        console.log('Auto-saving content...')
        setTimeout(() => setIsAutoSaving(false), 1000)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [title, content, description])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    const data = {
      title,
      description,
      content,
      targetKeyword,
      category,
      tags,
      metadata: {
        title,
        description,
        keywords: tags
      }
    }
    
    if (onSave) {
      onSave(data)
    }
  }

  const generateSEOTitle = () => {
    if (targetKeyword && category) {
      const templates = [
        `${targetKeyword} 완벽 가이드: ${category} 전문가가 알려주는 모든 것`,
        `${targetKeyword}로 성공하는 ${category} 전략 2025`,
        `${category} ${targetKeyword} 실무 활용법과 최신 트렌드`,
        `${targetKeyword} 도입 전 반드시 알아야 할 ${category} 핵심사항`,
        `${category} 업계가 주목하는 ${targetKeyword} 혁신 기술`
      ]
      const template = templates[Math.floor(Math.random() * templates.length)]
      setTitle(template)
    }
  }

  const generateSEODescription = () => {
    if (targetKeyword && category) {
      const template = `${targetKeyword} 전문가가 알려주는 ${category} 실무 가이드. 실제 사례와 데이터를 바탕으로 한 검증된 방법론을 제공합니다. 지금 바로 확인하세요!`
      setDescription(template)
    }
  }

  const keywordSuggestions = [
    'AI 자동화', '디지털 마케팅', '비즈니스 성장', '데이터 분석',
    '스타트업', '마케팅 전략', '고객 획득', 'ROI 개선',
    '프로세스 최적화', '디지털 전환', '성과 측정', '경쟁력 강화'
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO 최적화 글쓰기 도구</h1>
            <p className="text-gray-600">검색 엔진 최적화된 고품질 콘텐츠를 작성하세요</p>
          </div>
          <div className="flex items-center space-x-2">
            {isAutoSaving && (
              <span className="text-sm text-blue-600">저장 중...</span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 작성 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEO 설정 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              SEO 설정
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  타겟 키워드
                </label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="예: AI 자동화"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">카테고리 선택</option>
                  <option value="AI">AI 기술</option>
                  <option value="마케팅">디지털 마케팅</option>
                  <option value="비즈니스">사업 성장</option>
                  <option value="스타트업">스타트업</option>
                  <option value="데이터">데이터 분석</option>
                </select>
              </div>
            </div>

            {/* 키워드 제안 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                키워드 제안
              </label>
              <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setTargetKeyword(keyword)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  제목 ({title.length}/60자)
                </label>
                <button
                  onClick={generateSEOTitle}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  제목 생성
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="SEO 최적화된 제목을 입력하세요"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  title.length > 60 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {title.length > 60 && (
                <p className="text-sm text-red-600 mt-1">제목이 60자를 초과했습니다</p>
              )}
            </div>

            {/* 메타 설명 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  메타 설명 ({description.length}/160자)
                </label>
                <button
                  onClick={generateSEODescription}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  설명 생성
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="검색 결과에 표시될 설명을 입력하세요"
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  description.length > 160 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {description.length > 160 && (
                <p className="text-sm text-red-600 mt-1">설명이 160자를 초과했습니다</p>
              )}
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                태그
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="태그 입력 후 Enter"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 콘텐츠 작성 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">콘텐츠 작성</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="여기에 콘텐츠를 작성하세요. 타겟 키워드를 자연스럽게 포함시키고, 헤딩 구조를 잘 만들어주세요."
              rows={20}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>단어 수: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
              <span>문자 수: {content.length}</span>
            </div>
          </div>
        </div>

        {/* 사이드바 - SEO 분석 */}
        <div className="space-y-6">
          {/* SEO 분석 토글 */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <button
              onClick={() => setShowSEOAnalysis(!showSEOAnalysis)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium flex items-center">
                <Search className="w-4 h-4 mr-2" />
                SEO 분석
              </span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* SEO 분석 결과 */}
          {showSEOAnalysis && (
            <SEOAnalyzer
              content={content}
              metadata={{ title, description, keywords: tags }}
              targetKeyword={targetKeyword}
            />
          )}

          {/* SEO 팁 */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
              SEO 최적화 팁
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 제목에 타겟 키워드를 앞쪽에 배치하세요</li>
              <li>• H1, H2, H3 태그를 체계적으로 사용하세요</li>
              <li>• 키워드 밀도는 1-2%를 유지하세요</li>
              <li>• 내부 링크를 3개 이상 포함하세요</li>
              <li>• 이미지에는 alt 텍스트를 꼭 추가하세요</li>
              <li>• 최소 300단어 이상 작성하세요</li>
            </ul>
          </div>

          {/* 키워드 밀도 체커 */}
          {targetKeyword && content && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium mb-3">키워드 밀도</h3>
              <div className="space-y-2">
                {[targetKeyword, ...tags.slice(0, 3)].map((keyword) => {
                  const words = content.toLowerCase().split(/\s+/)
                  const keywordCount = words.filter(word => 
                    word.includes(keyword.toLowerCase())
                  ).length
                  const density = words.length > 0 ? (keywordCount / words.length) * 100 : 0
                  
                  return (
                    <div key={keyword} className="flex justify-between items-center">
                      <span className="text-sm">{keyword}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          density >= 1 && density <= 3 ? 'bg-green-500' :
                          density > 3 ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm">{density.toFixed(2)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
