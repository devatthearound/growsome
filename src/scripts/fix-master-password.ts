// src/scripts/fix-master-password.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fixMasterPassword() {
  try {
    console.log('🔧 Fixing master@growsome.kr password...');

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: 'master@growsome.kr' }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('📊 Current user data:', {
      email: user.email,
      username: user.username,
      hasPassword: !!user.password,
      currentPassword: user.password
    });

    // Create a new properly hashed password
    const plainPassword = 'growsome123!'; // You can change this
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log('🔐 Creating new password hash...');
    console.log('New hash:', hashedPassword);

    // Update the user with the new password
    await prisma.user.update({
      where: { email: 'master@growsome.kr' },
      data: { password: hashedPassword }
    });

    console.log('✅ Password updated successfully!');
    console.log('🔑 You can now login with:');
    console.log('   Email: master@growsome.kr');
    console.log('   Password: growsome123!');

    // Test the password
    const testComparison = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('🧪 Password test:', testComparison ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMasterPassword();