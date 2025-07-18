// scripts/create-test-user.ts
// 간단한 테스트 사용자 생성 스크립트

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 테스트 사용자 생성 시작...')

  try {
    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@growsome.co.kr' }
    })

    if (existingUser) {
      console.log('✅ 기존 사용자가 있습니다:', existingUser.email)
      
      // 비밀번호가 없다면 추가
      if (!existingUser.password) {
        await prisma.user.update({
          where: { email: 'admin@growsome.co.kr' },
          data: { password: 'password123' }
        })
        console.log('✅ 비밀번호가 추가되었습니다.')
      }
    } else {
      // 새 사용자 생성
      const user = await prisma.user.create({
        data: {
          email: 'admin@growsome.co.kr',
          username: 'Growsome 관리자',
          password: 'password123',
          companyName: 'Growsome',
          position: 'Admin',
          phoneNumber: '010-1234-5678',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          status: 'active'
        }
      })
      console.log('✅ 새 사용자가 생성되었습니다:', user.email)
    }

    console.log('\n🎉 테스트 사용자 준비 완료!')
    console.log('\n📋 로그인 정보:')
    console.log('- 이메일: admin@growsome.co.kr')
    console.log('- 비밀번호: password123')

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
