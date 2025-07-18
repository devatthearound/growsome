// scripts/fix-status-field.js - 데이터베이스 직접 수정
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixStatusField() {
  console.log('데이터베이스 status 필드 문제 해결 시작...')

  try {
    // 1. 먼저 모든 데이터 삭제
    await prisma.blog_content_tags.deleteMany()
    await prisma.blog_likes.deleteMany()
    await prisma.blog_comments.deleteMany()
    await prisma.blog_contents.deleteMany()
    
    console.log('기존 blog_contents 데이터 삭제 완료')

    // 2. Raw SQL로 status 컬럼 타입 확인 및 수정
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'blog_contents' AND column_name = 'status'
    `
    
    console.log('현재 status 컬럼 정보:', result)

    // 3. status 컬럼을 VARCHAR로 변경 (만약 enum이라면)
    try {
      await prisma.$executeRaw`
        ALTER TABLE blog_contents 
        ALTER COLUMN status TYPE VARCHAR(20)
      `
      console.log('status 컬럼 타입을 VARCHAR(20)로 변경 완료')
    } catch (error) {
      console.log('status 컬럼 타입 변경 시도:', error.message)
    }

    // 4. 기본값 설정
    try {
      await prisma.$executeRaw`
        ALTER TABLE blog_contents 
        ALTER COLUMN status SET DEFAULT 'DRAFT'
      `
      console.log('status 컬럼 기본값 설정 완료')
    } catch (error) {
      console.log('기본값 설정 시도:', error.message)
    }

    // 5. 제약조건 확인 및 제거
    try {
      const constraints = await prisma.$queryRaw`
        SELECT constraint_name, constraint_type 
        FROM information_schema.table_constraints 
        WHERE table_name = 'blog_contents' AND constraint_type = 'CHECK'
      `
      console.log('CHECK 제약조건들:', constraints)
      
      // CHECK 제약조건 제거 시도
      if (constraints.length > 0) {
        for (const constraint of constraints) {
          try {
            await prisma.$executeRaw`
              ALTER TABLE blog_contents DROP CONSTRAINT ${constraint.constraint_name}
            `
            console.log(`제약조건 ${constraint.constraint_name} 제거 완료`)
          } catch (err) {
            console.log(`제약조건 제거 실패: ${err.message}`)
          }
        }
      }
    } catch (error) {
      console.log('제약조건 확인 중 오류:', error.message)
    }

    console.log('✅ 데이터베이스 status 필드 수정 완료!')
    
  } catch (error) {
    console.error('❌ 데이터베이스 수정 중 오류:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixStatusField()
