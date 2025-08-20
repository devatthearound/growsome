// 임시 간단한 GraphQL Schema
import { builder } from './builder'

// 간단한 스키마 import
import './simple-schema'

// 스키마 빌드
export const schema = builder.toSchema()
