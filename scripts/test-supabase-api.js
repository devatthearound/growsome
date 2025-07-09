#!/usr/bin/env node

// scripts/test-supabase-api.js
// Supabase API 테스트 스크립트

const fs = require('fs');
const path = require('path');

// 환경변수 로드
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.error('.env.local 파일을 읽을 수 없습니다:', error.message);
  }
}

loadEnvFile();

async function testSupabaseDirectly() {
  console.log('🧪 Supabase API 직접 테스트\n');

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('📋 1. 카테고리 테스트');
    console.log('-------------------');
    
    const { data: categories, error: catError } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catError) {
      console.log('❌ 카테고리 조회 실패:', catError.message);
    } else {
      console.log(`✅ 카테고리 ${categories?.length || 0}개 발견`);
      categories?.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    }

    console.log('\n📄 2. 포스트 테스트');
    console.log('------------------');
    
    const { data: posts, error: postError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        status,
        published_at,
        tags,
        view_count,
        blog_categories (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5);

    if (postError) {
      console.log('❌ 포스트 조회 실패:', postError.message);
    } else {
      console.log(`✅ 포스트 ${posts?.length || 0}개 발견`);
      posts?.forEach(post => {
        console.log(`   - ${post.title}`);
        console.log(`     카테고리: ${post.blog_categories?.name || '없음'}`);
        console.log(`     조회수: ${post.view_count}`);
        console.log(`     태그: ${post.tags?.join(', ') || '없음'}`);
        console.log('');
      });
    }

    console.log('🎯 3. 요약');
    console.log('----------');
    if ((categories?.length || 0) > 0 && (posts?.length || 0) > 0) {
      console.log('✅ Supabase 데이터가 정상적으로 설정되었습니다!');
      console.log('✅ 이제 Next.js 앱에서 블로그 페이지가 정상 작동할 것입니다.');
    } else if ((categories?.length || 0) > 0) {
      console.log('⚠️  카테고리는 있지만 포스트가 없습니다.');
      console.log('💡 scripts/add-sample-blog-data.sql을 실행해서 샘플 포스트를 추가하세요.');
    } else {
      console.log('❌ 카테고리와 포스트가 모두 없습니다.');
      console.log('💡 scripts/add-sample-blog-data.sql을 실행해서 샘플 데이터를 추가하세요.');
    }

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

testSupabaseDirectly();
