'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import CategoryModal from './CategoryModal';
import MDEditor, { commands } from '@uiw/react-md-editor';

interface BlogPost {
  id?: number;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at?: string;
  excerpt: string;
  featured_image: string;
  category_id: number;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published';
  seo_title: string;
  seo_description: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

const BlogAdmin = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tempImages, setTempImages] = useState<{ file: File; preview: string }[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: null,
    category_id: '',
    tags: [],
    status: 'draft',
    seo_title: '',
    seo_description: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleTempImageUpload = async (file: File): Promise<string> => {
    try {
      const preview = URL.createObjectURL(file);
      setTempImages(prev => [...prev, { file, preview }]);
      return preview;
    } catch (error) {
      console.error('임시 이미지 처리 중 에러:', error);
      throw new Error('이미지 처리에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let content = formData.content;
      if (tempImages.length > 0) {
        const uploadedUrls = await uploadImagesToS3();
        
        Object.entries(uploadedUrls).forEach(([preview, s3Url]) => {
          content = content.replace(new RegExp(preview, 'g'), s3Url);
        });
      }

      const postData = {
        ...formData,
        content,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        ...(isEditing && selectedPost ? { id: selectedPost.id } : {})
      };

      const response = await fetch('/api/admin/blog', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('블로그 포스트 저장 실패');
      }

      alert(isEditing ? '포스트가 수정되었습니다.' : '포스트가 저장되었습니다.');
      
      tempImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setTempImages([]);
      
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        featured_image: null,
        category_id: '',
        tags: [],
        status: 'draft',
        seo_title: '',
        seo_description: ''
      });
      
      setIsEditing(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (error: any) {
      console.error('블로그 포스트 저장 중 에러:', error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
    }
  };

  const handlePublish = async () => {
    try {
      const postData = {
        ...formData,
        status: 'published',  // 상태를 published로 변경
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        ...(isEditing && selectedPost ? { id: selectedPost.id } : {})
      };

      const response = await fetch('/api/admin/blog', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '블로그 포스트 발행 실패');
      }

      alert('포스트가 발행되었습니다.');
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        featured_image: null,
        category_id: '',
        tags: [],
        status: 'draft',
        seo_title: '',
        seo_description: ''
      });
      
      setIsEditing(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (error: any) {
      console.error('블로그 포스트 발행 중 에러:', error);
      alert(error.message || '발행 중 오류가 발생했습니다.');
    }
  };

  const handlePostSelect = (post: BlogPost) => {
    console.log('Selected post:', post);
    setSelectedPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || null,
      category_id: post.category_id ? String(post.category_id) : '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      status: post.status || 'draft',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || ''
    });
    setIsEditing(true);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '포스트 목록을 불러오는데 실패했습니다.');
      }

      console.log('Fetched posts:', data.posts); // 디버깅용
      setPosts(data.posts);
    } catch (error) {
      console.error('포스트 목록 조회 중 에러:', error);
      alert('포스트 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('카테고리 조회 실패');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('카테고리 조회 중 에러:', error);
    }
  };

  const uploadImagesToS3 = async () => {
    const uploadedUrls: { [key: string]: string } = {};
    
    for (const { file, preview } of tempImages) {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드 실패');
      }

      const { imageUrl } = await response.json();
      uploadedUrls[preview] = imageUrl;
    }

    return uploadedUrls;
  };

  // 마크다운 에디터 이미지 업로드 커맨드
  const imageUploadCommand = {
    name: 'image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': '이미지 추가' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"/>
      </svg>
    ),
    execute: async (state: { selectedText: string }, api: any) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const previewUrl = await handleTempImageUpload(file);
          const imageMarkdown = `![${file.name}](${previewUrl})`;
          
          const newState = api.replaceSelection(imageMarkdown);
          api.setSelectionRange({
            start: newState.selection.start + imageMarkdown.length,
            end: newState.selection.start + imageMarkdown.length,
          });
        } catch (error) {
          alert('이미지 처리에 실패했습니다.');
        }
      };

      input.click();
    },
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // 이미지 정리를 위한 cleanup useEffect
  useEffect(() => {
    return () => {
      tempImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [tempImages]); // tempImages를 의존성 배열에 추가

  // 카테고리별 필터링된 포스트 목록
  const filteredPosts = posts.filter(post => 
    selectedCategory === 'all' || 
    post.category_id === parseInt(selectedCategory)
  );

  return (
    <AdminContainer>
      <Header>
        <h1>블로그 관리</h1>
        <ButtonGroup>
          <NewPostButton onClick={() => {
            setIsEditing(false);
            setSelectedPost(null);
            setFormData({
              title: '',
              content: '',
              excerpt: '',
              featured_image: null,
              category_id: '',
              tags: [],
              status: 'draft',
              seo_title: '',
              seo_description: ''
            });
          }}>
            새 글 작성
          </NewPostButton>
          <CategoryButton onClick={() => setShowCategoryModal(true)}>
            카테고리 관리
          </CategoryButton>
        </ButtonGroup>
      </Header>

      <ContentWrapper>
        <SidebarSection>
          <CategoryFilter>
            <label>카테고리 필터</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체 보기</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </CategoryFilter>

          <PostList>
            {filteredPosts.map(post => (
              <PostItem 
                key={post.id}
                onClick={() => handlePostSelect(post)}
              >
                {post.featured_image && (
                  <PostThumbnail 
                    src={post.featured_image} 
                    alt={post.title}
                  />
                )}
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                  <StatusBadge status={post.status}>
                    {post.status === 'published' ? '발행됨' : '임시저장'}
                  </StatusBadge>
                  <PostDate>
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString()
                      : '미발행'}
                  </PostDate>
                </PostMeta>
              </PostItem>
            ))}
          </PostList>
        </SidebarSection>

        <EditorSection>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <label>제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"
                required
              />
            </InputGroup>

            <InputGroup>
              <label>발췌문</label>
              <input
                type="text"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="글 요약을 입력하세요"
              />
            </InputGroup>

            <InputGroup>
              <label>대표 이미지</label>
              <ImageUploadContainer>
                <ImagePreviewWrapper>
                  {(imagePreview || formData.featured_image) && (
                    <ImagePreview 
                      src={imagePreview || formData.featured_image || ''} 
                      alt="미리보기"
                    />
                  )}
                </ImagePreviewWrapper>
                <UploadButton
                  type="button"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  이미지 {formData.featured_image ? '변경' : '업로드'}
                </UploadButton>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleTempImageUpload(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </ImageUploadContainer>
            </InputGroup>

            <InputGroup>
              <label>카테고리</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup>
              <label>태그 (쉼표로 구분)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="태그1, 태그2, 태그3"
              />
            </InputGroup>

            <InputGroup>
              <label>SEO 제목</label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleInputChange}
                placeholder="SEO 제목을 입력하세요"
              />
            </InputGroup>

            <InputGroup>
              <label>SEO 설명</label>
              <input
                type="text"
                name="seo_description"
                value={formData.seo_description}
                onChange={handleInputChange}
                placeholder="SEO 설명을 입력하세요"
              />
            </InputGroup>

            <InputGroup>
              <label>내용</label>
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  content: value || ''
                }))}
                height={400}
                commands={[
                  ...commands.getCommands(),
                  imageUploadCommand
                ]}
                extraCommands={[]}
              />
            </InputGroup>

            <ButtonGroup>
              <SaveButton type="submit">
                {isEditing ? '수정하기' : '저장하기'}
              </SaveButton>
              {isEditing && (
                <PublishButton
                  type="button"
                  onClick={handlePublish}
                >
                  발행하기
                </PublishButton>
              )}
            </ButtonGroup>
          </form>
        </EditorSection>
      </ContentWrapper>

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCategoryChange={fetchCategories}
          categories={categories}
        />
      )}
    </AdminContainer>
  );
};

const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const PostList = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  height: calc(100vh - 150px);
  overflow-y: auto;
`;

const PostItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }
`;

const PostTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #333;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => props.status === 'published' ? '#4CAF50' : '#FFC107'};
  color: ${props => props.status === 'published' ? 'white' : '#333'};
`;

const PostDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const EditorSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #514FE4;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const NewPostButton = styled(Button)`
  background: #514FE4;
  color: white;

  &:hover {
    background: #4340c0;
  }
`;

const SaveButton = styled(Button)`
  background: #514FE4;
  color: white;

  &:hover {
    background: #4340c0;
  }
`;

const PublishButton = styled(Button)`
  background: #4CAF50;
  color: white;

  &:hover {
    background: #388E3C;
  }
`;

const CategoryButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover {
    background: #5a6268;
  }
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryFilter = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #514FE4;
    }
  }
`;

const PostThumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ImagePreviewWrapper = styled.div`
  width: 150px;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadButton = styled.button`
  padding: 0.5rem 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #4340c0;
  }
`;

export default BlogAdmin; 