'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, XCircle, TrendingUp, Search, FileText } from 'lucide-react'

interface SEOAnalysis {
  score: number
  issues: {
    critical: string[]
    warning: string[]
    passed: string[]
  }
  metrics: {
    titleLength: number
    descriptionLength: number
    wordCount: number
    headingStructure: {
      h1: number
      h2: number
      h3: number
    }
    keywordDensity: number
    internalLinks: number
    images: {
      total: number
      withAlt: number
    }
  }
}

interface SEOAnalyzerProps {
  content: string
  metadata: {
    title?: string
    description?: string
    keywords?: string[]
  }
  targetKeyword?: string
}

export default function SEOAnalyzer({ content, metadata, targetKeyword = '' }: SEOAnalyzerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    analyzeSEO()
  }, [content, metadata, targetKeyword])

  const calculateKeywordDensity = (text: string, keyword: string): number => {
    if (!keyword) return 0
    const words = text.toLowerCase().split(/\s+/)
    const keywordCount = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length
    return words.length > 0 ? (keywordCount / words.length) * 100 : 0
  }

  const analyzeSEO = () => {
    setIsLoading(true)
    
    const issues = {
      critical: [] as string[],
      warning: [] as string[],
      passed: [] as string[]
    }

    // 메트릭 계산
    const titleLength = metadata?.title?.length || 0
    const descriptionLength = metadata?.description?.length || 0
    const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = plainContent.split(/\s+/).length
    
    // 헤딩 구조 분석
    const h1Count = (content.match(/<h1[^>]*>/gi) || []).length
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length
    const h3Count = (content.match(/<h3[^>]*>/gi) || []).length
    
    // 키워드 밀도 계산
    const keywordDensity = calculateKeywordDensity(plainContent, targetKeyword)
    
    // 내부 링크 분석
    const internalLinks = (content.match(/href=["']\/[^"']*["']/gi) || []).length
    
    // 이미지 분석
    const images = content.match(/<img[^>]*>/gi) || []
    const imagesWithAlt = images.filter(img => img.includes('alt='))

    const metrics = {
      titleLength,
      descriptionLength,
      wordCount,
      headingStructure: { h1: h1Count, h2: h2Count, h3: h3Count },
      keywordDensity,
      internalLinks,
      images: {
        total: images.length,
        withAlt: imagesWithAlt.length
      }
    }

    // SEO 분석
    
    // 1. 제목 검증 (30-60자)
    if (!metadata?.title) {
      issues.critical.push('메타 제목이 없습니다')
    } else if (titleLength < 30) {
      issues.warning.push(`메타 제목이 너무 짧습니다 (${titleLength}자, 30자 이상 권장)`)
    } else if (titleLength > 60) {
      issues.warning.push(`메타 제목이 너무 깁니다 (${titleLength}자, 60자 이하 권장)`)
    } else {
      issues.passed.push(`메타 제목 길이가 적절합니다 (${titleLength}자)`)
    }

    // 2. 메타 설명 검증 (120-160자)
    if (!metadata?.description) {
      issues.critical.push('메타 설명이 없습니다')
    } else if (descriptionLength < 120) {
      issues.warning.push(`메타 설명이 너무 짧습니다 (${descriptionLength}자, 120자 이상 권장)`)
    } else if (descriptionLength > 160) {
      issues.warning.push(`메타 설명이 너무 깁니다 (${descriptionLength}자, 160자 이하 권장)`)
    } else {
      issues.passed.push(`메타 설명 길이가 적절합니다 (${descriptionLength}자)`)
    }

    // 3. 헤딩 구조 검증
    if (h1Count === 0) {
      issues.critical.push('H1 태그가 없습니다')
    } else if (h1Count > 1) {
      issues.warning.push(`H1 태그가 ${h1Count}개 있습니다 (1개만 사용 권장)`)
    } else {
      issues.passed.push('H1 태그가 적절하게 사용되었습니다')
    }

    if (h2Count < 2) {
      issues.warning.push('H2 태그가 부족합니다 (2개 이상 권장)')
    } else {
      issues.passed.push(`H2 태그가 충분합니다 (${h2Count}개)`)
    }

    // 4. 키워드 밀도 검증
    if (targetKeyword) {
      if (keywordDensity < 0.5) {
        issues.warning.push(`타겟 키워드 밀도가 낮습니다 (${keywordDensity.toFixed(2)}%, 0.5-2% 권장)`)
      } else if (keywordDensity > 3) {
        issues.warning.push(`타겟 키워드 밀도가 높습니다 (${keywordDensity.toFixed(2)}%, 키워드 스터핑 위험)`)
      } else {
        issues.passed.push(`타겟 키워드 밀도가 적절합니다 (${keywordDensity.toFixed(2)}%)`)
      }

      // 제목에 타겟 키워드 포함 여부
      if (!metadata?.title?.toLowerCase().includes(targetKeyword.toLowerCase())) {
        issues.warning.push('제목에 타겟 키워드가 포함되지 않았습니다')
      } else {
        issues.passed.push('제목에 타겟 키워드가 포함되어 있습니다')
      }
    }

    // 5. 이미지 alt 텍스트 검증
    if (images.length > 0) {
      if (imagesWithAlt.length === 0) {
        issues.critical.push('모든 이미지에 alt 텍스트가 없습니다')
      } else if (imagesWithAlt.length < images.length) {
        issues.warning.push(`${images.length - imagesWithAlt.length}개 이미지에 alt 텍스트가 없습니다`)
      } else {
        issues.passed.push('모든 이미지에 alt 텍스트가 있습니다')
      }
    }

    // 6. 내부 링크 검증
    if (internalLinks < 2) {
      issues.warning.push(`내부 링크가 부족합니다 (${internalLinks}개, 2개 이상 권장)`)
    } else {
      issues.passed.push(`내부 링크가 충분합니다 (${internalLinks}개)`)
    }

    // 7. 콘텐츠 길이 검증
    if (wordCount < 300) {
      issues.warning.push(`콘텐츠가 짧습니다 (${wordCount}단어, 300단어 이상 권장)`)
    } else {
      issues.passed.push(`콘텐츠 길이가 충분합니다 (${wordCount}단어)`)
    }

    // 전체 점수 계산
    const totalChecks = issues.critical.length + issues.warning.length + issues.passed.length
    const score = totalChecks > 0 ? Math.round(((issues.passed.length + (issues.warning.length * 0.5)) / totalChecks) * 100) : 0

    setAnalysis({ score, issues, metrics })
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">SEO 분석 중...</span>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* SEO 점수 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">SEO 분석 결과</h3>
              <p className="text-sm text-gray-500">콘텐츠 SEO 최적화 상태</p>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              analysis.score >= 80 ? 'text-green-600' : 
              analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.score}
            </div>
            <div className="text-sm text-gray-500">점수</div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                analysis.score >= 80 ? 'bg-green-500' : 
                analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 메트릭 카드들 */}
      <div className="p-6 border-b">
        <h4 className="font-medium mb-4 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          주요 메트릭
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.titleLength}</div>
            <div className="text-xs text-gray-500">제목 길이</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.wordCount}</div>
            <div className="text-xs text-gray-500">단어 수</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.keywordDensity.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">키워드 밀도</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{analysis.metrics.internalLinks}</div>
            <div className="text-xs text-gray-500">내부 링크</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 심각한 문제 */}
        {analysis.issues.critical.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center text-red-600 font-medium mb-3">
              <XCircle className="w-4 h-4 mr-2" />
              심각한 문제 ({analysis.issues.critical.length})
            </h4>
            <ul className="space-y-2">
              {analysis.issues.critical.map((issue, index) => (
                <li key={index} className="flex items-start text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                  <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 개선 권장사항 */}
        {analysis.issues.warning.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center text-yellow-600 font-medium mb-3">
              <AlertCircle className="w-4 h-4 mr-2" />
              개선 권장사항 ({analysis.issues.warning.length})
            </h4>
            <ul className="space-y-2">
              {analysis.issues.warning.map((issue, index) => (
                <li key={index} className="flex items-start text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 통과한 항목 */}
        {analysis.issues.passed.length > 0 && (
          <div>
            <h4 className="flex items-center text-green-600 font-medium mb-3">
              <CheckCircle className="w-4 h-4 mr-2" />
              통과한 항목 ({analysis.issues.passed.length})
            </h4>
            <ul className="space-y-2">
              {analysis.issues.passed.map((issue, index) => (
                <li key={index} className="flex items-start text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
