// scripts/setup-admin-login.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setupAdminLogin() {
  console.log('🔧 관리자 로그인 설정 중...');

  try {
    // master@growsome.kr 계정 확인
    let adminUser = await prisma.user.findFirst({
      where: { email: 'master@growsome.kr' }
    });

    if (!adminUser) {
      // 계정이 없으면 생성
      console.log('🆕 master@growsome.kr 계정을 생성합니다...');
      adminUser = await prisma.user.create({
        data: {
          email: 'master@growsome.kr',
          username: '그로우썸 관리자',
          password: null,
          companyName: '그로우썸',
          position: '관리자',
          phoneNumber: '02-1234-5678',
          status: 'active'
        }
      });
      console.log('✅ 관리자 계정이 생성되었습니다.');
    }

    // 임시 비밀번호 설정 (개발용)
    const tempPassword = 'growsome2025!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { 
        password: hashedPassword,
        status: 'active'
      }
    });

    console.log('✅ 관리자 로그인 정보 설정 완료!');
    console.log('📧 이메일: master@growsome.kr');
    console.log('🔑 임시 비밀번호: growsome2025!');
    console.log('⚠️  보안을 위해 로그인 후 비밀번호를 변경해주세요.');

  } catch (error) {
    console.error('❌ 관리자 로그인 설정 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  setupAdminLogin()
    .then(() => {
      console.log('✅ 관리자 로그인 설정 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 설정 실패:', error);
      process.exit(1);
    });
}

export default setupAdminLogin;