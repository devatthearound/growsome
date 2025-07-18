// scripts/check-and-add-specific-users.ts
// 특정 사용자들 확인 및 추가

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SPECIFIC_USERS = [
  'bbuzaddaa@gmail.com',
  'growsome.me@gmail.com'
]

async function main() {
  try {
    console.log('🔍 특정 사용자들 확인 중...')
    
    for (const email of SPECIFIC_USERS) {
      console.log(`\n📧 ${email} 확인 중...`)
      
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          status: true,
          companyName: true,
          position: true,
          phoneNumber: true
        }
      })

      if (user) {
        console.log(`✅ 사용자 존재: ${user.username}`)
        console.log(`   - ID: ${user.id}`)
        console.log(`   - 상태: ${user.status}`)
        console.log(`   - 비밀번호 설정: ${user.password ? '✅' : '❌'}`)
        
        // 비밀번호가 없거나 비활성 상태라면 업데이트
        if (!user.password || user.status !== 'active') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              password: user.password || 'growsome123',
              status: 'active'
            }
          })
          console.log(`🔧 사용자 정보 업데이트 완료`)
        }
        
      } else {
        console.log(`❌ 사용자 없음 - 새로 생성합니다`)
        
        // 사용자명을 이메일에서 추출
        const username = email.split('@')[0]
        
        const newUser = await prisma.user.create({
          data: {
            email: email,
            username: username,
            password: 'growsome123',
            phoneNumber: '010-0000-0000', // 기본값
            status: 'active'
          }
        })
        
        console.log(`✅ 새 사용자 생성 완료: ${newUser.username} (ID: ${newUser.id})`)
      }
    }

    console.log('\n🎉 특정 사용자 확인/추가 완료!')
    
    // 최종 확인
    console.log('\n📋 확인된 사용자들:')
    for (const email of SPECIFIC_USERS) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
          username: true,
          status: true
        }
      })
      
      if (user) {
        console.log(`✅ ${user.username} (${user.email}) - ${user.status}`)
      }
    }
    
    console.log('\n🔑 로그인 정보:')
    console.log('- 이메일: bbuzaddaa@gmail.com')
    console.log('- 이메일: growsome.me@gmail.com') 
    console.log('- 비밀번호: growsome123')

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
