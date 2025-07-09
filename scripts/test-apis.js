#!/usr/bin/env node

// scripts/test-apis.js
// Quick API test script - run with: node scripts/test-apis.js

console.log('🧪 Testing APIs directly...\n');

async function testAPI(endpoint, description) {
  try {
    console.log(`Testing ${description}...`);
    const response = await fetch(`http://localhost:3000${endpoint}`);
    const data = await response.json();
    
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Response:`, JSON.stringify(data, null, 2).substring(0, 300) + '...');
    console.log('');
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('Make sure your Next.js server is running (npm run dev)\n');
  
  const tests = [
    { endpoint: '/api/health', description: 'Health Check' },
    { endpoint: '/api/auth/check', description: 'Auth Check' },
    { endpoint: '/api/blog/categories', description: 'Blog Categories' },
    { endpoint: '/api/blog/posts', description: 'Blog Posts' }
  ];
  
  for (const test of tests) {
    await testAPI(test.endpoint, test.description);
  }
  
  console.log('📋 Summary:');
  console.log('- If you see 500 errors, there are database connection issues');
  console.log('- If you see 401 errors for auth, that\'s normal (no login)'); 
  console.log('- If categories/posts return empty arrays, tables may not exist');
  console.log('- Check the health endpoint first for database status\n');
}

// Only run if we can connect to localhost
if (process.argv.includes('--test')) {
  runTests().catch(console.error);
} else {
  console.log('To run this test, use: node scripts/test-apis.js --test');
  console.log('Make sure your dev server is running first: npm run dev\n');
}
