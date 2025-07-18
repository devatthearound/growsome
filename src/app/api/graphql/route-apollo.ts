// 가장 간단한 GraphQL API Route
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { blogPrisma } from '../../../lib/prisma-blog'

// 가장 간단한 GraphQL 스키마 (문자열로 정의)
const typeDefs = `
  type Query {
    hello: String!
    version: String!
  }
`

// 리졸버
const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!',
    version: () => '1.0.0',
  },
}

// Apollo Server 설정
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
})

// Next.js handler 생성
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (request) => {
    return {
      prisma: blogPrisma,
      user: null // 임시로 null
    }
  }
})

// HTTP 메서드 export
export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
