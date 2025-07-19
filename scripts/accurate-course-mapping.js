// scripts/accurate-course-mapping.js
// 실제 비메오 제목으로 정확한 강의 매핑

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 제공받은 실제 비메오 제목과 ID 매핑
const accurateMapping = [
  {
    vimeoId: '1027515090',
    vimeoTitle: '#작성팁1. 챗GPT로 사업계획서 작성하기_ 초보자를 위한 가이드',
    courseSlug: '1-black-spoon',
    newCourseTitle: '작성팁1: ChatGPT로 사업계획서 작성하기'
  },
  {
    vimeoId: '1027151927', 
    vimeoTitle: '1강. 흑수저의 실패자금 정부지원금으로 창업의 꿈을 이루세요',
    courseSlug: '2-market-analysis',
    newCourseTitle: '1강: 흑수저의 실패 → 정부지원금으로 창업 성공하기'
  },
  {
    vimeoId: '1027182303',
    vimeoTitle: '2강. 정부지원 사업 정보는 어디에 있는 걸까?',
    courseSlug: '3-financial-planning', 
    newCourseTitle: '2강: 정부지원 사업 정보 찾는 방법'
  },
  {
    vimeoId: '1029888375',
    vimeoTitle: '2주차1강 합격하는 무적의 사업계획서의 비밀',
    courseSlug: '4-marketing-strategy',
    newCourseTitle: '2주차 1강: 합격하는 무적의 사업계획서 비밀'
  },
  {
    vimeoId: '1029890528',
    vimeoTitle: '2주차3강읽고 싶게 만드는 사업계획서 글쓰기 원칙',
    courseSlug: '5-operations-organization',
    newCourseTitle: '2주차 3강: 읽고 싶게 만드는 글쓰기 원칙'
  },
  {
    vimeoId: '1029899863',
    vimeoTitle: '2주차5강작성팁 02: 미드저니 인공지능으로 비전 시각화하기',
    courseSlug: '6-risk-management',
    newCourseTitle: '작성팁2: 미드저니 AI로 비전 시각화하기'
  },
  {
    vimeoId: '1027233606',
    vimeoTitle: '3강. 선정 확률을 높이는 나만의 정부 지원 사업 골라내기',
    courseSlug: '7-investment-strategy',
    newCourseTitle: '3강: 선정 확률 높이는 정부지원사업 선택법'
  },
  {
    vimeoId: '1032201295',
    vimeoTitle: '3주차1강 심사에 통과하는 팜플렛 전략',
    courseSlug: '8-final-review',
    newCourseTitle: '3주차 1강: 심사 통과하는 팜플렛 전략'
  }
];

// 추가 강의들 (새로 생성할 수 있는 강의들)
const additionalCourses = [
  {
    vimeoId: '1032219649',
    vimeoTitle: '3주차2강시장 규모 분석 방법, 문제의 크기와 돈그릇의 관계',
    suggestedSlug: 'market-size-analysis',
    suggestedTitle: '3주차 2강: 시장 규모 분석과 수익성 평가'
  },
  {
    vimeoId: '1032240366', 
    vimeoTitle: '3주차3강경쟁자 분석 방법',
    suggestedSlug: 'competitor-analysis',
    suggestedTitle: '3주차 3강: 경쟁자 분석 방법'
  },
  {
    vimeoId: '1032252001',
    vimeoTitle: '3주차4강수익 창출 모델 구축',
    suggestedSlug: 'revenue-model',
    suggestedTitle: '3주차 4강: 수익 창출 모델 구축'
  },
  {
    vimeoId: '1032311272',
    vimeoTitle: '3주차5강작성팁 03: make.com과 Zapier로 고객 마케팅 자동화하기',
    suggestedSlug: 'marketing-automation',
    suggestedTitle: '작성팁3: 마케팅 자동화 도구 활용법'
  },
  {
    vimeoId: '1027285856',
    vimeoTitle: '4강. 무적의 사업계획서 핵심구조 'PSST' 짜기로 1분 스피치도 가능해요',
    suggestedSlug: 'psst-framework',
    suggestedTitle: '4강: PSST 프레임워크로 1분 스피치 완성'
  },
  {
    vimeoId: '1029888986',
    vimeoTitle: "'내가 사겠습니다!' 심사위원도 소비자로 만드는 아이템명 작성 방법",
    suggestedSlug: 'product-naming',
    suggestedTitle: '심사위원을 소비자로 만드는 아이템명 작성법'
  },
  {
    vimeoId: '1029894587',
    vimeoTitle: '우리 타겟 고객 정의하기: 누구를 위한 제품인가?',
    suggestedSlug: 'target-customer',
    suggestedTitle: '타겟 고객 정의하기: 제품의 진짜 고객 찾기'
  }
];

async function updateExistingCourses() {
  try {
    console.log('🔄 기존 강의 업데이트 시작...');
    console.log('='.repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const mapping of accurateMapping) {
      try {
        console.log(`🎥 "${mapping.newCourseTitle}" 업데이트 중...`);
        
        // 비메오 ID에서 해시 부분 제거
        const cleanVimeoId = mapping.vimeoId.split('/')[0];
        const vimeoUrl = `https://player.vimeo.com/video/${cleanVimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
        
        const course = await prisma.course.update({
          where: { slug: mapping.courseSlug },
          data: {
            vimeoId: cleanVimeoId,
            vimeoUrl: vimeoUrl,
            title: mapping.newCourseTitle,
            isPublic: true, // 모든 강의를 공개로 설정
            publishedAt: new Date()
          }
        });
        
        console.log(`✅ 성공: ${course.title} (ID: ${cleanVimeoId})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ 실패: ${mapping.courseSlug} - ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n📊 기존 강의 업데이트 결과:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failCount}개`);
    
    return { successCount, failCount };
    
  } catch (error) {
    console.error('❌ 기존 강의 업데이트 실패:', error);
    throw error;
  }
}

async function createAdditionalCourses() {
  try {
    console.log('\n🆕 추가 강의 생성 시작...');
    console.log('='.repeat(60));
    
    // 카테고리 확인
    const category = await prisma.courseCategory.findUnique({
      where: { slug: 'ai-business-plan' }
    });
    
    if (!category) {
      console.log('❌ 카테고리를 찾을 수 없습니다. 먼저 seed-comprehensive를 실행하세요.');
      return { createdCount: 0 };
    }
    
    let createdCount = 0;
    let startOrder = 9; // 8강 다음부터
    
    for (const course of additionalCourses) {
      try {
        console.log(`🆕 "${course.suggestedTitle}" 생성 중...`);
        
        const cleanVimeoId = course.vimeoId.split('/')[0];
        const vimeoUrl = `https://player.vimeo.com/video/${cleanVimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
        
        const newCourse = await prisma.course.create({
          data: {
            title: course.suggestedTitle,
            slug: course.suggestedSlug,
            description: `${course.suggestedTitle}에 대한 상세한 설명입니다.`,
            shortDescription: course.suggestedTitle,
            vimeoId: cleanVimeoId,
            vimeoUrl: vimeoUrl,
            duration: 1800, // 30분 기본값
            categoryId: category.id,
            level: 'intermediate',
            tags: ['정부지원사업', '사업계획서', '창업'],
            isPublic: true,
            isPremium: true,
            isVisible: true,
            sortOrder: startOrder++,
            publishedAt: new Date()
          }
        });
        
        console.log(`✅ 생성: ${newCourse.title} (ID: ${cleanVimeoId})`);
        createdCount++;
        
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ 이미 존재: ${course.suggestedSlug}`);
        } else {
          console.error(`❌ 생성 실패: ${course.suggestedSlug} - ${error.message}`);
        }
      }
    }
    
    console.log(`\n📊 추가 강의 생성 결과: ${createdCount}개 생성`);
    return { createdCount };
    
  } catch (error) {
    console.error('❌ 추가 강의 생성 실패:', error);
    throw error;
  }
}

async function showFinalResults() {
  try {
    console.log('\n📋 최종 강의 목록:');
    console.log('='.repeat(80));
    
    const allCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        slug: true,
        vimeoId: true,
        isPublic: true,
        sortOrder: true
      }
    });
    
    allCourses.forEach((course, index) => {
      const hasVideo = course.vimeoId ? '🎥' : '❌';
      const visibility = course.isPublic ? '🆓' : '🔒';
      console.log(`${hasVideo} ${visibility} ${course.sortOrder}. ${course.title}`);
      console.log(`   슬러그: ${course.slug}`);
      console.log(`   비메오: ${course.vimeoId || '없음'}`);
      console.log('');
    });
    
    console.log('🎉 모든 강의 업데이트 완료!');
    console.log('💡 이제 http://localhost:3000/courses 에서 확인해보세요.');
    
  } catch (error) {
    console.error('❌ 결과 표시 실패:', error);
  }
}

async function main() {
  const command = process.argv[2];
  
  try {
    if (command === 'update-existing') {
      await updateExistingCourses();
      await showFinalResults();
      
    } else if (command === 'create-additional') {
      await createAdditionalCourses();
      await showFinalResults();
      
    } else if (command === 'full') {
      console.log('🚀 전체 강의 매핑 시작...');
      const updateResult = await updateExistingCourses();
      const createResult = await createAdditionalCourses();
      await showFinalResults();
      
      console.log('\n🎯 최종 요약:');
      console.log(`📝 기존 강의 업데이트: ${updateResult.successCount}개`);
      console.log(`🆕 새로운 강의 생성: ${createResult.createdCount}개`);
      
    } else {
      console.log('🎯 정확한 강의 매핑 도구');
      console.log('');
      console.log('사용 가능한 명령:');
      console.log('  update-existing   - 기존 8개 강의에 올바른 비메오 링크 적용');
      console.log('  create-additional - 추가 7개 강의 새로 생성');
      console.log('  full             - 모든 작업 한번에 실행');
      console.log('');
      console.log('💡 권장: npm run accurate-course-mapping full');
    }
    
  } catch (error) {
    console.error('❌ 작업 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('✨ 모든 작업 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 작업 실패:', error);
      process.exit(1);
    });
}
