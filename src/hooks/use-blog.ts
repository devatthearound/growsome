'use client'

import { useState, useEffect } from 'react'
import { BLOG_QUERIES, BLOG_MUTATIONS, BlogContent, BlogCategory, CreateContentInput, UpdateContentInput } from '@/lib/graphql-client'

// GraphQL 요청 함수
async function graphqlRequest(query: string, variables: any = {}) {
  try {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    return result.data
  } catch (error) {
    console.error('GraphQL request error:', error)
    throw error
  }
}

// 컨텐츠 목록 조회 훅
export function useBlogContents(options: {
  first?: number
  categoryId?: number
  status?: string
} = {}) {
  const [contents, setContents] = useState<BlogContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_QUERIES.GET_CONTENTS, {
        first: options.first || 10,
        categoryId: options.categoryId,
        status: options.status || 'PUBLISHED'
      })
      
      setContents(data.contents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '컨텐츠를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [options.first, options.categoryId, options.status])

  return {
    contents,
    loading,
    error,
    refetch: fetchContents
  }
}

// 단일 컨텐츠 조회 훅
export function useBlogContent(id?: number, slug?: string) {
  const [content, setContent] = useState<BlogContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    if (!id && !slug) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_QUERIES.GET_CONTENT, {
        id,
        slug
      })
      
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : '컨텐츠를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [id, slug])

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  }
}

// 카테고리 목록 조회 훅
export function useBlogCategories(isVisible?: boolean) {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_QUERIES.GET_CATEGORIES, {
        isVisible
      })
      
      setCategories(data.categories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [isVisible])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

// 컨텐츠 생성 훅
export function useCreateContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContent = async (input: CreateContentInput): Promise<BlogContent | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_MUTATIONS.CREATE_CONTENT, {
        input
      })
      
      return data.createContent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '컨텐츠 생성에 실패했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createContent,
    loading,
    error
  }
}

// 컨텐츠 수정 훅
export function useUpdateContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateContent = async (id: number, input: UpdateContentInput): Promise<BlogContent | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_MUTATIONS.UPDATE_CONTENT, {
        id,
        input
      })
      
      return data.updateContent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '컨텐츠 수정에 실패했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    updateContent,
    loading,
    error
  }
}

// 컨텐츠 삭제 훅
export function useDeleteContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteContent = async (id: number): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await graphqlRequest(BLOG_MUTATIONS.DELETE_CONTENT, {
        id
      })
      
      return data.deleteContent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '컨텐츠 삭제에 실패했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteContent,
    loading,
    error
  }
}
