// 간단한 GraphQL Schema Builder (Pothos)
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import { prisma } from '../lib/prisma'

export const builder = new SchemaBuilder<{
  Context: {
    prisma: typeof prisma
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
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
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
