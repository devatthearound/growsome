// src/scripts/fix-all-users.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fixAllUsers() {
  try {
    console.log('🔧 Setting up passwords for all users...');

    const userUpdates = [
      { email: 'admin@growsome.com', password: 'admin123!' },
      { email: 'editor@growsome.com', password: 'editor123!' },
      { email: 'test@growsome.com', password: 'test123!' }
    ];

    for (const update of userUpdates) {
      const user = await prisma.user.findUnique({
        where: { email: update.email }
      });

      if (user && !user.password) {
        const hashedPassword = await bcrypt.hash(update.password, 10);
        
        await prisma.user.update({
          where: { email: update.email },
          data: { password: hashedPassword }
        });

        console.log(`✅ Password set for ${update.email}: ${update.password}`);
      }
    }

    console.log('🎉 All users updated!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllUsers();