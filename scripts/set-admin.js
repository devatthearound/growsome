#!/usr/bin/env node

/**
 * 🔧 master@growsome.kr을 관리자로 설정하는 스크립트
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 관리자 권한 설정 시작...');

    // 1. master@growsome.kr 사용자 찾기
    const masterUser = await prisma.user.findUnique({
      where: {
        email: 'master@growsome.kr'
      }
    });

    if (!masterUser) {
      console.log('❌ master@growsome.kr 사용자를 찾을 수 없습니다.');
      console.log('   사용자를 먼저 생성해야 합니다.');
      
      // 사용자 생성 (선택사항)
      const createUser = await prisma.user.create({
        data: {
          email: 'master@growsome.kr',
          username: 'master',
          phoneNumber: '000-0000-0000',
          status: 'active',
          role: 'admin'
        }
      });
      
      console.log('✅ master@growsome.kr 사용자 생성 완료');
      console.log(`   ID: ${createUser.id}`);
      console.log(`   Role: ${createUser.role}`);
      
    } else {
      // 2. 기존 사용자를 관리자로 업데이트
      const updatedUser = await prisma.user.update({
        where: {
          email: 'master@growsome.kr'
        },
        data: {
          role: 'admin'
        }
      });

      console.log('✅ master@growsome.kr 관리자 권한 설정 완료');
      console.log(`   사용자 ID: ${updatedUser.id}`);
      console.log(`   이메일: ${updatedUser.email}`);
      console.log(`   역할: ${updatedUser.role}`);
    }

    // 3. 현재 관리자 목록 확인
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\n📋 현재 관리자 목록:');
    adminUsers.forEach(admin => {
      console.log(`   • ${admin.email} (ID: ${admin.id}) - ${admin.role}`);
    });

    console.log('\n🎉 관리자 설정이 완료되었습니다!');
    console.log('   이제 master@growsome.kr로 관리자 페이지에 접근할 수 있습니다.');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    
    if (error.code === 'P2025') {
      console.log('💡 해결방법: 먼저 데이터베이스 마이그레이션을 실행하세요:');
      console.log('   npm run db:push');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
main().catch((error) => {
  console.error('치명적 오류:', error);
  process.exit(1);
});