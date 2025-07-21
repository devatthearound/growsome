// scripts/create-test-user.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🚀 테스트 사용자 생성 시작...');

    // 기존 사용자가 있는지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: 'bbuzaddaa@gmail.com' }
    });

    if (existingUser) {
      console.log('👤 기존 사용자가 발견되었습니다:', existingUser.email);
      
      // 비밀번호 업데이트
      const hashedPassword = await bcrypt.hash('growsome123!', 10);
      
      const updatedUser = await prisma.user.update({
        where: { email: 'bbuzaddaa@gmail.com' },
        data: {
          password: hashedPassword,
          status: 'active',
          username: 'testuser',
          phoneNumber: '010-1234-5678'
        }
      });
      
      console.log('✅ 기존 사용자 정보가 업데이트되었습니다:', {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        status: updatedUser.status
      });
    } else {
      // 새 사용자 생성
      const hashedPassword = await bcrypt.hash('growsome123!', 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'bbuzaddaa@gmail.com',
          username: 'testuser',
          password: hashedPassword,
          phoneNumber: '010-1234-5678',
          status: 'active',
          companyName: 'Test Company',
          position: 'Developer'
        }
      });
      
      console.log('✅ 새 테스트 사용자가 생성되었습니다:', {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        status: newUser.status
      });
    }

    // 비밀번호 검증 테스트
    const user = await prisma.user.findUnique({
      where: { email: 'bbuzaddaa@gmail.com' }
    });

    if (user && user.password) {
      const isValid = await bcrypt.compare('growsome123!', user.password);
      console.log('🔐 비밀번호 검증 테스트:', isValid ? '✅ 성공' : '❌ 실패');
    }

    console.log('🎉 테스트 사용자 설정 완료!');
    console.log('📝 로그인 정보:');
    console.log('   이메일: bbuzaddaa@gmail.com');
    console.log('   비밀번호: growsome123!');

  } catch (error) {
    console.error('❌ 테스트 사용자 생성 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  createTestUser();
}

export default createTestUser;