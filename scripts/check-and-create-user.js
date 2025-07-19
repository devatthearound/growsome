// scripts/check-and-create-user.js
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAndCreateUser() {
  try {
    console.log('🔍 사용자 계정 확인 중...');
    
    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: 'bbuzaddaa@gmail.com' }
    });
    
    if (existingUser) {
      console.log('✅ 사용자가 이미 존재합니다:');
      console.log(`- 이메일: ${existingUser.email}`);
      console.log(`- 사용자명: ${existingUser.username}`);
      console.log(`- 생성일: ${existingUser.createdAt}`);
      
      // 비밀번호 재설정
      const newPassword = '********'; // 입력한 비밀번호
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await prisma.user.update({
        where: { email: 'bbuzaddaa@gmail.com' },
        data: { password: hashedPassword }
      });
      
      console.log('🔑 비밀번호가 재설정되었습니다.');
      
    } else {
      console.log('❌ 사용자가 존재하지 않습니다. 새로 생성합니다...');
      
      // 새 사용자 생성
      const password = '********'; // 원하는 비밀번호
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'bbuzaddaa@gmail.com',
          username: 'Growsome Admin',
          password: hashedPassword,
          phoneNumber: '010-0000-0000',
          status: 'active'
        }
      });
      
      console.log('✅ 새 사용자가 생성되었습니다:');
      console.log(`- ID: ${newUser.id}`);
      console.log(`- 이메일: ${newUser.email}`);
      console.log(`- 사용자명: ${newUser.username}`);
    }
    
    // 모든 사용자 목록 표시
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        status: true,
        createdAt: true
      }
    });
    
    console.log('\n📋 전체 사용자 목록:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.username}) - ${user.status}`);
    });
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateUser();
