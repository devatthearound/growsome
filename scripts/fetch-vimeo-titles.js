// scripts/fetch-vimeo-titles.js
// 비메오 API를 통해 실제 제목을 가져와서 매핑하는 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 제공받은 비메오 ID들 (순서대로)
const vimeoIds = [
  '1026865398',
  '1027515090', 
  '1027151927',
  '1027182303',
  '1029888375',
  '1029890528',
  '1029899863',
  '1027233606',
  '1032311272', // /94681a24cb 제거됨
  '1027285856',
  '1029888986',
  '1029894587'
];

// 비메오에서 제목 가져오기 (공개 정보만)
async function fetchVimeoTitle(vimeoId) {
  try {
    // 비메오 oEmbed API 사용 (공개 정보)
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.title;
    } else {
      console.log(`⚠️ 비메오 ${vimeoId}: API 응답 실패 (비공개 영상일 수 있음)`);
      return null;
    }
  } catch (error) {
    console.log(`❌ 비메오 ${vimeoId}: 제목 가져오기 실패`);
    return null;
  }
}

// 모든 비메오 제목 가져오기
async function fetchAllVimeoTitles() {
  console.log('🎥 비메오 제목 가져오는 중...');
  console.log('='.repeat(60));
  
  const vimeoTitles = [];
  
  for (let i = 0; i < vimeoIds.length; i++) {
    const vimeoId = vimeoIds[i];
    console.log(`${i + 1}/${vimeoIds.length} 비메오 ${vimeoId} 확인 중...`);
    
    const title = await fetchVimeoTitle(vimeoId);
    vimeoTitles.push({
      index: i + 1,
      vimeoId: vimeoId,
      title: title || `제목 없음 (ID: ${vimeoId})`,
      url: `https://vimeo.com/${vimeoId}`
    });
    
    // API 요청 간격 (1초)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return vimeoTitles;
}

// 기존 강의 목록과 매핑
async function mapWithExistingCourses(vimeoTitles) {
  console.log('\n📚 기존 강의 목록 가져오는 중...');
  
  const existingCourses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      sortOrder: true,
      vimeoId: true
    }
  });
  
  console.log('\n🔗 비메오 제목과 기존 강의 매핑:');
  console.log('='.repeat(80));
  
  const mappingSuggestions = [];
  
  vimeoTitles.forEach((vimeo, index) => {
    const existingCourse = existingCourses[index];
    
    console.log(`\n${index + 1}. 비메오: "${vimeo.title}"`);
    console.log(`   ID: ${vimeo.vimeoId}`);
    console.log(`   URL: ${vimeo.url}`);
    
    if (existingCourse) {
      console.log(`   → 기존 강의: "${existingCourse.title}"`);
      console.log(`   → 슬러그: ${existingCourse.slug}`);
      
      const shouldUpdate = existingCourse.vimeoId !== vimeo.vimeoId;
      console.log(`   → 업데이트 필요: ${shouldUpdate ? '🔄 YES' : '✅ NO'}`);
      
      mappingSuggestions.push({
        vimeoId: vimeo.vimeoId,
        vimeoTitle: vimeo.title,
        courseSlug: existingCourse.slug,
        currentTitle: existingCourse.title,
        shouldUpdate: shouldUpdate,
        suggestedAction: shouldUpdate ? 'UPDATE' : 'SKIP'
      });
    } else {
      console.log(`   → ⚠️ 매핑할 기존 강의 없음 (새로 생성 필요)`);
      
      mappingSuggestions.push({
        vimeoId: vimeo.vimeoId,
        vimeoTitle: vimeo.title,
        courseSlug: `new-course-${index + 1}`,
        currentTitle: null,
        shouldUpdate: true,
        suggestedAction: 'CREATE'
      });
    }
  });
  
  return mappingSuggestions;
}

// 업데이트 스크립트 생성
function generateUpdateScript(mappingSuggestions) {
  console.log('\n📝 업데이트 스크립트 생성:');
  console.log('='.repeat(50));
  
  const updateCommands = [];
  const createCommands = [];
  
  mappingSuggestions.forEach((mapping, index) => {
    if (mapping.suggestedAction === 'UPDATE') {
      const command = `npm run add-course-link add ${mapping.courseSlug} ${mapping.vimeoId} "${mapping.vimeoTitle}"`;
      updateCommands.push(command);
      console.log(`${index + 1}. ${command}`);
    } else if (mapping.suggestedAction === 'CREATE') {
      createCommands.push(mapping);
      console.log(`${index + 1}. ⚠️ 새 강의 생성 필요: "${mapping.vimeoTitle}"`);
    } else {
      console.log(`${index + 1}. ✅ 건너뛰기: ${mapping.courseSlug}`);
    }
  });
  
  console.log('\n🚀 실행할 명령들:');
  updateCommands.forEach(cmd => console.log(cmd));
  
  if (createCommands.length > 0) {
    console.log('\n🆕 새로 생성할 강의들:');
    createCommands.forEach(cmd => {
      console.log(`- "${cmd.vimeoTitle}" (ID: ${cmd.vimeoId})`);
    });
  }
  
  return { updateCommands, createCommands };
}

async function main() {
  const command = process.argv[2];
  
  try {
    if (command === 'fetch') {
      const vimeoTitles = await fetchAllVimeoTitles();
      const mappings = await mapWithExistingCourses(vimeoTitles);
      generateUpdateScript(mappings);
      
    } else if (command === 'quick-check') {
      console.log('📋 제공된 비메오 ID 목록:');
      vimeoIds.forEach((id, index) => {
        console.log(`${index + 1}. https://vimeo.com/${id}`);
      });
      
    } else {
      console.log('🎥 비메오 제목 확인 도구');
      console.log('');
      console.log('사용 가능한 명령:');
      console.log('  fetch       - 비메오에서 실제 제목 가져와서 매핑');
      console.log('  quick-check - 제공된 비메오 ID 목록만 확인');
      console.log('');
      console.log('💡 권장: npm run fetch-vimeo-titles fetch');
    }
    
  } catch (error) {
    console.error('❌ 작업 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
