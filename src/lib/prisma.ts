import { PrismaClient } from '@prisma/client';
// 또는
// import { PrismaClient } from '@prisma/client';

// PrismaClient는 전역 변수로 선언하고 한 번만 인스턴스화합니다
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;