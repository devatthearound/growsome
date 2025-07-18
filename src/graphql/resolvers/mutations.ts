// Mutation Resolvers
import { builder } from '../builder'
import { 
  CreateUserInput, 
  UpdateUserInput,
  CreateProviderInput,
  UpdateProviderInput
} from '../types/user'
import { 
  CreateContentInput, 
  UpdateContentInput,
  CreateCategoryInput,
  UpdateCategoryInput
} from '../types/content'
import { 
  CreateCommentInput, 
  UpdateCommentInput,
  CreateBannerInput,
  UpdateBannerInput
} from '../types/interaction'

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
      
      // 슬러그 중복 체크
      const existingSlug = await prisma.user.findUnique({
        where: { slug: input.slug }
      })
      
      if (existingSlug) {
        throw new Error('이미 존재하는 슬러그입니다.')
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
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdateUserInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      // 권한 체크
      if (!user || (user.id !== id && user.role !== 'ADMIN')) {
        throw new Error('권한이 없습니다.')
      }
      
      // 슬러그 중복 체크 (변경하는 경우)
      if (input.slug) {
        const existingSlug = await prisma.user.findFirst({
          where: { 
            slug: input.slug,
            id: { not: id }
          }
        })
        
        if (existingSlug) {
          throw new Error('이미 존재하는 슬러그입니다.')
        }
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
      id: t.arg.string({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      // 권한 체크
      if (!user || (user.id !== id && user.role !== 'ADMIN')) {
        throw new Error('권한이 없습니다.')
      }
      
      await prisma.user.update({
        where: { id },
        data: { isDeleted: true }
      })
      
      return true
    }
  })
)

// Provider Mutations
builder.mutationField('createProvider', (t) =>
  t.prismaField({
    type: 'Provider',
    args: {
      input: t.arg({ type: CreateProviderInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 이미 공급자 프로필이 있는지 체크
      const existingProvider = await prisma.provider.findUnique({
        where: { id: user.id }
      })
      
      if (existingProvider) {
        throw new Error('이미 공급자 프로필이 존재합니다.')
      }
      
      // 슬러그 중복 체크
      const existingSlug = await prisma.provider.findUnique({
        where: { slug: input.slug }
      })
      
      if (existingSlug) {
        throw new Error('이미 존재하는 슬러그입니다.')
      }
      
      return await prisma.provider.create({
        ...query,
        data: {
          ...input,
          id: user.id
        }
      })
    }
  })
)

builder.mutationField('updateProvider', (t) =>
  t.prismaField({
    type: 'Provider',
    args: {
      input: t.arg({ type: UpdateProviderInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 슬러그 중복 체크 (변경하는 경우)
      if (input.slug) {
        const existingSlug = await prisma.provider.findFirst({
          where: { 
            slug: input.slug,
            id: { not: user.id }
          }
        })
        
        if (existingSlug) {
          throw new Error('이미 존재하는 슬러그입니다.')
        }
      }
      
      return await prisma.provider.update({
        ...query,
        where: { id: user.id },
        data: input
      })
    }
  })
)

// Content Mutations
builder.mutationField('createContent', (t) =>
  t.prismaField({
    type: 'Content',
    args: {
      input: t.arg({ type: CreateContentInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 콘텐츠 작성 권한 체크
      if (!user.canWriteContent) {
        throw new Error('콘텐츠 작성 권한이 없습니다.')
      }
      
      // 공급자로 작성하는 경우 권한 체크
      let providerId = null
      if (input.asProvider) {
        if (!user.canWriteAsProvider) {
          throw new Error('공급자로 작성할 권한이 없습니다.')
        }
        
        const provider = await prisma.provider.findUnique({
          where: { id: user.id }
        })
        
        if (!provider) {
          throw new Error('공급자 프로필이 존재하지 않습니다.')
        }
        
        providerId = provider.id
      }
      
      // 슬러그 중복 체크
      const existingSlug = await prisma.content.findUnique({
        where: { slug: input.slug }
      })
      
      if (existingSlug) {
        throw new Error('이미 존재하는 슬러그입니다.')
      }
      
      const { asProvider, ...contentData } = input
      
      return await prisma.content.create({
        ...query,
        data: {
          ...contentData,
          authorId: user.id,
          providerId
        }
      })
    }
  })
)

builder.mutationField('updateContent', (t) =>
  t.prismaField({
    type: 'Content',
    args: {
      id: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateContentInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 콘텐츠 소유권 체크
      const content = await prisma.content.findUnique({
        where: { id }
      })
      
      if (!content) {
        throw new Error('콘텐츠를 찾을 수 없습니다.')
      }
      
      if (content.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('권한이 없습니다.')
      }
      
      // 슬러그 중복 체크 (변경하는 경우)
      if (input.slug) {
        const existingSlug = await prisma.content.findFirst({
          where: { 
            slug: input.slug,
            id: { not: id }
          }
        })
        
        if (existingSlug) {
          throw new Error('이미 존재하는 슬러그입니다.')
        }
      }
      
      return await prisma.content.update({
        ...query,
        where: { id },
        data: input
      })
    }
  })
)

builder.mutationField('deleteContent', (t) =>
  t.boolean({
    args: {
      id: t.arg.int({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 콘텐츠 소유권 체크
      const content = await prisma.content.findUnique({
        where: { id }
      })
      
      if (!content) {
        throw new Error('콘텐츠를 찾을 수 없습니다.')
      }
      
      if (content.authorId !== user.id && user.role !== 'ADMIN') {
        throw new Error('권한이 없습니다.')
      }
      
      await prisma.content.delete({
        where: { id }
      })
      
      return true
    }
  })
)

// Category Mutations
builder.mutationField('createCategory', (t) =>
  t.prismaField({
    type: 'Category',
    args: {
      input: t.arg({ type: CreateCategoryInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      // 슬러그 중복 체크
      const existingSlug = await prisma.category.findUnique({
        where: { slug: input.slug }
      })
      
      if (existingSlug) {
        throw new Error('이미 존재하는 슬러그입니다.')
      }
      
      return await prisma.category.create({
        ...query,
        data: input
      })
    }
  })
)

builder.mutationField('updateCategory', (t) =>
  t.prismaField({
    type: 'Category',
    args: {
      id: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateCategoryInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      // 슬러그 중복 체크 (변경하는 경우)
      if (input.slug) {
        const existingSlug = await prisma.category.findFirst({
          where: { 
            slug: input.slug,
            id: { not: id }
          }
        })
        
        if (existingSlug) {
          throw new Error('이미 존재하는 슬러그입니다.')
        }
      }
      
      return await prisma.category.update({
        ...query,
        where: { id },
        data: input
      })
    }
  })
)

builder.mutationField('deleteCategory', (t) =>
  t.boolean({
    args: {
      id: t.arg.int({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      // 카테고리에 속한 콘텐츠가 있는지 체크
      const contentCount = await prisma.content.count({
        where: { categoryId: id }
      })
      
      if (contentCount > 0) {
        throw new Error('이 카테고리에 속한 콘텐츠가 있어 삭제할 수 없습니다.')
      }
      
      await prisma.category.delete({
        where: { id }
      })
      
      return true
    }
  })
)

// Comment Mutations
builder.mutationField('createComment', (t) =>
  t.prismaField({
    type: 'Comment',
    args: {
      input: t.arg({ type: CreateCommentInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 콘텐츠 존재 여부 체크
      const content = await prisma.content.findUnique({
        where: { id: input.contentId }
      })
      
      if (!content) {
        throw new Error('콘텐츠를 찾을 수 없습니다.')
      }
      
      // 부모 댓글 존재 여부 체크 (대댓글인 경우)
      if (input.parentCommentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: input.parentCommentId }
        })
        
        if (!parentComment || parentComment.contentId !== input.contentId) {
          throw new Error('유효하지 않은 부모 댓글입니다.')
        }
      }
      
      const comment = await prisma.comment.create({
        ...query,
        data: {
          ...input,
          userId: user.id
        }
      })
      
      // 댓글 수 증가
      await prisma.content.update({
        where: { id: input.contentId },
        data: {
          commentCount: {
            increment: 1
          }
        }
      })
      
      return comment
    }
  })
)

builder.mutationField('updateComment', (t) =>
  t.prismaField({
    type: 'Comment',
    args: {
      id: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateCommentInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 댓글 소유권 체크
      const comment = await prisma.comment.findUnique({
        where: { id }
      })
      
      if (!comment) {
        throw new Error('댓글을 찾을 수 없습니다.')
      }
      
      if (comment.userId !== user.id && user.role !== 'ADMIN') {
        throw new Error('권한이 없습니다.')
      }
      
      return await prisma.comment.update({
        ...query,
        where: { id },
        data: input
      })
    }
  })
)

builder.mutationField('deleteComment', (t) =>
  t.boolean({
    args: {
      id: t.arg.int({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 댓글 소유권 체크
      const comment = await prisma.comment.findUnique({
        where: { id }
      })
      
      if (!comment) {
        throw new Error('댓글을 찾을 수 없습니다.')
      }
      
      if (comment.userId !== user.id && user.role !== 'ADMIN') {
        throw new Error('권한이 없습니다.')
      }
      
      // 대댓글이 있는 경우 soft delete
      const replyCount = await prisma.comment.count({
        where: { parentCommentId: id }
      })
      
      if (replyCount > 0) {
        await prisma.comment.update({
          where: { id },
          data: { 
            isDeleted: true,
            commentText: '삭제된 댓글입니다.'
          }
        })
      } else {
        await prisma.comment.delete({
          where: { id }
        })
        
        // 댓글 수 감소
        await prisma.content.update({
          where: { id: comment.contentId },
          data: {
            commentCount: {
              decrement: 1
            }
          }
        })
      }
      
      return true
    }
  })
)

// Interaction Mutations
builder.mutationField('toggleLike', (t) =>
  t.boolean({
    args: {
      contentId: t.arg.int({ required: true })
    },
    resolve: async (_, { contentId }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 기존 좋아요 확인
      const existingLike = await prisma.userInteraction.findUnique({
        where: {
          userId_contentId_type: {
            userId: user.id,
            contentId,
            type: 'LIKE'
          }
        }
      })
      
      if (existingLike) {
        // 좋아요 취소
        await prisma.$transaction([
          prisma.userInteraction.delete({
            where: { id: existingLike.id }
          }),
          prisma.content.update({
            where: { id: contentId },
            data: {
              likeCount: {
                decrement: 1
              }
            }
          })
        ])
        return false
      } else {
        // 좋아요 추가
        await prisma.$transaction([
          prisma.userInteraction.create({
            data: {
              userId: user.id,
              contentId,
              type: 'LIKE'
            }
          }),
          prisma.content.update({
            where: { id: contentId },
            data: {
              likeCount: {
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

builder.mutationField('toggleBookmark', (t) =>
  t.boolean({
    args: {
      contentId: t.arg.int({ required: true })
    },
    resolve: async (_, { contentId }, { prisma, user }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 기존 북마크 확인
      const existingBookmark = await prisma.userInteraction.findUnique({
        where: {
          userId_contentId_type: {
            userId: user.id,
            contentId,
            type: 'BOOKMARK'
          }
        }
      })
      
      if (existingBookmark) {
        // 북마크 취소
        await prisma.userInteraction.delete({
          where: { id: existingBookmark.id }
        })
        return false
      } else {
        // 북마크 추가
        await prisma.userInteraction.create({
          data: {
            userId: user.id,
            contentId,
            type: 'BOOKMARK'
          }
        })
        return true
      }
    }
  })
)

// Banner Mutations (관리자 전용)
builder.mutationField('createBanner', (t) =>
  t.prismaField({
    type: 'Banner',
    args: {
      input: t.arg({ type: CreateBannerInput, required: true })
    },
    resolve: async (query, _, { input }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      return await prisma.banner.create({
        ...query,
        data: input
      })
    }
  })
)

builder.mutationField('updateBanner', (t) =>
  t.prismaField({
    type: 'Banner',
    args: {
      id: t.arg.int({ required: true }),
      input: t.arg({ type: UpdateBannerInput, required: true })
    },
    resolve: async (query, _, { id, input }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      return await prisma.banner.update({
        ...query,
        where: { id },
        data: input
      })
    }
  })
)

builder.mutationField('deleteBanner', (t) =>
  t.boolean({
    args: {
      id: t.arg.int({ required: true })
    },
    resolve: async (_, { id }, { prisma, user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new Error('관리자 권한이 필요합니다.')
      }
      
      await prisma.banner.delete({
        where: { id }
      })
      
      return true
    }
  })
)
