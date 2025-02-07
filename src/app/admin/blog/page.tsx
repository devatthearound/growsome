'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 마크다운 에디터를 클라이언트 사이드에서만 로드
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface BlogPost {
  id?: number;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
}

const BlogAdmin = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    description: '',
    content: '',
    thumbnail: '',
    tags: [],
    status: 'draft'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/blog', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('블로그 포스트 저장 실패');
      }

      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        content: '',
        thumbnail: '',
        tags: [],
        status: 'draft'
      });
      
      setIsEditing(false);
      fetchPosts(); // 목록 새로고침
    } catch (error) {
      console.error('블로그 포스트 저장 중 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      if (!response.ok) throw new Error('블로그 포스트 조회 실패');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('블로그 포스트 조회 중 에러:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AdminContainer>
      <Header>
        <h1>블로그 관리</h1>
        <NewPostButton onClick={() => setIsEditing(false)}>
          새 글 작성
        </NewPostButton>
      </Header>

      <ContentWrapper>
        <PostList>
          {posts.map(post => (
            <PostItem 
              key={post.id}
              onClick={() => {
                setSelectedPost(post);
                setFormData(post);
                setIsEditing(true);
              }}
            >
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <StatusBadge status={post.status}>
                  {post.status === 'published' ? '발행됨' : '임시저장'}
                </StatusBadge>
                <PostDate>
                  {post.publishedAt 
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : '미발행'}
                </PostDate>
              </PostMeta>
            </PostItem>
          ))}
        </PostList>

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
              <label>설명</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="글 설명을 입력하세요"
                required
              />
            </InputGroup>

            <InputGroup>
              <label>썸네일 URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="썸네일 이미지 URL을 입력하세요"
              />
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
              <label>내용</label>
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  content: value || ''
                }))}
                height={400}
              />
            </InputGroup>

            <ButtonGroup>
              <SaveButton type="submit">
                {isEditing ? '수정하기' : '저장하기'}
              </SaveButton>
              {isEditing && (
                <PublishButton
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      status: 'published'
                    }));
                  }}
                >
                  발행하기
                </PublishButton>
              )}
            </ButtonGroup>
          </form>
        </EditorSection>
      </ContentWrapper>
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

  input {
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

export default BlogAdmin; 