// 가장 간단한 GraphQL 스키마
import { builder } from './builder'

// 가장 기본적인 Hello 쿼리만
builder.queryField('hello', (t) =>
  t.string({
    resolve: () => 'Hello, GraphQL!'
  })
)

// 간단한 버전 테스트
builder.queryField('version', (t) =>
  t.string({
    resolve: () => '1.0.0'
  })
)
