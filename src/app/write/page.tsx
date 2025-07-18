'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

// Tiptap 에디터를 동적으로 로드 (SSR 문제 방지)
const TiptapEditor = dynamic(
  () => import('@/components/editor/TiptapEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center border border-gray-300 rounded-lg">
        <div className="text-gray-500">에디터를 로딩 중...</div>
      </div>
    )
  }
);

// GraphQL 쿼리들 (blog_contents 테이블 구조에 맞춘)
const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

const GET_CONTENT_BY_SLUG_QUERY = `
  query GetContentBySlug($slug: String!) {
    content(slug: $slug) {
      id
      title
      slug
      contentBody
      excerpt
      metaTitle
      metaDescription
      thumbnailUrl
      categoryId
      status
      isFeatured
    }
  }
`;

// GraphQL Mutation 쿼리들 (정확한 필드명 사용)
const CREATE_CONTENT_MUTATION = `
  mutation CreateContent($input: CreateContentInput!) {
    createContent(input: $input) {
      id
      slug
      title
      status
    }
  }
`;

const UPDATE_CONTENT_MUTATION = `
  mutation UpdateContent($id: Int!, $input: UpdateContentInput!) {
    updateContent(id: $id, input: $input) {
      id
      slug
      title
      status
    }
  }
`;

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface ContentData {
  id: number;
  title: string;
  slug: string;
  contentBody: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  categoryId?: number;
  status: string;
  isFeatured: boolean;
}

export default function WritePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostSlug, setEditPostSlug] = useState<string | null>(null);
  const [editPostId, setEditPostId] = useState<number | null>(null);

  // GraphQL 요청 함수
  const graphqlRequest = async (query: string, variables: any = {}) => {
    console.log('Making GraphQL request:', { query, variables });
    
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  };

  // 카테고리 목록 로드 및 수정 모드 확인
  useEffect(() => {
    fetchCategories();
    
    // URL 파라미터에서 edit 값 확인
    const urlParams = new URLSearchParams(window.location.search);
    const editSlug = urlParams.get('edit');
    
    if (editSlug) {
      setIsEditMode(true);
      setEditPostSlug(editSlug);
      fetchContentForEdit(editSlug);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await graphqlRequest(GET_CATEGORIES_QUERY);
      setCategories(data.categories || []);
    } catch (error) {
      console.log('카테고리 로드 실패:', error);
      // 카테고리가 없어도 에디터는 작동하도록 함
      console.warn('카테고리를 불러오지 못했지만 에디터는 계속 사용할 수 있습니다.');
    }
  };

  // 수정을 위한 포스트 로드
  const fetchContentForEdit = async (slug: string) => {
    try {
      setIsLoading(true);
      const data = await graphqlRequest(GET_CONTENT_BY_SLUG_QUERY, { slug });
      
      if (data.content) {
        const contentData: ContentData = data.content;
        
        // 데이터 설정
        setTitle(contentData.title || '');
        setContent(contentData.contentBody || '');
        setExcerpt(contentData.excerpt || contentData.metaDescription || '');
        setSelectedCategory(contentData.categoryId || '');
        setFeaturedImage(contentData.thumbnailUrl || '');
        setStatus(contentData.status as 'DRAFT' | 'PUBLISHED' || 'DRAFT');
        setEditPostId(contentData.id);
        
        // tags는 현재 시스템에서 비활성화
        setTags('');
      } else {
        alert('포스트를 찾을 수 없습니다.');
        router.push('/blog');
      }
    } catch (error) {
      console.error('포스트 로드 실패:', error);
      alert('포스트를 불러오는데 오류가 발생했습니다.');
      router.push('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  // 슬러그 생성 함수 (개선된 버전)
  const generateSlug = (title: string) => {
    if (!title.trim()) return '';
    
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '') // 알파벳, 숫자, 한글, 공백, 하이픈만 허용
      .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
      .replace(/-+/g, '-') // 연속된 하이픈을 하나로
      .trim()
      .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
      || 'untitled-' + Date.now(); // 빈 슬러그인 경우 기본값
  };

  // 읽기 시간 계산 함수
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/[^\w\s가-힣]/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // GraphQL Mutation을 사용한 포스트 저장 (개선된 버전)
  const savePost = async (saveStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);

    try {
      const slug = generateSlug(title);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      // GraphQL 스키마에 맞는 정확한 필드명 사용
      const inputData: any = {
        title: title.trim(),
        slug: slug || `untitled-${Date.now()}`, // 슬러그가 비어있으면 기본값
        contentBody: content,
        authorId: user?.id || 1, // 로그인된 사용자 ID 사용
        status: saveStatus,
        isFeatured: false,
        isHero: false,
        metaTitle: title.trim(),
        metaDescription: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 160)
      };

      // 선택사항 필드들 추가
      if (selectedCategory && selectedCategory !== '') {
        inputData.categoryId = selectedCategory;
      }
      
      if (featuredImage.trim()) {
        inputData.thumbnailUrl = featuredImage.trim();
      }
      
      if (tagsArray.length > 0) {
        inputData.tags = tagsArray;
      }

      console.log('Saving with data:', inputData);

      let result;
      if (isEditMode && editPostId) {
        // 수정 모드 - authorId 제외
        const { authorId, ...updateData } = inputData;
        result = await graphqlRequest(UPDATE_CONTENT_MUTATION, {
          id: editPostId,
          input: updateData
        });
        console.log('Update result:', result);
      } else {
        // 새로 작성 모드
        result = await graphqlRequest(CREATE_CONTENT_MUTATION, {
          input: inputData
        });
        console.log('Create result:', result);
      }

      const action = isEditMode ? '수정' : (saveStatus === 'PUBLISHED' ? '발행' : '임시저장');
      alert(`포스트가 ${action}되었습니다!`);
      router.push('/blog');
      
    } catch (error) {
      console.error('저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">블로그 글을 작성하려면 먼저 로그인해주세요.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 하기
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/blog')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← 블로그로 돌아가기
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {isEditMode ? '글 수정' : '새 글 쓰기'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => savePost('DRAFT')}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : (isEditMode ? '수정 저장' : '임시저장')}
              </button>
              <button
                onClick={() => savePost('PUBLISHED')}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '발행 중...' : (isEditMode ? '수정 발행' : '발행하기')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 에디터 영역 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* 제목 입력 */}
              <div className="p-6 border-b">
                <input
                  type="text"
                  placeholder="포스트 제목을 입력하세요..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold placeholder-gray-400 border-none outline-none resize-none"
                />
              </div>

              {/* Tiptap 에디터 */}
              <div className="min-h-[600px]">
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="글을 작성해보세요...

예시:
- 텍스트를 선택하고 포맷 버튼을 눌러보세요
- 링크를 추가하려면 링크 버튼을 클릭하세요
- 이미지를 추가하려면 이미지 버튼을 클릭하세요
- 코드 블록을 추가하려면 {} 버튼을 클릭하세요"
                />
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 발행 설정 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">발행 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상태
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="DRAFT">임시저장</option>
                    <option value="PUBLISHED">발행</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    placeholder="예: React, Next.js, 웹개발"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    태그 기능이 활성화되어 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO 설정 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">SEO 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    요약 (Excerpt)
                  </label>
                  <textarea
                    placeholder="포스트 요약을 입력하세요..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {excerpt.length}/160자
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표 이미지 URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* 미리보기 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">미리보기</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>제목:</strong> {title || '제목 없음'}</p>
                <p><strong>슬러그:</strong> {title ? generateSlug(title) : '자동 생성'}</p>
                <p><strong>읽기 시간:</strong> {content ? calculateReadingTime(content) : 0}분</p>
                <p><strong>단어 수:</strong> {content.length}자</p>
                <p><strong>상태:</strong> {status === 'DRAFT' ? '임시저장' : '발행'}</p>
              </div>
            </div>

            {/* 개발 정보 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">수정 완료</h4>
              <div className="text-xs text-green-700 space-y-1">
                <p>✅ GraphQL 필드명 수정</p>
                <p>✅ contentBody 필드 사용</p>
                <p>✅ 정확한 스키마 매칭</p>
                <p>✅ 저장/수정 기능 개선</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}