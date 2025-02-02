import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getContent } from '../../utils/content';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getContent('blog');
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BlogGrid>
      {posts.map(post => (
        <BlogCard key={post.slug}>
          {post.thumbnail && (
            <PostImage src={post.thumbnail} alt={post.title} />
          )}
          <PostContent>
            <PostTitle>{post.title}</PostTitle>
            <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
            <PostDescription>{post.description}</PostDescription>
            <ReadMore to={`/blog/${post.slug}`}>Read More</ReadMore>
          </PostContent>
        </BlogCard>
      ))}
    </BlogGrid>
  );
};

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const BlogCard = styled.article`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const PostDate = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostDescription = styled.p`
  color: #444;
  margin-bottom: 1.5rem;
`;

const ReadMore = styled(Link)`
  color: #514FE4;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default BlogList; 