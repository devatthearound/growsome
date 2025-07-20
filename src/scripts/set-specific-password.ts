// src/scripts/set-specific-password.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setSpecificPassword() {
  try {
    console.log('🔧 master@growsome.kr 비밀번호를 @1500Ek90으로 설정 중...');

    // @1500Ek90을 bcrypt 해시로 변환
    const plainPassword = '@1500Ek90';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log('🔐 새 해시 생성됨:', hashedPassword);

    // 데이터베이스 업데이트
    await prisma.user.update({
      where: { email: 'master@growsome.kr' },
      data: { password: hashedPassword }
    });

    console.log('✅ 비밀번호 업데이트 완료!');
    console.log('🔑 로그인 정보:');
    console.log('   이메일: master@growsome.kr');
    console.log('   비밀번호: @1500Ek90');

    // 테스트
    const testResult = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('🧪 테스트 결과:', testResult ? '✅ 성공' : '❌ 실패');

  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setSpecificPassword();