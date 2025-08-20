// Banner 타입 정의
import { builder } from '../builder'

// BannerLocation enum
const BannerLocation = builder.enumType('BannerLocation', {
  values: ['HOME', 'CATEGORY', 'TAG', 'TOP', 'SIDE'] as const,
})

// Banner 모델 타입
builder.prismaObject('Banner', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    imageUrl: t.exposeString('imageUrl'),
    linkUrl: t.exposeString('linkUrl', { nullable: true }),
    location: t.expose('location', { type: BannerLocation }),
    isActive: t.exposeBoolean('isActive'),
    sortOrder: t.exposeInt('sortOrder'),
    startDate: t.expose('startDate', { type: 'DateTime', nullable: true }),
    endDate: t.expose('endDate', { type: 'DateTime', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    
    // Computed fields
    isCurrentlyActive: t.boolean({
      resolve: (banner) => {
        if (!banner.isActive) return false
        
        const now = new Date()
        const startOk = !banner.startDate || banner.startDate <= now
        const endOk = !banner.endDate || banner.endDate >= now
        
        return startOk && endOk
      }
    })
  })
})

// Banner 입력 타입들
const CreateBannerInput = builder.inputType('CreateBannerInput', {
  fields: (t) => ({
    imageUrl: t.string({ required: true }),
    linkUrl: t.string(),
    location: t.field({ type: BannerLocation, required: true }),
    isActive: t.boolean(),
    sortOrder: t.int(),
    startDate: t.field({ type: 'DateTime' }),
    endDate: t.field({ type: 'DateTime' }),
  })
})

const UpdateBannerInput = builder.inputType('UpdateBannerInput', {
  fields: (t) => ({
    imageUrl: t.string(),
    linkUrl: t.string(),
    location: t.field({ type: BannerLocation }),
    isActive: t.boolean(),
    sortOrder: t.int(),
    startDate: t.field({ type: 'DateTime' }),
    endDate: t.field({ type: 'DateTime' }),
  })
})

export { BannerLocation, CreateBannerInput, UpdateBannerInput }
