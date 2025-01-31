import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // 블로그 포스트 데이터 (실제로는 API나 데이터베이스에서 가져올 것)
  const postData = {
    1: {
      title: "What's in your stack: The state of tech tools in 2025",
      category: 'AI Development',
      date: 'JAN 21, 2024',
      author: {
        name: 'NOAM SEGAL',
        avatar: '/images/blog/authors/noam-segal.jpg',
        bio: 'AI Research Engineer at OpenAI'
      },
      readTime: '5 min read',
      heroImage: '/images/blog/posts/ai-prototyping/hero.jpg',
      content: [
        {
          type: 'paragraph',
          text: '2025년, 기술 스택은 더욱 복잡해지고 있습니다. AI와 클라우드 기술의 발전으로 개발자들이 사용하는 도구도 크게 변화했습니다.'
        },
        {
          type: 'heading',
          text: 'AI 개발 도구의 진화'
        },
        {
          type: 'paragraph',
          text: '머신러닝 모델 개발부터 배포까지, 전체 파이프라인을 자동화하는 도구들이 등장했습니다. 특히 AutoML 도구들의 성능이 크게 향상되어, 비전문가도 고성능 AI 모델을 만들 수 있게 되었습니다.'
        },
        {
          type: 'image',
          url: '/images/blog/posts/ai-prototyping/tools.jpg',
          caption: '2025년 주요 AI 개발 도구들'
        },
        {
          type: 'heading',
          text: '클라우드 네이티브 개발의 대중화'
        },
        {
          type: 'paragraph',
          text: '쿠버네티스와 서버리스 아키텍처의 결합으로, 클라우드 네이티브 개발이 표준이 되었습니다. 개발자들은 인프라 관리보다 비즈니스 로직에 더 집중할 수 있게 되었습니다.'
        }
      ]
    }
    // 다른 포스트 데이터도 추가
  };

  const post = postData[id];

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <BlogPostPage>
      <Hero
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <HeroContent>
          <Category>{post.category}</Category>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <Author>
              <AuthorAvatar>
                <img src={post.author.avatar} alt={post.author.name} />
              </AuthorAvatar>
              <AuthorInfo>
                <AuthorName>{post.author.name}</AuthorName>
                <AuthorBio>{post.author.bio}</AuthorBio>
              </AuthorInfo>
            </Author>
            <PostInfo>
              <PostDate>{post.date}</PostDate>
              <ReadTime>{post.readTime}</ReadTime>
            </PostInfo>
          </PostMeta>
        </HeroContent>
      </Hero>

      <HeroImage>
        <img src={post.heroImage} alt={post.title} />
      </HeroImage>

      <Content>
        {post.content.map((block, index) => {
          switch (block.type) {
            case 'paragraph':
              return (
                <Paragraph
                  key={index}
                  as={motion.p}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  {block.text}
                </Paragraph>
              );
            case 'heading':
              return (
                <ContentHeading
                  key={index}
                  as={motion.h2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  {block.text}
                </ContentHeading>
              );
            case 'image':
              return (
                <ContentImage
                  key={index}
                  as={motion.div}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <img src={block.url} alt={block.caption} />
                  {block.caption && <ImageCaption>{block.caption}</ImageCaption>}
                </ContentImage>
              );
            default:
              return null;
          }
        })}
      </Content>
    </BlogPostPage>
  );
};

const BlogPostPage = styled.div`
  background: #f8f9fa;
`;

const Hero = styled.div`
  background: #514FE4;
  color: white;
  padding: 120px 0 60px;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Category = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.2;
`;

const PostMeta = styled.div`
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const AuthorBio = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const PostInfo = styled.div`
  text-align: right;
`;

const PostDate = styled.div`
  margin-bottom: 0.2rem;
`;

const ReadTime = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const HeroImage = styled.div`
  width: 100%;
  height: 500px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
`;

const ContentHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 3rem 0 1.5rem;
  color: #333;
`;

const ContentImage = styled.div`
  margin: 3rem 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: auto;
  }
`;

const ImageCaption = styled.div`
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

export default BlogPost;
