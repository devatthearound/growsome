#!/usr/bin/env node

/**
 * 🔍 Growsome SEO 설정 점검 스크립트
 * 
 * 이 스크립트는 SEO 설정이 올바르게 구성되었는지 확인합니다.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Growsome SEO 설정 점검을 시작합니다...\n')

const checkResults = {
  passed: [],
  failed: [],
  warnings: []
}

// 1. 필수 파일 존재 여부 확인
function checkRequiredFiles() {
  console.log('📁 필수 파일 존재 여부 확인...')
  
  const requiredFiles = [
    'src/app/sitemap.ts',
    'src/app/robots.ts',
    'src/lib/metadata.ts',
    'src/components/seo/StructuredData.tsx',
    'src/components/seo/SEOAnalyzer.tsx',
    'src/components/seo/SEOHead.tsx',
    'public/robots.txt'
  ]

  requiredFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      checkResults.passed.push(`✅ ${file} 파일이 존재합니다`)
    } else {
      checkResults.failed.push(`❌ ${file} 파일이 없습니다`)
    }
  })
}

// 2. 환경변수 확인
function checkEnvironmentVariables() {
  console.log('🔧 환경변수 설정 확인...')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SITE_NAME',
    'NEXT_PUBLIC_SITE_DESCRIPTION'
  ]

  const optionalEnvVars = [
    'GOOGLE_SITE_VERIFICATION',
    'NAVER_SITE_VERIFICATION',
    'BING_VERIFICATION'
  ]

  // .env.local 파일 읽기
  const envPath = path.join(process.cwd(), '.env.local')
  let envContent = ''
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
    checkResults.passed.push('✅ .env.local 파일이 존재합니다')
  } else {
    checkResults.failed.push('❌ .env.local 파일이 없습니다')
    return
  }

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar) && !envContent.includes(`${envVar}="your-`)) {
      checkResults.passed.push(`✅ ${envVar} 환경변수가 설정되었습니다`)
    } else {
      checkResults.failed.push(`❌ ${envVar} 환경변수가 설정되지 않았습니다`)
    }
  })

  optionalEnvVars.forEach(envVar => {
    if (envContent.includes(envVar) && !envContent.includes(`${envVar}="your-`)) {
      checkResults.passed.push(`✅ ${envVar} 환경변수가 설정되었습니다`)
    } else {
      checkResults.warnings.push(`⚠️ ${envVar} 환경변수가 설정되지 않았습니다 (선택사항)`)
    }
  })
}

// 3. package.json 의존성 확인
function checkDependencies() {
  console.log('📦 필요한 의존성 확인...')
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    checkResults.failed.push('❌ package.json 파일이 없습니다')
    return
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

  const requiredDeps = [
    '@prisma/client',
    'next'
  ]

  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      checkResults.passed.push(`✅ ${dep} 의존성이 설치되어 있습니다`)
    } else {
      checkResults.failed.push(`❌ ${dep} 의존성이 설치되지 않았습니다`)
    }
  })
}

// 4. 메타데이터 설정 확인
function checkMetadataConfiguration() {
  console.log('🏷️ 메타데이터 설정 확인...')
  
  const metadataPath = path.join(process.cwd(), 'src/lib/metadata.ts')
  if (!fs.existsSync(metadataPath)) {
    checkResults.failed.push('❌ metadata.ts 파일이 없습니다')
    return
  }

  const metadataContent = fs.readFileSync(metadataPath, 'utf8')
  
  const requiredExports = [
    'defaultMetadata',
    'generatePageMetadata',
    'generateBlogMetadata'
  ]

  requiredExports.forEach(exportName => {
    if (metadataContent.includes(`export function ${exportName}`) || 
        metadataContent.includes(`export const ${exportName}`)) {
      checkResults.passed.push(`✅ ${exportName} 함수가 정의되어 있습니다`)
    } else {
      checkResults.failed.push(`❌ ${exportName} 함수가 정의되지 않았습니다`)
    }
  })
}

// 5. 구조화된 데이터 확인
function checkStructuredData() {
  console.log('📊 구조화된 데이터 설정 확인...')
  
  const structuredDataPath = path.join(process.cwd(), 'src/components/seo/StructuredData.tsx')
  if (!fs.existsSync(structuredDataPath)) {
    checkResults.failed.push('❌ StructuredData.tsx 파일이 없습니다')
    return
  }

  const structuredDataContent = fs.readFileSync(structuredDataPath, 'utf8')
  
  const requiredSchemas = [
    'organization',
    'article',
    'website',
    'breadcrumb',
    'faq'
  ]

  requiredSchemas.forEach(schema => {
    if (structuredDataContent.includes(`case '${schema}':`)) {
      checkResults.passed.push(`✅ ${schema} 스키마가 구현되어 있습니다`)
    } else {
      checkResults.failed.push(`❌ ${schema} 스키마가 구현되지 않았습니다`)
    }
  })
}

// 6. robots.txt 확인
function checkRobotsFile() {
  console.log('🤖 robots.txt 파일 확인...')
  
  const robotsPath = path.join(process.cwd(), 'public/robots.txt')
  if (!fs.existsSync(robotsPath)) {
    checkResults.failed.push('❌ public/robots.txt 파일이 없습니다')
    return
  }

  const robotsContent = fs.readFileSync(robotsPath, 'utf8')
  
  const requiredDirectives = [
    'User-agent: *',
    'Sitemap:',
    'Disallow: /api/',
    'Disallow: /admin/'
  ]

  requiredDirectives.forEach(directive => {
    if (robotsContent.includes(directive)) {
      checkResults.passed.push(`✅ robots.txt에 "${directive}" 지시문이 있습니다`)
    } else {
      checkResults.failed.push(`❌ robots.txt에 "${directive}" 지시문이 없습니다`)
    }
  })
}

// 7. 이미지 파일 확인
function checkImageFiles() {
  console.log('🖼️ SEO 이미지 파일 확인...')
  
  const imageFiles = [
    'public/favicon.ico',
    'public/apple-touch-icon.png'
  ]

  imageFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      checkResults.passed.push(`✅ ${file} 파일이 존재합니다`)
    } else {
      checkResults.warnings.push(`⚠️ ${file} 파일이 없습니다 (권장)`)
    }
  })
}

// 실행
function runChecks() {
  checkRequiredFiles()
  checkEnvironmentVariables()
  checkDependencies()
  checkMetadataConfiguration()
  checkStructuredData()
  checkRobotsFile()
  checkImageFiles()
}

// 결과 출력
function printResults() {
  console.log('\n' + '='.repeat(60))
  console.log('🔍 SEO 설정 점검 결과')
  console.log('='.repeat(60))

  if (checkResults.passed.length > 0) {
    console.log('\n✅ 통과한 항목들:')
    checkResults.passed.forEach(item => console.log(`  ${item}`))
  }

  if (checkResults.warnings.length > 0) {
    console.log('\n⚠️ 경고 사항들:')
    checkResults.warnings.forEach(item => console.log(`  ${item}`))
  }

  if (checkResults.failed.length > 0) {
    console.log('\n❌ 실패한 항목들:')
    checkResults.failed.forEach(item => console.log(`  ${item}`))
  }

  console.log('\n' + '='.repeat(60))
  
  const totalChecks = checkResults.passed.length + checkResults.failed.length + checkResults.warnings.length
  const score = Math.round((checkResults.passed.length / (totalChecks - checkResults.warnings.length)) * 100)
  
  console.log(`📊 전체 점수: ${score}% (${checkResults.passed.length}/${totalChecks - checkResults.warnings.length})`)
  
  if (score >= 90) {
    console.log('🎉 훌륭합니다! SEO 설정이 잘 되어 있습니다.')
  } else if (score >= 70) {
    console.log('👍 좋습니다! 몇 가지 항목만 더 개선하면 완벽해집니다.')
  } else if (score >= 50) {
    console.log('⚠️ 기본적인 SEO 설정은 되어 있지만 개선이 필요합니다.')
  } else {
    console.log('🚨 SEO 설정에 심각한 문제가 있습니다. 즉시 수정이 필요합니다.')
  }

  if (checkResults.failed.length > 0) {
    console.log('\n📋 다음 단계:')
    console.log('1. 실패한 항목들을 우선적으로 수정하세요')
    console.log('2. npm run build를 실행하여 빌드 오류가 없는지 확인하세요')
    console.log('3. npm run dev로 개발 서버를 시작하고 /sitemap.xml, /robots.txt 접근을 확인하세요')
    console.log('4. Google Search Console에서 사이트맵을 제출하세요')
  }

  console.log('\n🔗 유용한 링크:')
  console.log('- Google Search Console: https://search.google.com/search-console')
  console.log('- 구조화된 데이터 테스트: https://search.google.com/test/rich-results')
  console.log('- 페이지 속도 측정: https://pagespeed.web.dev/')
  console.log('- SEO 분석 도구: https://www.seobility.net/en/seocheck/')

  console.log('\n' + '='.repeat(60))
}

// 스크립트 실행
runChecks()
printResults()

// 프로세스 종료 코드 설정
process.exit(checkResults.failed.length > 0 ? 1 : 0)
