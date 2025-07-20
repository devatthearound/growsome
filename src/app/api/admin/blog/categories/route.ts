// app/api/admin/blog/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../../lib/auth';
import { PrismaClient } from '@prisma/client';
import { checkAdminAccess } from '../../../../../utils/admin';

const prisma = new PrismaClient();

// GET - 모든 카테고리 조회
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, tokenPayload) => {
    try {
      // 관리자 권한 확인
      const user = await prisma.user.findUnique({
        where: { id: parseInt(tokenPayload.userId) },
        select: { email: true }
      });

      const { isAdmin, message } = checkAdminAccess(user?.email);
      if (!isAdmin) {
        return NextResponse.json({ error: message }, { status: 403 });
      }

      // 모든 카테고리 조회
      const categories = await prisma.blog_categories.findMany({
        orderBy: { sort_order: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          is_visible: true,
          sort_order: true,
          created_at: true,
          _count: {
            select: {
              blog_contents: true
            }
          }
        }
      });

      return NextResponse.json({
        categories: categories.map(cat => ({
          id: cat.id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          is_visible: cat.is_visible,
          sort_order: cat.sort_order,
          post_count: cat._count.blog_contents,
          created_at: cat.created_at
        }))
      });

    } catch (error) {
      console.error('카테고리 조회 오류:', error);
      return NextResponse.json(
        { error: '카테고리를 조회하는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}