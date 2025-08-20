// GraphQL Schema 메인 파일
import { builder } from './builder'

// 타입 정의 import
import './types/user'
import './types/content'
import './types/comment'

// Resolver import
import './resolvers/queries'
import './resolvers/mutations'

// 스키마 빌드
export const schema = builder.toSchema()
