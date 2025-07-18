// GraphQL API Route (Next.js App Router)
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { schema } from '../../../graphql/schema-simple'
import { blogPrisma } from '../../../lib/prisma-blog'

// 사용자 인증 함수 (JWT 토큰에서 사용자 정보 추출)
async function getUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    
    // TODO: JWT 토큰 검증 로직 구현
    // 현재는 임시로 null 반환
    return null
    
    // 예시 JWT 검증 코드:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    // const user = await blogPrisma.user.findUnique({
    //   where: { id: decoded.userId }
    // })
    // return user
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Apollo Server 설정
const server = new ApolloServer({
  schema,
  // 개발 환경에서만 GraphQL Playground 활성화
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    // 요청/응답 로깅 플러그인
    {
      requestDidStart() {
        return {
          didResolveOperation(requestContext) {
            console.log('GraphQL Operation:', requestContext.request.operationName)
          },
          didEncounterErrors(requestContext) {
            console.error('GraphQL Errors:', requestContext.errors)
          }
        }
      }
    }
  ]
})

// Next.js handler 생성
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (request) => {
    const user = await getUser(request)
    
    return {
      prisma: blogPrisma,
      user
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
