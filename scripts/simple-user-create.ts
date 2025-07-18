// scripts/simple-user-create.ts
// 가장 간단한 사용자 생성 스크립트

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 사용자 생성 시작...')

    // 기존 사용자 삭제 (있다면)
    await prisma.user.deleteMany({
      where: { email: 'admin@growsome.co.kr' }
    })
    console.log('기존 사용자 삭제 완료')

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: 'admin@growsome.co.kr',
        username: 'Growsome Admin',
        password: 'password123',
        phoneNumber: '010-1234-5678',
        status: 'active'
      }
    })

    console.log('✅ 사용자 생성 완료:', user.email)
    console.log('📋 로그인 정보:')
    console.log('- 이메일:', user.email)
    console.log('- 비밀번호: password123')

  } catch (error) {
    console.error('❌ 오류:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
