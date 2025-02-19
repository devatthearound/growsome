'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import { useParams } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  featured_image: string;
  category_id: number;
  category_name?: string;
  tags: string[];
  published_at: string;
  author?: {
    name: string;
    avatar?: string;
  };
  seo_title: string;
  seo_description: string;
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'table';
  text?: string;
  url?: string;
  caption?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

// 클라이언트 컴포넌트로 분리
export default function BlogPostContent(){
  const params = useParams();
  const { id } = params;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [parsedContent, setParsedContent] = useState<ContentBlock[]>([]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${id}`);
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error('포스트 로딩 중 에러:', error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post?.content) {
      const blocks = post.content.split('\n\n').map(block => {
        // 이미지 처리
        if (block.match(/!\[.*?\]\(.*?\)/)) {
          const captionMatch = block.match(/\[(.*?)\]/);
          const urlMatch = block.match(/\((.*?)\)/);
          return {
            type: 'image',
            caption: captionMatch ? captionMatch[1] : '',
            url: urlMatch ? urlMatch[1] : '',
          };
        }
        // 테이블 처리
        else if (block.includes('|')) {
          const lines = block.split('\n').filter(line => line.trim());
          if (lines.length >= 2) {
            const headers = lines[0]
              .split('|')
              .filter(cell => cell.trim())
              .map(cell => cell.trim());
            
            const rows = lines.slice(2) // 구분선 제외
              .map(row => row
                .split('|')
                .filter(cell => cell.trim())
                .map(cell => cell.trim())
              );

            return {
              type: 'table',
              tableData: {
                headers,
                rows
              }
            };
          }
        }
        // 제목 처리 수정
        else if (block.trim().startsWith('**') || block.trim().match(/^#+\s/)) {
          return {
            type: 'heading',
            text: block.trim()
              .replace(/^\*\*|\*\*$/g, '') // ** 제거
              .replace(/^#+\s/, '')        // '#' 기호 제거
              .trim()
          };
        }
        // 일반 텍스트 처리
        else if (block.trim()) {
          return {
            type: 'paragraph',
            text: block.trim()
          };
        }
        return null;
      }).filter(Boolean);

      setParsedContent(blocks as ContentBlock[]);
    }
  }, [post]);

  if (!post) {
    return <div>불러오는중</div>;
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
          <Category>{post.category_name}</Category>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <Author>
              <AuthorAvatar>
                <img src={post.author?.avatar} alt={post.author?.name} />
              </AuthorAvatar>
              <AuthorInfo>
                <AuthorName>{post.author?.name}</AuthorName>
                {/* <AuthorBio>{post.author?.bio}</AuthorBio> */}
              </AuthorInfo>
            </Author>
            <PostInfo>
              <PostDate>{post.published_at}</PostDate>
              {/* <ReadTime>{post.readTime}</ReadTime> */}
            </PostInfo>
          </PostMeta>
        </HeroContent>
      </Hero>

      {
        post.featured_image && (
          <HeroImage>
            <img src={post.featured_image} alt={post.title} />
          </HeroImage>
        )
      }

      <Content>
        {parsedContent.map((block, index) => {
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
            case 'table':
              return (
                <TableWrapper
                  key={index}
                  as={motion.div}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <Table>
                    <thead>
                      <tr>
                        {block.tableData?.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.tableData?.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              );
            default:
              return null;
          }
        })}
      </Content>
    </BlogPostPage>
  );
};

// // 서버 컴포넌트에서 클라이언트 컴포넌트로 변경
// export default async function BlogPost({
//   params,
// }: {
//     params: Promise<{ id: string }>
// }) {
//     const { id } = await params;

//   if (!id) {
//     return <div>게시물을 찾을 수 없습니다</div>;
//   }

//   return <BlogPostContent id={id} />;
// }

const ContentWrapper = styled.div`
  margin: 2rem 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;

  h1, h2, h3, h4, h5, h6 {
    margin: 2rem 0 1rem;
    color: #222;
  }

  p {
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    border-radius: 4px;
    margin: 1.5rem 0;
  }

  code {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
`;

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

const TableWrapper = styled.div`
  margin: 2rem 0;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;
