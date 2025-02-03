import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Blog = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const posts = [
    {
      id: 1,
      image: '/images/blog/posts/ai-prototyping/cover.jpg',
      date: 'JAN 21',
      title: "What's in your stack: The state of tech tools in 2025",
      description: "The products people love, hate, and can't live without in 2025",
      author: {
        name: 'NOAM SEGAL',
        avatar: '/images/blog/authors/noam-segal.jpg'
      }
    },
    {
      id: 2,
      image: '/images/blog/posts/growth-tactics/cover.jpg',
      date: 'JAN 19',
      title: '10 growth tactics that never work | Elena Verna',
      description: 'Elena Verna shares 10 growth strategies that consistently fail',
      author: {
        name: 'ELENA VERNA',
        avatar: '/images/blog/authors/elena-verna.jpg'
      }
    },
    {
      id: 3,
      image: '/images/blog/posts/autopilot/cover.jpg',
      date: 'JAN 16',
      title: 'How to break out of autopilot and create the life you want',
      description: 'Learn to break free from autopilot mode and design your ideal life',
      author: {
        name: 'GRAHAM WEAVER',
        avatar: '/images/blog/authors/graham-weaver.jpg'
      }
    }
  ];

  return (
    <BlogSection id="blog">
      <Container>
        <SectionHeader
          as={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <SectionTag>Blog</SectionTag>
          <h2>AI 트렌드와 인사이트</h2>
          <Description>최신 AI 기술과 산업 동향을 공유합니다</Description>
        </SectionHeader>

        <BlogGrid>
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              as={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <BlogImage>
                <Image src={post.image} alt={post.title} width={300} height={200} />
              </BlogImage>
              <BlogContent>
                <PostDate>{post.date}</PostDate>
                <PostTitle>{post.title}</PostTitle>
                <PostDescription>{post.description}</PostDescription>
                <BlogMeta>
                  <Author>
                    <AuthorAvatar>
                      <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} />
                    </AuthorAvatar>
                    <AuthorName>{post.author.name}</AuthorName>
                  </Author>
                  <ReadMore href={`/blog/${post.id}`}>
                    Read more <FontAwesomeIcon icon={faArrowRight} />
                  </ReadMore>
                </BlogMeta>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>

        <ViewAllButton href="/blog">
          전체 글 보기 <FontAwesomeIcon icon={faArrowRight} />
        </ViewAllButton>
      </Container>
    </BlogSection>
  );
};

const BlogSection = styled.section`
  padding: 8rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const SectionTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(81, 79, 228, 0.1);
  color: #514FE4;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.article`
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
  aspect-ratio: 16 / 9;
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

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const PostDate = styled.time`
  color: #666;
  font-size: 0.9rem;
`;

const PostTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const PostDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
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
  color: #333;
`;

const ReadMore = styled.a`
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

const ViewAllButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 4rem;
  padding: 1rem 2rem;
  background: #514FE4;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);

    svg {
      transform: translateX(5px);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

export default Blog;
