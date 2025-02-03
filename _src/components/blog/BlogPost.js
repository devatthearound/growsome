import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getContentBySlug } from '../../utils/content';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getContentBySlug('blog', slug);
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <PostContainer>
      {post.thumbnail && (
        <PostImage src={post.thumbnail} alt={post.title} />
      )}
      <PostContent>
        <PostTitle>{post.title}</PostTitle>
        <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
        <PostBody>
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </PostBody>
        {post.tags && (
          <TagList>
            {post.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagList>
        )}
      </PostContent>
    </PostContainer>
  );
};

const PostContainer = styled.article`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const PostImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;

const PostContent = styled.div`
  margin-top: 2rem;
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PostDate = styled.div`
  color: #666;
  margin-bottom: 2rem;
`;

const PostBody = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  
  h1, h2, h3 {
    margin: 2rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  img {
    max-width: 100%;
    border-radius: 4px;
  }
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Tag = styled.span`
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
`;

export default BlogPost; 