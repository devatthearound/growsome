// scripts/fix-course-titles.js
// 실제 비메오 제목으로 강의명 정확히 수정

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 실제 제공받은 비메오 제목으로 정확한 매핑
const correctTitles = [
  {
    vimeoId: '1027515090',
    correctTitle: '#작성팁1. 챗GPT로 사업계획서 작성하기_ 초보자를 위한 가이드',
    slug: '1-black-spoon' // 또는 기존 첫 번째 강의
  },
  {
    vimeoId: '1027151927',
    correctTitle: '1강. 흑수저의 실패자금 정부지원금으로 창업의 꿈을 이루세요',
    slug: '2-market-analysis' // 또는 기존 두 번째 강의
  },
  {
    vimeoId: '1027182303',
    correctTitle: '2강. 정부지원 사업 정보는 어디에 있는 걸까?',
    slug: '3-financial-planning'
  },
  {
    vimeoId: '1029888375',
    correctTitle: '2주차1강 합격하는 무적의 사업계획서의 비밀',
    slug: '4-marketing-strategy'
  },
  {
    vimeoId: '1029890528',
    correctTitle: '2주차3강읽고 싶게 만드는 사업계획서 글쓰기 원칙',
    slug: '5-operations-organization'
  },
  {
    vimeoId: '1029899863',
    correctTitle: '2주차5강작성팁 02: 미드저니 인공지능으로 비전 시각화하기',
    slug: '6-risk-management'
  },
  {
    vimeoId: '1027233606',
    correctTitle: '3강. 선정 확률을 높이는 나만의 정부 지원 사업 골라내기',
    slug: '7-investment-strategy'
  },
  {
    vimeoId: '1032201295',
    correctTitle: '3주차1강 심사에 통과하는 팜플렛 전략',
    slug: '8-final-review'
  },
  {
    vimeoId: '1032219649',
    correctTitle: '3주차2강시장 규모 분석 방법, 문제의 크기와 돈그릇의 관계',
    slug: 'market-size-analysis'
  },
  {
    vimeoId: '1032240366',
    correctTitle: '3주차3강경쟁자 분석 방법',
    slug: 'competitor-analysis'
  },
  {
    vimeoId: '1032252001',
    correctTitle: '3주차4강수익 창출 모델 구축',
    slug: 'revenue-model'
  },
  {
    vimeoId: '1032311272',
    correctTitle: '3주차5강작성팁 03: make.com과 Zapier로 고객 마케팅 자동화하기',
    slug: 'marketing-automation'
  },
  {
    vimeoId: '1027285856',
    correctTitle: '4강. 무적의 사업계획서 핵심구조 'PSST' 짜기로 1분 스피치도 가능해요',
    slug: 'psst-framework'
  },
  {
    vimeoId: '1029888986',
    correctTitle: "'내가 사겠습니다!' 심사위원도 소비자로 만드는 아이템명 작성 방법",
    slug: 'product-naming'
  },
  {
    vimeoId: '1029894587',
    correctTitle: '우리 타겟 고객 정의하기: 누구를 위한 제품인가?',
    slug: 'target-customer'
  }
];

async function fixCourseTitles() {
  try {
    console.log('📝 강의 제목을 실제 비메오 제목으로 수정 중...');
    console.log('='.repeat(70));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const titleData of correctTitles) {
      try {
        // 비메오 ID로 강의 찾기
        const course = await prisma.course.findFirst({
          where: { vimeoId: titleData.vimeoId }
        });
        
        if (course) {
          // 제목 업데이트
          await prisma.course.update({
            where: { id: course.id },
            data: {
              title: titleData.correctTitle
            }
          });
          
          console.log(`✅ ${course.title}`);
          console.log(`   → ${titleData.correctTitle}`);
          console.log('');
          successCount++;
        } else {
          console.log(`⚠️ 비메오 ID ${titleData.vimeoId}에 해당하는 강의를 찾을 수 없음`);
          failCount++;
        }
        
      } catch (error) {
        console.error(`❌ 비메오 ID ${titleData.vimeoId} 업데이트 실패:`, error.message);
        failCount++;
      }
    }
    
    console.log('📊 수정 결과:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failCount}개`);
    
  } catch (error) {
    console.error('❌ 제목 수정 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function showUpdatedList() {
  try {
    console.log('\n📋 수정된 강의 목록:');
    console.log('='.repeat(80));
    
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        slug: true,
        vimeoId: true,
        isPublic: true,
        sortOrder: true
      }
    });
    
    courses.forEach((course, index) => {
      const status = course.isPublic ? '🆓' : '🔒';
      const hasVideo = course.vimeoId ? '🎥' : '❌';
      console.log(`${status} ${hasVideo} ${course.sortOrder || index + 1}. ${course.title}`);
    });
    
    console.log('\n🎉 모든 제목이 실제 비메오 제목으로 업데이트되었습니다!');
    
  } catch (error) {
    console.error('❌ 목록 표시 실패:', error);
  }
}

async function main() {
  const command = process.argv[2];
  
  if (command === 'fix') {
    await fixCourseTitles();
    await showUpdatedList();
  } else if (command === 'preview') {
    console.log('📋 수정할 제목 미리보기:');
    console.log('='.repeat(70));
    
    correctTitles.forEach((item, index) => {
      console.log(`${index + 1}. ${item.correctTitle}`);
      console.log(`   비메오 ID: ${item.vimeoId}`);
      console.log('');
    });
    
    console.log('💡 실제 수정: npm run fix-course-titles fix');
  } else {
    console.log('📝 강의 제목 수정 도구');
    console.log('');
    console.log('사용 가능한 명령:');
    console.log('  preview - 수정할 제목 미리보기');
    console.log('  fix     - 실제 제목 수정');
    console.log('');
    console.log('💡 권장: npm run fix-course-titles fix');
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('✨ 작업 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 작업 실패:', error);
      process.exit(1);
    });
}
