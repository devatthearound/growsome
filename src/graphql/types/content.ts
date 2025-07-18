// Content 타입 정의
import { builder } from '../builder'

// Content 모델 타입
builder.prismaObject('Content', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    slug: t.exposeString('slug'),
    title: t.exposeString('title'),
    contentBody: t.exposeString('contentBody'),
    authorId: t.exposeString('authorId'),
    providerId: t.exposeString('providerId', { nullable: true }),
    categoryId: t.exposeInt('categoryId'),
    status: t.expose('status', { type: ContentStatus }),
    isFeatured: t.exposeBoolean('isFeatured'),
    isHero: t.exposeBoolean('isHero'),
    thumbnailUrl: t.exposeString('thumbnailUrl', { nullable: true }),
    tags: t.expose('tags', { type: 'JSON', nullable: true }),
    viewCount: t.exposeInt('viewCount'),
    likeCount: t.exposeInt('likeCount'),
    commentCount: t.exposeInt('commentCount'),
    seoTitle: t.exposeString('seoTitle', { nullable: true }),
    seoDescription: t.exposeString('seoDescription', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    publishedAt: t.expose('publishedAt', { type: 'DateTime', nullable: true }),
    
    // Relations
    author: t.relation('author'),
    provider: t.relation('provider', { nullable: true }),
    category: t.relation('category'),
    comments: t.relation('comments'),
    interactions: t.relation('interactions'),
    contentTags: t.relation('contentTags'),
    
    // Computed fields
    excerpt: t.string({
      resolve: (content) => {
        // HTML 태그 제거하고 150자로 제한
        const plainText = content.contentBody.replace(/<[^>]*>/g, '')
        return plainText.length > 150 
          ? plainText.substring(0, 150) + '...' 
          : plainText
      }
    }),
    
    readingTime: t.int({
      resolve: (content) => {
        // 평균 독서 속도 200 단어/분으로 계산
        const wordCount = content.contentBody.split(' ').length
        return Math.ceil(wordCount / 200)
      }
    }),
    
    isLikedByUser: t.boolean({
      args: {
        userId: t.arg.string()
      },
      resolve: async (content, { userId }, { prisma }) => {
        if (!userId) return false
        
        const interaction = await prisma.userInteraction.findUnique({
          where: {
            userId_contentId_type: {
              userId,
              contentId: content.id,
              type: 'LIKE'
            }
          }
        })
        
        return !!interaction
      }
    }),
    
    isBookmarkedByUser: t.boolean({
      args: {
        userId: t.arg.string()
      },
      resolve: async (content, { userId }, { prisma }) => {
        if (!userId) return false
        
        const interaction = await prisma.userInteraction.findUnique({
          where: {
            userId_contentId_type: {
              userId,
              contentId: content.id,
              type: 'BOOKMARK'
            }
          }
        })
        
        return !!interaction
      }
    })
  })
})

// ContentStatus enum
const ContentStatus = builder.enumType('ContentStatus', {
  values: ['DRAFT', 'PUBLISHED', 'PRIVATE'] as const,
})

// Category 모델 타입
builder.prismaObject('Category', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    slug: t.exposeString('slug'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    isVisible: t.exposeBoolean('isVisible'),
    sortOrder: t.exposeInt('sortOrder'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    
    // Relations
    contents: t.relation('contents'),
    
    // Computed fields
    contentCount: t.int({
      resolve: async (category, _, { prisma }) => {
        return await prisma.content.count({
          where: { 
            categoryId: category.id,
            status: 'PUBLISHED'
          }
        })
      }
    })
  })
})

// Tag 모델 타입
builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    slug: t.exposeString('slug'),
    name: t.exposeString('name'),
    tagType: t.expose('tagType', { type: TagType }),
    isUserCreatable: t.exposeBoolean('isUserCreatable'),
    usageCount: t.exposeInt('usageCount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    
    // Relations
    contentTags: t.relation('contentTags')
  })
})

// TagType enum
const TagType = builder.enumType('TagType', {
  values: ['CONTENT', 'INTEREST'] as const,
})

// Content 입력 타입들
const CreateContentInput = builder.inputType('CreateContentInput', {
  fields: (t) => ({
    slug: t.string({ required: true }),
    title: t.string({ required: true }),
    contentBody: t.string({ required: true }),
    categoryId: t.int({ required: true }),
    status: t.field({ type: ContentStatus, required: true }),
    isFeatured: t.boolean(),
    isHero: t.boolean(),
    thumbnailUrl: t.string(),
    tags: t.field({ type: 'JSON' }),
    seoTitle: t.string(),
    seoDescription: t.string(),
    publishedAt: t.field({ type: 'DateTime' }),
    asProvider: t.boolean(), // 공급자로 작성할지 여부
  })
})

const UpdateContentInput = builder.inputType('UpdateContentInput', {
  fields: (t) => ({
    slug: t.string(),
    title: t.string(),
    contentBody: t.string(),
    categoryId: t.int(),
    status: t.field({ type: ContentStatus }),
    isFeatured: t.boolean(),
    isHero: t.boolean(),
    thumbnailUrl: t.string(),
    tags: t.field({ type: 'JSON' }),
    seoTitle: t.string(),
    seoDescription: t.string(),
    publishedAt: t.field({ type: 'DateTime' }),
  })
})

const CreateCategoryInput = builder.inputType('CreateCategoryInput', {
  fields: (t) => ({
    slug: t.string({ required: true }),
    name: t.string({ required: true }),
    description: t.string(),
    isVisible: t.boolean(),
    sortOrder: t.int(),
  })
})

const UpdateCategoryInput = builder.inputType('UpdateCategoryInput', {
  fields: (t) => ({
    slug: t.string(),
    name: t.string(),
    description: t.string(),
    isVisible: t.boolean(),
    sortOrder: t.int(),
  })
})

// Content 필터링 입력 타입
const ContentFiltersInput = builder.inputType('ContentFiltersInput', {
  fields: (t) => ({
    status: t.field({ type: ContentStatus }),
    categoryId: t.int(),
    authorId: t.string(),
    providerId: t.string(),
    isFeatured: t.boolean(),
    isHero: t.boolean(),
    tags: t.stringList(),
    search: t.string(), // 제목, 내용 검색
  })
})

// 정렬 옵션
const ContentSortBy = builder.enumType('ContentSortBy', {
  values: ['CREATED_AT', 'UPDATED_AT', 'PUBLISHED_AT', 'VIEW_COUNT', 'LIKE_COUNT', 'TITLE'] as const,
})

const SortOrder = builder.enumType('SortOrder', {
  values: ['ASC', 'DESC'] as const,
})

export { 
  ContentStatus,
  TagType,
  CreateContentInput,
  UpdateContentInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  ContentFiltersInput,
  ContentSortBy,
  SortOrder
}
