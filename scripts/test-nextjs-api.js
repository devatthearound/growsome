#!/usr/bin/env node

// scripts/test-nextjs-api.js
// Next.js API를 통해 테스트

console.log('🌐 Next.js API 테스트');
console.log('===================\n');

async function testNextJSAPI() {
  try {
    console.log('서버가 http://localhost:3000에서 실행 중인지 확인하세요...\n');
    
    const tests = [
      { endpoint: '/api/health', description: 'Health Check' },
      { endpoint: '/api/blog/categories', description: 'Blog Categories' },
      { endpoint: '/api/blog/posts', description: 'Blog Posts' }
    ];
    
    for (const test of tests) {
      try {
        console.log(`📡 Testing ${test.description}...`);
        const response = await fetch(`http://localhost:3000${test.endpoint}`);
        const data = await response.json();
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          if (test.endpoint.includes('categories')) {
            console.log(`   Categories found: ${data.categories?.length || 0}`);
            data.categories?.slice(0, 2).forEach(cat => {
              console.log(`     - ${cat.name} (${cat.slug})`);
            });
          } else if (test.endpoint.includes('posts')) {
            console.log(`   Posts found: ${data.posts?.length || 0}`);
            data.posts?.slice(0, 2).forEach(post => {
              console.log(`     - ${post.title}`);
            });
          } else if (test.endpoint.includes('health')) {
            console.log(`   Database Status: ${data.status}`);
            console.log(`   PostgreSQL: ${data.databases?.postgresql?.connected ? '✅' : '❌'}`);
            console.log(`   Supabase: ${data.databases?.supabase?.connected ? '✅' : '❌'}`);
          }
        } else {
          console.log(`   Error: ${data.error || 'Unknown error'}`);
        }
        
        console.log('');
        
      } catch (error) {
        console.log(`   ❌ Request failed: ${error.message}`);
        if (error.message.includes('ECONNREFUSED')) {
          console.log('   💡 서버가 실행되지 않았습니다. "npm run dev"로 서버를 시작하세요.');
        }
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
  }
}

testNextJSAPI();
