// User 타입 정의
import { builder } from '../builder'

// User 모델 타입
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeString('id'),
    slug: t.exposeString('slug'),
    username: t.exposeString('username'),
    email: t.exposeString('email'),
    profileImage: t.exposeString('profileImage', { nullable: true }),
    bio: t.exposeString('bio', { nullable: true }),
    socialLinks: t.expose('socialLinks', { type: 'JSON', nullable: true }),
    role: t.expose('role', { type: UserRole }),
    canWriteContent: t.exposeBoolean('canWriteContent'),
    canWriteAsProvider: t.exposeBoolean('canWriteAsProvider'),
    isDeleted: t.exposeBoolean('isDeleted'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    
    // Relations
    provider: t.relation('provider', { nullable: true }),
    contents: t.relation('contents'),
    comments: t.relation('comments'),
    
    // Computed fields
    contentCount: t.int({
      resolve: async (user, _, { prisma }) => {
        return await prisma.content.count({
          where: { 
            authorId: user.id,
            status: 'PUBLISHED'
          }
        })
      }
    }),
    
    followerCount: t.int({
      resolve: () => 0 // TODO: 팔로워 시스템 구현 시 업데이트
    })
  })
})

// UserRole enum
const UserRole = builder.enumType('UserRole', {
  values: ['ADMIN', 'USER'] as const,
})

// User 입력 타입들
const CreateUserInput = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    slug: t.string({ required: true }),
    username: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    profileImage: t.string(),
    bio: t.string(),
    socialLinks: t.field({ type: 'JSON' }),
  })
})

const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    slug: t.string(),
    username: t.string(),
    profileImage: t.string(),
    bio: t.string(),
    socialLinks: t.field({ type: 'JSON' }),
    canWriteContent: t.boolean(),
    canWriteAsProvider: t.boolean(),
  })
})

export { 
  UserRole, 
  CreateUserInput, 
  UpdateUserInput
}
