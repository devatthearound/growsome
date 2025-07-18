// Comment 타입 정의
import { builder } from '../builder'

// Comment 모델 타입
builder.prismaObject('Comment', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    contentId: t.exposeInt('contentId'),
    userId: t.exposeString('userId'),
    parentCommentId: t.exposeInt('parentCommentId', { nullable: true }),
    commentText: t.exposeString('commentText'),
    isDeleted: t.exposeBoolean('isDeleted'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    
    // Relations
    content: t.relation('content'),
    user: t.relation('user'),
    parentComment: t.relation('parentComment', { nullable: true }),
    replies: t.relation('replies'),
    
    // Computed fields
    replyCount: t.int({
      resolve: async (comment, _, { prisma }) => {
        return await prisma.comment.count({
          where: { 
            parentCommentId: comment.id,
            isDeleted: false
          }
        })
      }
    })
  })
})

// Comment 입력 타입들
const CreateCommentInput = builder.inputType('CreateCommentInput', {
  fields: (t) => ({
    contentId: t.int({ required: true }),
    parentCommentId: t.int(),
    commentText: t.string({ required: true }),
  })
})

const UpdateCommentInput = builder.inputType('UpdateCommentInput', {
  fields: (t) => ({
    commentText: t.string({ required: true }),
  })
})

export { CreateCommentInput, UpdateCommentInput }
