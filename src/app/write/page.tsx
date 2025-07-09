'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Tiptap 에디터를 동적으로 로드 (SSR 문제 방지)
const TiptapEditor = dynamic(
  () => import('@/components/editor/TiptapEditor'),
  { ssr: false }
);

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);

  // 카테고리 목록 로드 및 수정 모드 확인
  useEffect(() => {
    fetchCategories();
    
    // URL 파라미터에서 edit 값 확인
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      setIsEditMode(true);
      setEditPostId(editId);
      fetchPostForEdit(editId);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  // 수정을 위한 포스트 로드
  const fetchPostForEdit = async (postId: string) => {
    try {
      setIsLoading(true);
      // status 제한 없이 모든 포스트 로드 가능하도록 API 수정 필요
      const response = await fetch(`/api/blog/posts/${postId}?includeAll=true`);
      
      if (response.ok) {
        const data = await response.json();
        const post = data.post;
        
        // 데이터 설정
        setTitle(post.title || '');
        setContent(post.content || '');
        setExcerpt(post.excerpt || '');
        setSelectedCategory(post.category_id || '');
        setTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
        setFeaturedImage(post.featured_image || '');
        setStatus(post.status || 'draft');
      } else {
        alert('포스트를 불러오는데 실패했습니다.');
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

  // 슬러그 생성 함수
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // 읽기 시간 계산 함수
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/[^\w\s가-힣]/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // 포스트 저장 (새로 작성 또는 수정)
  const savePost = async (saveStatus: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);

    try {
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const postData = {
        title: title.trim(),
        slug,
        content,
        excerpt: excerpt.trim() || content.substring(0, 150) + '...',
        category_id: selectedCategory || null,
        tags: tagsArray,
        featured_image: featuredImage.trim() || null,
        status: saveStatus,
        reading_time: readingTime,
        featured: false,
        allow_comments: true,
        seo_title: title.trim(),
        seo_description: excerpt.trim() || content.substring(0, 160),
        meta_keywords: tagsArray
      };

      let response;
      if (isEditMode && editPostId) {
        // 수정 모드
        response = await fetch(`/api/blog/posts/${editPostId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      } else {
        // 새로 작성 모드
        response = await fetch('/api/blog/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      }

      const data = await response.json();

      if (data.success) {
        const action = isEditMode ? '수정' : (
saveStatus === 'published' ? '발행' : '임시저장');
        alert(`포스트가 ${action}되었습니다!`);
        router.push('/blog');
      } else {
        alert('저장 실패: ' + data.error);
      }
    } catch (error) {
      console.error('저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <h1 className="text-xl font-bold text-gray-800">{isEditMode ? '글 수정' : '새 글 쓰기'}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => savePost('draft')}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : (isEditMode ? '수정 저장' : '임시저장')}
              </button>
              <button
                onClick={() => savePost('published')}
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
- 링크를 추가하려면 텍스트를 선택하고 링크 버튼을 클릭하세요
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
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="draft">임시저장</option>
                    <option value="published">발행</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
