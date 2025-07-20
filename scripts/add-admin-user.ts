// scripts/add-admin-user.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAdminUser() {
  console.log('🔧 관리자 사용자 추가 중...');

  try {
    // 기존 관리자 계정 확인
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'master@growsome.kr' }
    });

    if (existingAdmin) {
      console.log('✅ 관리자 계정이 이미 존재합니다:', existingAdmin.email);
      return;
    }

    // 새 관리자 계정 생성
    const adminUser = await prisma.user.create({
      data: {
        email: 'master@growsome.kr',
        username: '그로우썸 관리자',
        password: null, // OAuth 로그인만 사용
        companyName: '그로우썸',
        position: '관리자',
        phoneNumber: '02-1234-5678',
        status: 'active'
      }
    });

    console.log('✅ 관리자 계정이 생성되었습니다:', adminUser.email);
    console.log('📧 이메일:', adminUser.email);
    console.log('👤 사용자명:', adminUser.username);
    console.log('🏢 회사:', adminUser.companyName);

  } catch (error) {
    console.error('❌ 관리자 계정 생성 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  addAdminUser()
    .then(() => {
      console.log('✅ 관리자 계정 설정 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 설정 실패:', error);
      process.exit(1);
    });
}

export default addAdminUser;