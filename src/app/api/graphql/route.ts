// Apollo Server + Prisma 기반 GraphQL API Route (개선된 버전)
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

// Prisma 클라이언트 사용 (개선된 설정)
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// GraphQL 스키마 (Prisma 모델명과 정확히 매칭)
const typeDefs = `
  scalar DateTime
  scalar JSON

  type Query {
    hello: String!
    version: String!
    
    # Category 쿼리들 (blog_categories 테이블)
    categories(isVisible: Boolean): [Category!]!
    category(id: Int, slug: String): Category
    
    # Content 쿼리들 (blog_contents 테이블)
    contents(first: Int = 10, categoryId: Int, status: String = "PUBLISHED"): [Content!]!
    content(id: Int, slug: String): Content
    featuredContents(limit: Int = 5): [Content!]!
    heroContent: Content
    
    # User 쿼리들 (users 테이블)
    user(id: Int): User
    users(limit: Int = 10): [User!]!
    
    # Tags 쿼리들 (blog_tags 테이블)
    tags: [Tag!]!
    tag(id: Int, slug: String): Tag
    
    # Comments 쿼리들 (blog_comments 테이블)
    comments(contentId: Int!): [Comment!]!
  }

  type Mutation {
    # Content 생성/수정/삭제
    createContent(input: CreateContentInput!): Content!
    updateContent(id: Int!, input: UpdateContentInput!): Content!
    deleteContent(id: Int!): Boolean!
    
    # Category 생성/수정/삭제
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: Int!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: Int!): Boolean!
    
    # Comment 생성/수정/삭제
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: Int!, input: UpdateCommentInput!): Comment!
    deleteComment(id: Int!): Boolean!
    
    # Like 토글
    toggleLike(contentId: Int!, userId: Int!): LikeResult!
  }

  # Category 타입 (blog_categories 테이블 매핑)
  type Category {
    id: Int!
    slug: String!
    name: String!
    description: String
    isVisible: Boolean!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    contentCount: Int!
    contents: [Content!]!
  }

  # Content 타입 (blog_contents 테이블 매핑)
  type Content {
    id: Int!
    slug: String!
    title: String!
    contentBody: String!
    excerpt: String
    authorId: Int!
    categoryId: Int
    status: String!
    isFeatured: Boolean!
    isHero: Boolean!
    thumbnailUrl: String
    viewCount: Int!
    likeCount: Int!
    commentCount: Int!
    metaTitle: String
    metaDescription: String
    createdAt: DateTime!
    updatedAt: DateTime!
    publishedAt: DateTime
    
    # Relations
    author: User!
    category: Category!
    comments: [Comment!]!
    tags: [Tag!]!
    likes: [Like!]!
  }

  # User 타입 (users 테이블 매핑)
  type User {
    id: Int!
    username: String!
    email: String!
    avatar: String
    companyName: String
    position: String
    phoneNumber: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    contents: [Content!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  # Tag 타입 (blog_tags 테이블 매핑)
  type Tag {
    id: Int!
    name: String!
    slug: String!
    contents: [Content!]!
  }

  # Comment 타입 (blog_comments 테이블 매핑)
  type Comment {
    id: Int!
    contentId: Int!
    userId: Int!
    parentId: Int
    body: String!
    isApproved: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    content: Content!
    user: User!
    parent: Comment
    replies: [Comment!]!
  }

  # Like 타입 (blog_likes 테이블 매핑)
  type Like {
    id: Int!
    contentId: Int!
    userId: Int!
    createdAt: DateTime!
    
    # Relations
    content: Content!
    user: User!
  }

  # Input 타입들
  input CreateContentInput {
    title: String!
    slug: String!
    contentBody: String!
    authorId: Int!
    categoryId: Int
    status: String = "DRAFT"
    isFeatured: Boolean = false
    isHero: Boolean = false
    thumbnailUrl: String
    metaTitle: String
    metaDescription: String
    tags: [String!]
  }

  input UpdateContentInput {
    title: String
    slug: String
    contentBody: String
    categoryId: Int
    status: String
    isFeatured: Boolean
    isHero: Boolean
    thumbnailUrl: String
    metaTitle: String
    metaDescription: String
    tags: [String!]
  }

  input CreateCategoryInput {
    slug: String!
    name: String!
    description: String
    isVisible: Boolean = true
    sortOrder: Int = 0
  }

  input UpdateCategoryInput {
    slug: String
    name: String
    description: String
    isVisible: Boolean
    sortOrder: Int
  }

  input CreateCommentInput {
    contentId: Int!
    userId: Int!
    parentId: Int
    body: String!
  }

  input UpdateCommentInput {
    body: String
    isApproved: Boolean
  }

  # Result 타입들
  type LikeResult {
    success: Boolean!
    isLiked: Boolean!
    likeCount: Int!
  }
`

// 리졸버 (Prisma 모델명과 정확히 매칭)
const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL Blog with Prisma!',
    version: () => '4.0.0',
    
    // Category 리졸버들
    categories: async (_, { isVisible }) => {
      try {
        const where = isVisible !== undefined ? { is_visible: isVisible } : {}
        
        const categories = await prisma.blog_categories.findMany({
          where,
          orderBy: { sort_order: 'asc' }
        })
        
        return categories.map(transformCategory)
      } catch (error) {
        console.error('Categories resolver error:', error)
        throw new Error(`카테고리를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    category: async (_, { id, slug }) => {
      try {
        if (!id && !slug) {
          throw new Error('Either id or slug must be provided')
        }
        
        const where = id ? { id } : { slug }
        
        const category = await prisma.blog_categories.findFirst({ where })
        
        return category ? transformCategory(category) : null
      } catch (error) {
        console.error('Category resolver error:', error)
        throw new Error(`카테고리를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    // Content 리졸버들
    contents: async (_, { first = 10, categoryId, status = 'PUBLISHED' }) => {
      try {
        const where: any = { status: status.toUpperCase() }
        if (categoryId) {
          where.category_id = categoryId
        }
        
        const contents = await prisma.blog_contents.findMany({
          where,
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          },
          orderBy: { published_at: 'desc' },
          take: first
        })
        
        return contents.map(transformContent)
      } catch (error) {
        console.error('Contents resolver error:', error)
        throw new Error(`컨텐츠를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    content: async (_, { id, slug }) => {
      try {
        if (!id && !slug) {
          throw new Error('Either id or slug must be provided')
        }
        
        const where = id ? { id } : { slug }
        
        const content = await prisma.blog_contents.findFirst({
          where,
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            },
            blog_comments: {
              where: { is_approved: true },
              include: {
                users: true
              },
              orderBy: { created_at: 'desc' }
            }
          }
        })
        
        // 조회수 증가
        if (content) {
          await prisma.blog_contents.update({
            where: { id: content.id },
            data: { view_count: { increment: 1 } }
          })
        }
        
        return content ? transformContent(content) : null
      } catch (error) {
        console.error('Content resolver error:', error)
        throw new Error(`컨텐츠를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    featuredContents: async (_, { limit = 5 }) => {
      try {
        const contents = await prisma.blog_contents.findMany({
          where: {
            status: 'PUBLISHED',
            is_featured: true
          },
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          },
          orderBy: { published_at: 'desc' },
          take: limit
        })
        
        return contents.map(transformContent)
      } catch (error) {
        console.error('Featured contents resolver error:', error)
        throw new Error(`추천 컨텐츠를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    heroContent: async () => {
      try {
        const content = await prisma.blog_contents.findFirst({
          where: {
            status: 'PUBLISHED',
            is_hero: true
          },
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          },
          orderBy: { published_at: 'desc' }
        })
        
        return content ? transformContent(content) : null
      } catch (error) {
        console.error('Hero content resolver error:', error)
        return null
      }
    },
    
    // User 리졸버들
    user: async (_, { id }) => {
      try {
        if (!id) {
          throw new Error('User id must be provided')
        }
        
        const user = await prisma.user.findFirst({
          where: { id }
        })
        
        return user ? transformUser(user) : null
      } catch (error) {
        console.error('User resolver error:', error)
        throw new Error(`사용자를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    users: async (_, { limit = 10 }) => {
      try {
        const users = await prisma.user.findMany({
          where: { status: 'active' },
          orderBy: { created_at: 'desc' },
          take: limit
        })
        
        return users.map(transformUser)
      } catch (error) {
        console.error('Users resolver error:', error)
        throw new Error(`사용자 목록을 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    // Tags 리졸버들
    tags: async () => {
      try {
        const tags = await prisma.blog_tags.findMany({
          orderBy: { name: 'asc' }
        })
        
        return tags.map(transformTag)
      } catch (error) {
        console.error('Tags resolver error:', error)
        throw new Error(`태그를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    tag: async (_, { id, slug }) => {
      try {
        if (!id && !slug) {
          throw new Error('Either id or slug must be provided')
        }
        
        const where = id ? { id } : { slug }
        
        const tag = await prisma.blog_tags.findFirst({ where })
        
        return tag ? transformTag(tag) : null
      } catch (error) {
        console.error('Tag resolver error:', error)
        throw new Error(`태그를 불러오는데 실패했습니다: ${error.message}`)
      }
    },
    
    // Comments 리졸버들
    comments: async (_, { contentId }) => {
      try {
        const comments = await prisma.blog_comments.findMany({
          where: {
            content_id: contentId,
            is_approved: true,
            parent_id: null // 최상위 댓글만
          },
          include: {
            users: true,
            other_blog_comments: {
              include: {
                users: true
              },
              orderBy: { created_at: 'asc' }
            }
          },
          orderBy: { created_at: 'desc' }
        })
        
        return comments.map(transformComment)
      } catch (error) {
        console.error('Comments resolver error:', error)
        throw new Error(`댓글을 불러오는데 실패했습니다: ${error.message}`)
      }
    }
  },

  Mutation: {
    // Content Mutations
    createContent: async (_, { input }) => {
      try {
        const result = await prisma.$transaction(async (tx) => {
          // 1. 컨텐츠 생성
          const newContent = await tx.blog_contents.create({
            data: {
              slug: input.slug,
              title: input.title,
              content_body: input.contentBody,
              author_id: input.authorId,
              category_id: input.categoryId || 1, // categoryId가 없으면 기본 카테고리 사용
              status: input.status || 'DRAFT',
              is_featured: input.isFeatured || false,
              is_hero: input.isHero || false,
              thumbnail_url: input.thumbnailUrl,
              meta_title: input.metaTitle || input.title,
              meta_description: input.metaDescription,
              published_at: input.status === 'PUBLISHED' ? new Date() : null,
              view_count: 0,
              like_count: 0,
              comment_count: 0
            },
            include: {
              users: true,
              blog_categories: true
            }
          })
          
          // 2. 태그 처리
          if (input.tags && input.tags.length > 0) {
            for (const tagName of input.tags) {
              // 태그가 없으면 생성
              let tag = await tx.blog_tags.findFirst({
                where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') }
              })
              
              if (!tag) {
                tag = await tx.blog_tags.create({
                  data: {
                    name: tagName,
                    slug: tagName.toLowerCase().replace(/\s+/g, '-')
                  }
                })
              }
              
              // 컨텐츠-태그 연결
              await tx.blog_content_tags.create({
                data: {
                  content_id: newContent.id,
                  tag_id: tag.id
                }
              })
            }
          }
          
          return newContent
        })
        
        return transformContent(result)
      } catch (error) {
        console.error('Create content error:', error)
        throw new Error(`컨텐츠 생성에 실패했습니다: ${error.message}`)
      }
    },
    
    updateContent: async (_, { id, input }) => {
      try {
        const updateData: any = {
          updated_at: new Date()
        }
        
        if (input.title !== undefined) updateData.title = input.title
        if (input.slug !== undefined) updateData.slug = input.slug
        if (input.contentBody !== undefined) updateData.content_body = input.contentBody
        if (input.categoryId !== undefined) updateData.category_id = input.categoryId || 1
        if (input.status !== undefined) {
          updateData.status = input.status.toUpperCase()
          if (input.status.toUpperCase() === 'PUBLISHED') {
            updateData.published_at = new Date()
          }
        }
        if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured
        if (input.isHero !== undefined) updateData.is_hero = input.isHero
        if (input.thumbnailUrl !== undefined) updateData.thumbnail_url = input.thumbnailUrl
        if (input.metaTitle !== undefined) updateData.meta_title = input.metaTitle
        if (input.metaDescription !== undefined) updateData.meta_description = input.metaDescription
        
        const updatedContent = await prisma.blog_contents.update({
          where: { id },
          data: updateData,
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          }
        })
        
        return transformContent(updatedContent)
      } catch (error) {
        console.error('Update content error:', error)
        throw new Error(`컨텐츠 수정에 실패했습니다: ${error.message}`)
      }
    },
    
    deleteContent: async (_, { id }) => {
      try {
        await prisma.blog_contents.delete({
          where: { id }
        })
        return true
      } catch (error) {
        console.error('Delete content error:', error)
        throw new Error(`컨텐츠 삭제에 실패했습니다: ${error.message}`)
      }
    },
    
    // Category Mutations
    createCategory: async (_, { input }) => {
      try {
        const newCategory = await prisma.blog_categories.create({
          data: {
            slug: input.slug,
            name: input.name,
            description: input.description,
            is_visible: input.isVisible !== undefined ? input.isVisible : true,
            sort_order: input.sortOrder || 0
          }
        })
        
        return transformCategory(newCategory)
      } catch (error) {
        console.error('Create category error:', error)
        throw new Error(`카테고리 생성에 실패했습니다: ${error.message}`)
      }
    },
    
    updateCategory: async (_, { id, input }) => {
      try {
        const updateData: any = { updated_at: new Date() }
        
        if (input.slug !== undefined) updateData.slug = input.slug
        if (input.name !== undefined) updateData.name = input.name
        if (input.description !== undefined) updateData.description = input.description
        if (input.isVisible !== undefined) updateData.is_visible = input.isVisible
        if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder
        
        const updatedCategory = await prisma.blog_categories.update({
          where: { id },
          data: updateData
        })
        
        return transformCategory(updatedCategory)
      } catch (error) {
        console.error('Update category error:', error)
        throw new Error(`카테고리 수정에 실패했습니다: ${error.message}`)
      }
    },
    
    deleteCategory: async (_, { id }) => {
      try {
        await prisma.blog_categories.delete({
          where: { id }
        })
        return true
      } catch (error) {
        console.error('Delete category error:', error)
        throw new Error(`카테고리 삭제에 실패했습니다: ${error.message}`)
      }
    },
    
    // Comment Mutations
    createComment: async (_, { input }) => {
      try {
        const newComment = await prisma.blog_comments.create({
          data: {
            content_id: input.contentId,
            user_id: input.userId,
            parent_id: input.parentId,
            body: input.body,
            is_approved: false // 기본적으로 승인 대기
          },
          include: {
            users: true
          }
        })
        
        // 댓글 수 업데이트
        await prisma.blog_contents.update({
          where: { id: input.contentId },
          data: { comment_count: { increment: 1 } }
        })
        
        return transformComment(newComment)
      } catch (error) {
        console.error('Create comment error:', error)
        throw new Error(`댓글 생성에 실패했습니다: ${error.message}`)
      }
    },
    
    updateComment: async (_, { id, input }) => {
      try {
        const updateData: any = { updated_at: new Date() }
        
        if (input.body !== undefined) updateData.body = input.body
        if (input.isApproved !== undefined) updateData.is_approved = input.isApproved
        
        const updatedComment = await prisma.blog_comments.update({
          where: { id },
          data: updateData,
          include: {
            users: true
          }
        })
        
        return transformComment(updatedComment)
      } catch (error) {
        console.error('Update comment error:', error)
        throw new Error(`댓글 수정에 실패했습니다: ${error.message}`)
      }
    },
    
    deleteComment: async (_, { id }) => {
      try {
        const comment = await prisma.blog_comments.findFirst({
          where: { id }
        })
        
        if (comment) {
          await prisma.blog_comments.delete({
            where: { id }
          })
          
          // 댓글 수 업데이트
          await prisma.blog_contents.update({
            where: { id: comment.content_id },
            data: { comment_count: { decrement: 1 } }
          })
        }
        
        return true
      } catch (error) {
        console.error('Delete comment error:', error)
        throw new Error(`댓글 삭제에 실패했습니다: ${error.message}`)
      }
    },
    
    // Like Toggle
    toggleLike: async (_, { contentId, userId }) => {
      try {
        const existingLike = await prisma.blog_likes.findFirst({
          where: {
            content_id: contentId,
            user_id: userId
          }
        })
        
        let isLiked: boolean
        
        if (existingLike) {
          // 좋아요 취소
          await prisma.blog_likes.delete({
            where: { id: existingLike.id }
          })
          
          await prisma.blog_contents.update({
            where: { id: contentId },
            data: { like_count: { decrement: 1 } }
          })
          
          isLiked = false
        } else {
          // 좋아요 추가
          await prisma.blog_likes.create({
            data: {
              content_id: contentId,
              user_id: userId
            }
          })
          
          await prisma.blog_contents.update({
            where: { id: contentId },
            data: { like_count: { increment: 1 } }
          })
          
          isLiked = true
        }
        
        // 최신 좋아요 수 조회
        const content = await prisma.blog_contents.findFirst({
          where: { id: contentId },
          select: { like_count: true }
        })
        
        return {
          success: true,
          isLiked,
          likeCount: content?.like_count || 0
        }
      } catch (error) {
        console.error('Toggle like error:', error)
        throw new Error(`좋아요 처리에 실패했습니다: ${error.message}`)
      }
    }
  },

  // Type 리졸버들
  Category: {
    contentCount: async (category) => {
      try {
        const count = await prisma.blog_contents.count({
          where: {
            category_id: category.id,
            status: 'PUBLISHED'
          }
        })
        
        return count
      } catch (error) {
        console.error('Category contentCount resolver error:', error)
        return 0
      }
    },
    
    contents: async (category) => {
      try {
        const contents = await prisma.blog_contents.findMany({
          where: {
            category_id: category.id,
            status: 'PUBLISHED'
          },
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          },
          orderBy: { published_at: 'desc' }
        })
        
        return contents.map(transformContent)
      } catch (error) {
        console.error('Category contents resolver error:', error)
        return []
      }
    }
  },
  
  Content: {
    comments: async (content) => {
      try {
        const comments = await prisma.blog_comments.findMany({
          where: {
            content_id: content.id,
            is_approved: true
          },
          include: {
            users: true
          },
          orderBy: { created_at: 'desc' }
        })
        
        return comments.map(transformComment)
      } catch (error) {
        console.error('Content comments resolver error:', error)
        return []
      }
    },
    
    tags: async (content) => {
      try {
        const contentTags = await prisma.blog_content_tags.findMany({
          where: { content_id: content.id },
          include: { blog_tags: true }
        })
        
        return contentTags.map(ct => transformTag(ct.blog_tags))
      } catch (error) {
        console.error('Content tags resolver error:', error)
        return []
      }
    },
    
    likes: async (content) => {
      try {
        const likes = await prisma.blog_likes.findMany({
          where: { content_id: content.id },
          include: {
            users: true
          }
        })
        
        return likes.map(transformLike)
      } catch (error) {
        console.error('Content likes resolver error:', error)
        return []
      }
    }
  },
  
  User: {
    contents: async (user) => {
      try {
        const contents = await prisma.blog_contents.findMany({
          where: { author_id: user.id },
          include: {
            users: true,
            blog_categories: true,
            blog_content_tags: {
              include: {
                blog_tags: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        })
        
        return contents.map(transformContent)
      } catch (error) {
        console.error('User contents resolver error:', error)
        return []
      }
    },
    
    comments: async (user) => {
      try {
        const comments = await prisma.blog_comments.findMany({
          where: { user_id: user.id },
          include: {
            users: true
          },
          orderBy: { created_at: 'desc' }
        })
        
        return comments.map(transformComment)
      } catch (error) {
        console.error('User comments resolver error:', error)
        return []
      }
    },
    
    likes: async (user) => {
      try {
        const likes = await prisma.blog_likes.findMany({
          where: { user_id: user.id },
          include: {
            users: true,
            blog_contents: true
          }
        })
        
        return likes.map(transformLike)
      } catch (error) {
        console.error('User likes resolver error:', error)
        return []
      }
    }
  },
  
  Tag: {
    contents: async (tag) => {
      try {
        const contentTags = await prisma.blog_content_tags.findMany({
          where: { tag_id: tag.id },
          include: {
            blog_contents: {
              include: {
                users: true,
                blog_categories: true
              }
            }
          }
        })
        
        return contentTags
          .filter(ct => ct.blog_contents.status === 'PUBLISHED')
          .map(ct => transformContent(ct.blog_contents))
      } catch (error) {
        console.error('Tag contents resolver error:', error)
        return []
      }
    }
  },
  
  Comment: {
    replies: async (comment) => {
      try {
        const replies = await prisma.blog_comments.findMany({
          where: {
            parent_id: comment.id,
            is_approved: true
          },
          include: {
            users: true
          },
          orderBy: { created_at: 'asc' }
        })
        
        return replies.map(transformComment)
      } catch (error) {
        console.error('Comment replies resolver error:', error)
        return []
      }
    }
  },
  
  // 스칼라 타입 리졸버들
  DateTime: {
    serialize: (date) => {
      if (!date) return null
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString()
    },
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  },
  
  JSON: {
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => JSON.parse(ast.value)
  }
}

// Transform 함수들 (DB 필드명을 GraphQL 필드명으로 변환)
function transformCategory(category: any) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    isVisible: category.is_visible,
    sortOrder: category.sort_order,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  }
}

function transformContent(content: any) {
  return {
    id: content.id,
    slug: content.slug,
    title: content.title,
    contentBody: content.content_body,
    excerpt: content.meta_description || 
             content.content_body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '',
    authorId: content.author_id,
    categoryId: content.category_id,
    status: content.status,
    isFeatured: content.is_featured,
    isHero: content.is_hero,
    thumbnailUrl: content.thumbnail_url,
    viewCount: content.view_count || 0,
    likeCount: content.like_count || 0,
    commentCount: content.comment_count || 0,
    metaTitle: content.meta_title,
    metaDescription: content.meta_description,
    createdAt: content.created_at,
    updatedAt: content.updated_at,
    publishedAt: content.published_at,
    author: content.users ? transformUser(content.users) : null,
    category: content.blog_categories ? transformCategory(content.blog_categories) : null
  }
}

function transformUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    companyName: user.companyName,
    position: user.position,
    phoneNumber: user.phoneNumber,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

function transformTag(tag: any) {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug
  }
}

function transformComment(comment: any) {
  return {
    id: comment.id,
    contentId: comment.content_id,
    userId: comment.user_id,
    parentId: comment.parent_id,
    body: comment.body,
    isApproved: comment.is_approved,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    user: comment.users ? transformUser(comment.users) : null
  }
}

function transformLike(like: any) {
  return {
    id: like.id,
    contentId: like.content_id,
    userId: like.user_id,
    createdAt: like.created_at,
    user: like.users ? transformUser(like.users) : null,
    content: like.blog_contents ? transformContent(like.blog_contents) : null
  }
}

// 사용자 인증 함수
async function getUser(request: NextRequest) {
  try {
    // JWT 토큰 검증 로직을 여기에 구현
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }
    
    // const token = authHeader.substring(7)
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    // return decoded
    
    return null
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Apollo Server 설정
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  csrfPrevention: false,
  formatError: (error) => {
    console.error('GraphQL Error:', error)
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      ...(process.env.NODE_ENV === 'development' && { 
        extensions: error.extensions,
        stack: error.stack 
      })
    }
  },
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation(requestContext) {
            console.log('GraphQL Operation:', requestContext.request.operationName)
          },
          didEncounterErrors(requestContext) {
            console.error('GraphQL Errors:', requestContext.errors)
          }
        }
      }
    }
  ]
})

// Next.js handler 생성
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (request) => {
    const user = await getUser(request)
    
    return {
      prisma,
      user,
      request
    }
  }
})

// HTTP 메서드 export
export async function GET(request: NextRequest) {
  try {
    return handler(request)
  } catch (error) {
    console.error('GraphQL GET error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    return handler(request)
  } catch (error) {
    console.error('GraphQL POST error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
