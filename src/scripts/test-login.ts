// src/scripts/test-login.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLoginCredentials() {
  try {
    console.log('🧪 Testing login credentials...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        status: true
      }
    });

    console.log('📊 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.username})`);
      console.log(`    Status: ${user.status}`);
      console.log(`    Password: ${user.password ? (user.password.startsWith('$2b$') ? 'bcrypt hash' : 'plain/other') : 'null'}`);
      console.log('');
    });

    // Test master@growsome.kr specifically
    const masterUser = users.find(u => u.email === 'master@growsome.kr');
    
    if (masterUser) {
      console.log('🔍 Testing master@growsome.kr...');
      
      if (masterUser.password) {
        // Test common passwords
        const testPasswords = [
          'growsome123!',
          '@1500Ek90',
          'password',
          'admin',
          'master'
        ];

        for (const testPassword of testPasswords) {
          try {
            let isValid = false;
            
            if (masterUser.password.startsWith('$2b$') || masterUser.password.startsWith('$2a$')) {
              isValid = await bcrypt.compare(testPassword, masterUser.password);
            } else {
              isValid = testPassword === masterUser.password;
            }
            
            console.log(`  Testing "${testPassword}": ${isValid ? '✅ MATCH' : '❌ No match'}`);
            
            if (isValid) {
              console.log(`\n🎉 Working credentials found!`);
              console.log(`   Email: master@growsome.kr`);
              console.log(`   Password: ${testPassword}`);
              break;
            }
          } catch (error) {
            console.log(`  Testing "${testPassword}": ❌ Error - ${error.message}`);
          }
        }
      } else {
        console.log('  ❌ No password set for master user');
      }
    } else {
      console.log('❌ master@growsome.kr not found in database');
    }

  } catch (error) {
    console.error('❌ Error testing credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginCredentials();