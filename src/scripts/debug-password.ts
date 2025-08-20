// src/scripts/debug-password.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function debugPassword() {
  try {
    console.log('🔍 비밀번호 디버깅 시작...');

    // 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { email: 'master@growsome.kr' }
    });

    if (!user) {
      console.log('❌ 사용자를 찾을 수 없습니다');
      return;
    }

    console.log('👤 사용자 정보:');
    console.log('  이메일:', user.email);
    console.log('  사용자명:', user.username);
    console.log('  비밀번호 해시:', user.password);
    console.log('  해시 길이:', user.password?.length);
    console.log('  해시 시작:', user.password?.substring(0, 10));

    // 테스트할 비밀번호들
    const testPasswords = [
      'growsome123!',
      '@1500Ek90',
      'admin',
      'password'
    ];

    console.log('\n🧪 비밀번호 테스트:');
    
    for (const testPassword of testPasswords) {
      try {
        const isValid = await bcrypt.compare(testPassword, user.password!);
        console.log(`  "${testPassword}" -> ${isValid ? '✅ 성공' : '❌ 실패'}`);
        
        if (isValid) {
          console.log(`\n🎉 올바른 비밀번호를 찾았습니다: ${testPassword}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`  "${testPassword}" -> ❌ 오류: ${errorMessage}`);
      }
    }

    // 새로운 비밀번호로 다시 설정
    console.log('\n🔄 비밀번호를 다시 설정하겠습니다...');
    const newPassword = 'growsome123!';
    const newHash = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { email: 'master@growsome.kr' },
      data: { password: newHash }
    });

    console.log('✅ 새 비밀번호가 설정되었습니다');
    console.log('   비밀번호:', newPassword);
    console.log('   새 해시:', newHash);

    // 즉시 테스트
    const testResult = await bcrypt.compare(newPassword, newHash);
    console.log('🧪 즉시 테스트 결과:', testResult ? '✅ 성공' : '❌ 실패');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ 오류:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}

debugPassword();