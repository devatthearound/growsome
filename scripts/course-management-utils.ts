// scripts/course-management-utils.ts
// 강의 데이터 관리를 위한 유틸리티 함수들

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 모든 강의 목록 조회
export async function listAllCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        userProgress: {
          select: {
            userId: true,
            isCompleted: true,
            completedAt: true,
          },
        },
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
    });

    console.log('📚 전체 강의 목록:');
    console.log('='.repeat(80));
    
    courses.forEach((course, index) => {
      const completedUsers = course.userProgress.filter(p => p.isCompleted).length;
      const status = course.isPublic ? '🆓' : '🔒';
      const level = course.level === 'beginner' ? '🟢' : course.level === 'intermediate' ? '🟡' : '🔴';
      
      console.log(`${status} ${level} ${index + 1}. ${course.title}`);
      console.log(`   📁 카테고리: ${course.category.name}`);
      console.log(`   🕐 시간: ${Math.floor(course.duration / 60)}분`);
      console.log(`   👥 완료자: ${completedUsers}명`);
      console.log(`   🔗 비메오 ID: ${course.vimeoId}`);
      console.log(`   📅 생성일: ${course.createdAt.toLocaleDateString('ko-KR')}`);
      console.log('');
    });

    return courses;
  } catch (error) {
    console.error('❌ 강의 목록 조회 실패:', error);
    throw error;
  }
}

// 특정 강의 업데이트
export async function updateCourse(slug: string, updateData: any) {
  try {
    const course = await prisma.course.update({
      where: { slug },
      data: updateData,
      include: { category: true },
    });

    console.log(`✅ 강의 업데이트 완료: ${course.title}`);
    return course;
  } catch (error) {
    console.error(`❌ 강의 업데이트 실패 (${slug}):`, error);
    throw error;
  }
}

// 비메오 URL 업데이트
export async function updateVimeoUrl(slug: string, vimeoId: string) {
  try {
    const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
    
    const course = await updateCourse(slug, {
      vimeoId,
      vimeoUrl,
    });

    console.log(`🎥 비메오 URL 업데이트: ${course.title} -> ${vimeoId}`);
    return course;
  } catch (error) {
    console.error(`❌ 비메오 URL 업데이트 실패 (${slug}):`, error);
    throw error;
  }
}

// 강의 공개/비공개 설정
export async function toggleCourseVisibility(slug: string, isPublic: boolean) {
  try {
    const course = await updateCourse(slug, {
      isPublic,
      publishedAt: isPublic ? new Date() : null,
    });

    const status = isPublic ? '공개' : '비공개';
    console.log(`👁️ 강의 ${status} 설정: ${course.title}`);
    return course;
  } catch (error) {
    console.error(`❌ 강의 공개 설정 실패 (${slug}):`, error);
    throw error;
  }
}

// 강의 순서 변경
export async function reorderCourses(categorySlug: string, courseOrder: string[]) {
  try {
    const category = await prisma.courseCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new Error(`카테고리를 찾을 수 없습니다: ${categorySlug}`);
    }

    const updates = courseOrder.map((slug, index) =>
      prisma.course.update({
        where: { slug },
        data: { sortOrder: index + 1 },
      })
    );

    await Promise.all(updates);
    console.log(`📊 강의 순서 변경 완료 (${categorySlug})`);
  } catch (error) {
    console.error(`❌ 강의 순서 변경 실패:`, error);
    throw error;
  }
}

// 사용자 진도 통계
export async function getUserProgressStats() {
  try {
    const stats = await prisma.userCourseProgress.groupBy({
      by: ['courseId'],
      _count: {
        userId: true,
      },
      _sum: {
        watchTime: true,
      },
      where: {
        isCompleted: true,
      },
    });

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        duration: true,
      },
    });

    console.log('📈 강의별 진도 통계:');
    console.log('='.repeat(60));

    stats.forEach((stat) => {
      const course = courses.find(c => c.id === stat.courseId);
      if (course) {
        const completionRate = Math.round((stat._count.userId / 100) * 100); // 전체 사용자 대비
        const avgWatchTime = Math.floor((stat._sum.watchTime || 0) / stat._count.userId / 60);
        
        console.log(`📚 ${course.title}`);
        console.log(`   ✅ 완료자: ${stat._count.userId}명`);
        console.log(`   ⏱️ 평균 시청시간: ${avgWatchTime}분`);
        console.log('');
      }
    });

    return stats;
  } catch (error) {
    console.error('❌ 진도 통계 조회 실패:', error);
    throw error;
  }
}

// 강의 삭제 (주의!)
export async function deleteCourse(slug: string) {
  try {
    // 진도 데이터 먼저 삭제
    await prisma.userCourseProgress.deleteMany({
      where: {
        course: { slug },
      },
    });

    // 강의 삭제
    const deletedCourse = await prisma.course.delete({
      where: { slug },
    });

    console.log(`🗑️ 강의 삭제 완료: ${deletedCourse.title}`);
    return deletedCourse;
  } catch (error) {
    console.error(`❌ 강의 삭제 실패 (${slug}):`, error);
    throw error;
  }
}

// CLI 인터페이스
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];

  try {
    switch (command) {
      case 'list':
        await listAllCourses();
        break;
        
      case 'update-vimeo':
        if (!arg1 || !arg2) {
          console.log('사용법: npm run course-utils update-vimeo <slug> <vimeoId>');
          break;
        }
        await updateVimeoUrl(arg1, arg2);
        break;
        
      case 'toggle-public':
        if (!arg1 || !arg2) {
          console.log('사용법: npm run course-utils toggle-public <slug> <true|false>');
          break;
        }
        await toggleCourseVisibility(arg1, arg2 === 'true');
        break;
        
      case 'stats':
        await getUserProgressStats();
        break;
        
      case 'delete':
        if (!arg1) {
          console.log('사용법: npm run course-utils delete <slug>');
          break;
        }
        console.log('⚠️ 정말로 삭제하시겠습니까? (y/N)');
        // 실제 구현에서는 readline 사용
        await deleteCourse(arg1);
        break;
        
      default:
        console.log('📚 강의 관리 도구');
        console.log('');
        console.log('사용 가능한 명령:');
        console.log('  list                    - 모든 강의 목록 조회');
        console.log('  update-vimeo <slug> <id> - 비메오 ID 업데이트');
        console.log('  toggle-public <slug> <bool> - 공개/비공개 설정');
        console.log('  stats                   - 진도 통계 조회');
        console.log('  delete <slug>           - 강의 삭제');
        break;
    }
  } catch (error) {
    console.error('❌ 명령 실행 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
