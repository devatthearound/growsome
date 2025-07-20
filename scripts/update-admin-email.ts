// scripts/update-admin-email.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminEmail() {
  console.log('🔄 관리자 이메일 주소 업데이트 중...');

  try {
    // admin@growsome.kr 계정을 master@growsome.kr로 변경
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@growsome.kr' }
    });

    if (existingAdmin) {
      console.log('📧 기존 admin@growsome.kr 계정 발견');
      
      // master@growsome.kr 계정이 이미 있는지 확인
      const masterAccount = await prisma.user.findFirst({
        where: { email: 'master@growsome.kr' }
      });

      if (masterAccount) {
        // master 계정이 이미 있다면 admin 계정 삭제
        console.log('⚠️ master@growsome.kr 계정이 이미 존재함. admin 계정을 삭제합니다.');
        await prisma.user.delete({
          where: { id: existingAdmin.id }
        });
        console.log('✅ admin@growsome.kr 계정이 삭제되었습니다.');
      } else {
        // master 계정이 없다면 admin 계정을 master로 변경
        console.log('🔄 admin@growsome.kr을 master@growsome.kr로 변경 중...');
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { 
            email: 'master@growsome.kr',
            username: '그로우썸 관리자'
          }
        });
        console.log('✅ 이메일이 성공적으로 변경되었습니다: admin@growsome.kr → master@growsome.kr');
      }
    } else {
      console.log('ℹ️ admin@growsome.kr 계정이 존재하지 않습니다.');
    }

    // master@growsome.kr 계정이 있는지 확인
    const masterAdmin = await prisma.user.findFirst({
      where: { email: 'master@growsome.kr' }
    });

    if (!masterAdmin) {
      // master 계정이 없다면 새로 생성
      console.log('🆕 master@growsome.kr 관리자 계정을 새로 생성합니다.');
      const newAdmin = await prisma.user.create({
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
      console.log('✅ 새 관리자 계정이 생성되었습니다:', newAdmin.email);
    } else {
      console.log('✅ master@growsome.kr 관리자 계정이 확인되었습니다.');
    }

    // 블로그 글들의 작성자도 업데이트
    const blogPosts = await prisma.blog_contents.findMany({
      include: {
        users: true
      }
    });

    let updatedPosts = 0;
    for (const post of blogPosts) {
      if (post.users?.email === 'admin@growsome.kr') {
        const masterUser = await prisma.user.findFirst({
          where: { email: 'master@growsome.kr' }
        });
        
        if (masterUser) {
          await prisma.blog_contents.update({
            where: { id: post.id },
            data: { author_id: masterUser.id }
          });
          updatedPosts++;
        }
      }
    }

    if (updatedPosts > 0) {
      console.log(`📝 ${updatedPosts}개의 블로그 글 작성자가 업데이트되었습니다.`);
    }

    console.log('\n🎉 관리자 계정 업데이트 완료!');
    console.log('📧 새 관리자 이메일: master@growsome.kr');

  } catch (error) {
    console.error('❌ 관리자 계정 업데이트 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  updateAdminEmail()
    .then(() => {
      console.log('✅ 관리자 계정 업데이트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 업데이트 실패:', error);
      process.exit(1);
    });
}

export default updateAdminEmail;