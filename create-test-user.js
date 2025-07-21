// 테스트 사용자 생성을 위한 스크립트
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔗 데이터베이스 연결 중...');
    await prisma.$connect();
    
    const email = 'bbuzaddaa@gmail.com';
    const password = 'growsome123!';
    
    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('👤 기존 사용자 발견:', existingUser);
      
      // 비밀번호 업데이트
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          password: hashedPassword,
          status: 'active'
        }
      });
      
      console.log('🔄 사용자 정보 업데이트 완료');
      console.log('📧 이메일:', email);
      console.log('🔑 새 비밀번호:', password);
      console.log('🔐 해시된 비밀번호:', hashedPassword);
      
      // 비밀번호 검증 테스트
      const isValid = await bcrypt.compare(password, hashedPassword);
      console.log('✅ 비밀번호 검증 테스트:', isValid);
      
    } else {
      // 새 사용자 생성
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          username: 'testuser',
          password: hashedPassword,
          phoneNumber: '010-0000-0000',
          status: 'active'
        }
      });
      
      console.log('🆕 새 사용자 생성 완료');
      console.log('📧 이메일:', email);
      console.log('🔑 비밀번호:', password);
      console.log('👤 사용자 ID:', newUser.id);
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();