// Mutation Resolvers
import { builder } from '../builder'
import { 
  CreateUserInput, 
  UpdateUserInput
} from '../types/user'

// User Mutations
builder.mutationField('createUser', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      input: t.arg({ type: CreateUserInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma }) => {
      // 이메일 중복 체크
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email }
      })
      
      if (existingUser) {
        throw new Error('이미 존재하는 이메일입니다.')
      }
      
      return await prisma.user.create({
        ...query,
        data: {
          ...input,
          // TODO: 비밀번호 해싱 처리
        }
      })
    }
  })
)

builder.mutationField('updateUser', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      id: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateUserInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      // 권한 체크
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new Error('권한이 없습니다.')
      }
      
      return await prisma.user.update({
        ...query,
        where: { id },
        data: input
      })
    }
  })
)

builder.mutationField('deleteUser', (t) =>
  t.boolean({
    args: {
      id: t.arg.int({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      // 권한 체크
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new Error('권한이 없습니다.')
      }
      
      await prisma.user.update({
        where: { id },
        data: { status: 'deleted' }
      })
      
      return true
    }
  })
)

// Blog Content Mutations
builder.mutationField('createBlogContent', (t) =>
  t.prismaField({
    type: 'blog_contents',
    args: {
      title: t.arg.string({ required: true }),
      contentBody: t.arg.string({ required: true }),
      categoryId: t.arg.int({ required: true }),
      slug: t.arg.string({ required: true }),
      thumbnailUrl: t.arg.string(),
      metaTitle: t.arg.string(),
      metaDescription: t.arg.string(),
      status: t.arg.string()
    },
    resolve: async (query, _, args, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 슬러그 중복 체크
      const existingSlug = await prisma.blog_contents.findUnique({
        where: { slug: args.slug }
      })
      
      if (existingSlug) {
        throw new Error('이미 존재하는 슬러그입니다.')
      }
      
      return await prisma.blog_contents.create({
        ...query,
        data: {
          title: args.title,
          content_body: args.contentBody,
          category_id: args.categoryId,
          author_id: user.id,
          slug: args.slug,
          thumbnail_url: args.thumbnailUrl,
          meta_title: args.metaTitle,
          meta_description: args.metaDescription,
          status: args.status || 'DRAFT'
        }
      })
    }
  })
)

// Blog Comment Mutations
builder.mutationField('createBlogComment', (t) =>
  t.prismaField({
    type: 'blog_comments',
    args: {
      contentId: t.arg.int({ required: true }),
      body: t.arg.string({ required: true }),
      parentId: t.arg.int()
    },
    resolve: async (query, _, { contentId, body, parentId }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 콘텐츠 존재 여부 체크
      const content = await prisma.blog_contents.findUnique({
        where: { id: contentId }
      })
      
      if (!content) {
        throw new Error('콘텐츠를 찾을 수 없습니다.')
      }
      
      const comment = await prisma.blog_comments.create({
        ...query,
        data: {
          content_id: contentId,
          user_id: user.id,
          parent_id: parentId,
          body
        }
      })
      
      // 댓글 수 증가
      await prisma.blog_contents.update({
        where: { id: contentId },
        data: {
          comment_count: {
            increment: 1
          }
        }
      })
      
      return comment
    }
  })
)

// Blog Like Toggle
builder.mutationField('toggleBlogLike', (t) =>
  t.boolean({
    args: {
      contentId: t.arg.int({ required: true })
    },
    resolve: async (_, { contentId }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 기존 좋아요 확인
      const existingLike = await prisma.blog_likes.findUnique({
        where: {
          content_id_user_id: {
            content_id: contentId,
            user_id: user.id
          }
        }
      })
      
      if (existingLike) {
        // 좋아요 취소
        await prisma.$transaction([
          prisma.blog_likes.delete({
            where: { id: existingLike.id }
          }),
          prisma.blog_contents.update({
            where: { id: contentId },
            data: {
              like_count: {
                decrement: 1
              }
            }
          })
        ])
        return false
      } else {
        // 좋아요 추가
        await prisma.$transaction([
          prisma.blog_likes.create({
            data: {
              content_id: contentId,
              user_id: user.id
            }
          }),
          prisma.blog_contents.update({
            where: { id: contentId },
            data: {
              like_count: {
                increment: 1
              }
            }
          })
        ])
        return true
      }
    }
  })
)
