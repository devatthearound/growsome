// 간단한 GraphQL Schema Builder (Pothos)
import SchemaBuilder from '@pothos/core'
import { blogPrisma } from '../lib/prisma-blog'

export const builder = new SchemaBuilder<{
  Context: {
    prisma: typeof blogPrisma
    user?: {
      id: string
      role: string
    }
  }
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
    JSON: {
      Input: any
      Output: any
    }
  }
}>({
  plugins: [],
})

// 기본 스칼라 타입 정의
builder.queryType({})
// builder.mutationType({}) // 임시로 제거

// DateTime 스칼라
builder.scalarType('DateTime', {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => {
    if (typeof value === 'string') {
      return new Date(value)
    }
    throw new Error('DateTime must be a string')
  },
})

// JSON 스칼라
builder.scalarType('JSON', {
  serialize: (value) => value,
  parseValue: (value) => value,
})
