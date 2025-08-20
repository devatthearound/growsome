// Provider 타입 정의
import { builder } from '../builder'

// Provider 모델 타입
builder.prismaObject('Provider', {
  fields: (t) => ({
    id: t.exposeString('id'),
    slug: t.exposeString('slug'),
    name: t.exposeString('name'),
    profileImage: t.exposeString('profileImage', { nullable: true }),
    bio: t.exposeString('bio', { nullable: true }),
    expertise: t.exposeString('expertise', { nullable: true }),
    tags: t.expose('tags', { type: 'JSON', nullable: true }),
    isVerified: t.exposeBoolean('isVerified'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    
    // Relations
    user: t.relation('user'),
    contents: t.relation('contents'),
    
    // Computed fields
    contentCount: t.int({
      resolve: async (provider, _, { prisma }) => {
        return await prisma.content.count({
          where: { 
            providerId: provider.id,
            status: 'PUBLISHED'
          }
        })
      }
    }),
    
    totalViews: t.int({
      resolve: async (provider, _, { prisma }) => {
        const result = await prisma.content.aggregate({
          where: { 
            providerId: provider.id,
            status: 'PUBLISHED'
          },
          _sum: {
            viewCount: true
          }
        })
        return result._sum.viewCount || 0
      }
    }),
    
    totalLikes: t.int({
      resolve: async (provider, _, { prisma }) => {
        const result = await prisma.content.aggregate({
          where: { 
            providerId: provider.id,
            status: 'PUBLISHED'
          },
          _sum: {
            likeCount: true
          }
        })
        return result._sum.likeCount || 0
      }
    })
  })
})

// Provider 입력 타입들
const CreateProviderInput = builder.inputType('CreateProviderInput', {
  fields: (t) => ({
    slug: t.string({ required: true }),
    name: t.string({ required: true }),
    profileImage: t.string(),
    bio: t.string(),
    expertise: t.string(),
    tags: t.field({ type: 'JSON' }),
  })
})

const UpdateProviderInput = builder.inputType('UpdateProviderInput', {
  fields: (t) => ({
    slug: t.string(),
    name: t.string(),
    profileImage: t.string(),
    bio: t.string(),
    expertise: t.string(),
    tags: t.field({ type: 'JSON' }),
    isVerified: t.boolean(),
  })
})

export { CreateProviderInput, UpdateProviderInput }
