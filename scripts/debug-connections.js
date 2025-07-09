#!/usr/bin/env node

// scripts/debug-connections.js
// Run this script with: node scripts/debug-connections.js

// Simple environment loader without dotenv dependency
const fs = require('fs');
const path = require('path');

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
    console.error('Could not load .env.local file:', error.message);
  }
}

// Load environment variables
loadEnvFile();

async function debugConnections() {
  console.log('🔍 Database Connection Debug Tool');
  console.log('================================\n');

  // 1. Environment Variables Check
  console.log('📋 Environment Variables:');
  console.log('-------------------------');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST ? '✅ Set' : '❌ Missing');
  console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE ? '✅ Set' : '❌ Missing');
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER ? '✅ Set' : '❌ Missing');
  console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? '✅ Set' : '❌ Missing');
  console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT || 'Not set (will use 5432)');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log();

  // 2. PostgreSQL Connection Test
  console.log('🐘 PostgreSQL Connection Test:');
  console.log('-------------------------------');
  
  if (!process.env.POSTGRES_HOST || !process.env.POSTGRES_DATABASE) {
    console.log('❌ PostgreSQL configuration incomplete');
    console.log('   Missing required environment variables');
  } else {
    try {
      const { Pool } = require('pg');
      const pgPool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        ssl: false,
        connectionTimeoutMillis: 5000, // 5 second timeout
      });

      console.log(`   Attempting connection to: ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}`);
      
      const client = await pgPool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as version');
      client.release();
      
      console.log('✅ PostgreSQL connection successful');
      console.log('   Current time:', result.rows[0].current_time);
      console.log('   Version:', result.rows[0].version.split(' ')[0]);
      
      // Test users table
      try {
        const client2 = await pgPool.connect();
        const usersResult = await client2.query('SELECT COUNT(*) as user_count FROM users');
        client2.release();
        console.log('   Users table:', `${usersResult.rows[0].user_count} users found`);
      } catch (tableError) {
        console.log('   Users table: ❌ Table not found or inaccessible');
        console.log('   Error:', tableError.message);
      }
      
      await pgPool.end();
      
    } catch (error) {
      console.log('❌ PostgreSQL connection failed');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('   💡 Suggestion: Check if PostgreSQL server is running');
      } else if (error.code === 'ENOTFOUND') {
        console.log('   💡 Suggestion: Check if host address is correct');
      } else if (error.code === '28P01') {
        console.log('   💡 Suggestion: Check username/password');
      }
    }
  }
  console.log();

  // 3. Supabase Connection Test
  console.log('🗄️  Supabase Connection Test:');
  console.log('-----------------------------');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Supabase configuration incomplete');
    console.log('   Missing required environment variables');
  } else {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      console.log(`   Attempting connection to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

      // Test basic connection with a simple query
      const { data: healthData, error: healthError } = await supabase
        .from('_fake_table_for_connection_test')
        .select('*')
        .limit(1);

      if (healthError) {
        if (healthError.message.includes('does not exist')) {
          console.log('✅ Supabase connection successful (table not found is expected)');
        } else {
          console.log('⚠️  Supabase connection issue:', healthError.message);
          console.log('   Code:', healthError.code);
        }
      } else {
        console.log('✅ Supabase connection successful');
      }

      // Test blog_categories table
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('count', { count: 'exact', head: true })
          .limit(1);

        if (categoriesError) {
          if (categoriesError.code === 'PGRST116' || categoriesError.message.includes('does not exist')) {
            console.log('   blog_categories table: ❌ Table not found');
            console.log('   💡 This explains the 500 error - table needs to be created');
          } else {
            console.log('   blog_categories table: ❌ Error:', categoriesError.message);
          }
        } else {
          console.log('   blog_categories table: ✅ Found');
        }
      } catch (tableError) {
        console.log('   blog_categories table: ❌ Error accessing table');
        console.log('   Error:', tableError.message);
      }

    } catch (error) {
      console.log('❌ Supabase connection failed');
      console.log('   Error:', error.message);
      
      if (error.message.includes('Invalid API key')) {
        console.log('   💡 Suggestion: Check Supabase API key');
      } else if (error.message.includes('Invalid URL')) {
        console.log('   💡 Suggestion: Check Supabase URL format');
      }
    }
  }
  console.log();

  // 4. API Health Test
  console.log('🌐 API Health Test:');
  console.log('-------------------');
  console.log('   Start your Next.js server with: npm run dev');
  console.log('   Then test these endpoints:');
  console.log('   • http://localhost:3000/api/health');
  console.log('   • http://localhost:3000/api/auth/check');
  console.log('   • http://localhost:3000/api/blog/categories');
  console.log();

  // 5. Recommendations
  console.log('💡 Recommendations:');
  console.log('-------------------');
  
  if (!process.env.POSTGRES_HOST) {
    console.log('• Configure PostgreSQL connection in .env.local');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('• Configure Supabase connection in .env.local');
  }
  
  console.log('• Ensure PostgreSQL server is running and accessible');
  console.log('• Create blog_categories table in Supabase if missing');
  console.log('• Check firewall settings for database connections');
  console.log('• Verify credentials and permissions');
  console.log();
}

// Run the debug tool
debugConnections().catch(error => {
  console.error('Debug script failed:', error);
  process.exit(1);
});
