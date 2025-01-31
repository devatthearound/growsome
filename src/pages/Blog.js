import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const posts = [
    {
      id: 1,
      image: '/images/blog/posts/ai-prototyping/cover.jpg',
      category: 'AI Development',
      date: 'JAN 21, 2024',
      title: "What's in your stack: The state of tech tools in 2025",
      description: "The products people love, hate, and can't live without in 2025",
      author: {
        name: 'NOAM SEGAL',
        avatar: '/images/blog/authors/noam-segal.jpg'
      },
      readTime: '5 min read'
    },
    {
      id: 2,
      image: '/images/blog/posts/growth-tactics/cover.jpg',
      category: 'Growth',
      date: 'JAN 19, 2024',
      title: '10 growth tactics that never work | Elena Verna',
      description: 'Elena Verna shares 10 growth strategies that consistently fail',
      author: {
        name: 'ELENA VERNA',
        avatar: '/images/blog/authors/elena-verna.jpg'
      },
      readTime: '8 min read'
    },
    {
      id: 3,
      image: '/images/blog/posts/autopilot/cover.jpg',
      category: 'Productivity',
      date: 'JAN 16, 2024',
      title: 'How to break out of autopilot and create the life you want',
      description: 'Learn to break free from autopilot mode and design your ideal life',
      author: {
        name: 'GRAHAM WEAVER',
        avatar: '/images/blog/authors/graham-weaver.jpg'
      },
      readTime: '6 min read'
    }
  ];

  return (
    <BlogPage>
      <PageHeader
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1>Blog</h1>
        <p>AI 기술과 산업 동향에 대한 인사이트를 공유합니다</p>
      </PageHeader>

      <BlogGrid>
        {posts.map((post, index) => (
          <BlogCard
            key={post.id}
            as={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: index * 0.2 }}
          >
            <BlogImage>
              <img src={post.image} alt={post.title} />
              <Category>{post.category}</Category>
            </BlogImage>
            <BlogContent>
              <PostMeta>
                <PostDate>{post.date}</PostDate>
                <ReadTime>{post.readTime}</ReadTime>
              </PostMeta>
              <PostTitle>{post.title}</PostTitle>
              <PostDescription>{post.description}</PostDescription>
              <PostFooter>
                <Author>
                  <AuthorAvatar>
                    <img src={post.author.avatar} alt={post.author.name} />
                  </AuthorAvatar>
                  <AuthorName>{post.author.name}</AuthorName>
                </Author>
                <ReadMore to={`/blog/${post.id}`}>
                  Read more <FontAwesomeIcon icon={faArrowRight} />
                </ReadMore>
              </PostFooter>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </BlogPage>
  );
};

const BlogPage = styled.div`
  padding: 120px 0;
  background: #f8f9fa;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const BlogGrid = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const BlogCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const BlogImage = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Category = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(81, 79, 228, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const BlogContent = styled.div`
  padding: 2rem;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostDate = styled.span``;

const ReadTime = styled.span``;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const PostDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const ReadMore = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #514FE4;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

export default Blog;
