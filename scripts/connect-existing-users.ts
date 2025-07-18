// scripts/connect-existing-users.ts
// 기존 사용자들에게 비밀번호 추가 및 로그인 연결

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 기존 사용자 확인 및 연결 시작...')

    // 모든 사용자 조회
    const allUsers = await prisma.user.findMany({
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

    console.log(`📊 총 ${allUsers.length}명의 사용자 발견`)

    if (allUsers.length === 0) {
      console.log('❌ 기존 사용자가 없습니다.')
      return
    }

    // 각 사용자 정보 출력
    console.log('\n📋 기존 사용자 목록:')
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`)
      console.log(`   - ID: ${user.id}`)
      console.log(`   - 상태: ${user.status}`)
      console.log(`   - 비밀번호 설정: ${user.password ? '✅' : '❌'}`)
      console.log(`   - 회사: ${user.companyName || '미설정'}`)
      console.log(`   - 직책: ${user.position || '미설정'}`)
      console.log(`   - 전화번호: ${user.phoneNumber || '미설정'}`)
      console.log('')
    })

    // 비밀번호가 없는 사용자들에게 기본 비밀번호 설정
    const usersWithoutPassword = allUsers.filter(user => !user.password)
    
    if (usersWithoutPassword.length > 0) {
      console.log(`🔧 ${usersWithoutPassword.length}명의 사용자에게 기본 비밀번호 설정 중...`)
      
      for (const user of usersWithoutPassword) {
        // 기본 비밀번호를 'growsome123'으로 설정
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            password: 'growsome123',
            status: 'active' // 활성 상태로 설정
          }
        })
        console.log(`✅ ${user.username} (${user.email}) - 비밀번호 설정 완료`)
      }
    }

    // 모든 사용자를 활성 상태로 설정
    await prisma.user.updateMany({
      where: {},
      data: { status: 'active' }
    })

    console.log('\n🎉 모든 기존 사용자 연결 완료!')
    console.log('\n📋 로그인 정보:')
    console.log('🔑 기본 비밀번호: growsome123')
    console.log('\n👥 로그인 가능한 사용자들:')
    
    const updatedUsers = await prisma.user.findMany({
      where: { status: 'active' },
      select: {
        email: true,
        username: true,
        companyName: true
      }
    })

    updatedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`)
      console.log(`   회사: ${user.companyName || '미설정'}`)
    })

    console.log('\n💡 알림:')
    console.log('- 모든 사용자의 기본 비밀번호는 "growsome123" 입니다')
    console.log('- 로그인 후 비밀번호 변경을 권장합니다')
    console.log('- 사용자들에게 이메일과 기본 비밀번호를 알려주세요')

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
