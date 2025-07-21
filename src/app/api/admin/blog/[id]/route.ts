// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../../../../lib/auth';
import { PrismaClient } from '@prisma/client';
import { checkAdminAccess } from '../../../../../utils/admin';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - 블로그 글 조회 (편집용)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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

      const { id } = await params;
      const blogId = parseInt(id);
      if (isNaN(blogId)) {
        return NextResponse.json({ error: '유효하지 않은 블로그 ID입니다.' }, { status: 400 });
      }

      // 블로그 글 조회
      const blogPost = await prisma.blog_contents.findUnique({
        where: { id: blogId },
        include: {
          blog_categories: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          blog_content_tags: {
            include: {
              blog_tags: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        }
      });

      if (!blogPost) {
        return NextResponse.json({ error: '블로그 글을 찾을 수 없습니다.' }, { status: 404 });
      }

      return NextResponse.json({
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        content_body: blogPost.content_body,
        excerpt: null, // excerpt 필드가 스키마에 없음
        meta_title: blogPost.meta_title,
        meta_description: blogPost.meta_description,
        category_id: blogPost.category_id,
        status: blogPost.status,
        is_featured: blogPost.is_featured,
        is_hero: blogPost.is_hero,
        thumbnail_url: blogPost.thumbnail_url,
        view_count: blogPost.view_count,
        like_count: blogPost.like_count,
        published_at: blogPost.published_at,
        created_at: blogPost.created_at,
        updated_at: blogPost.updated_at,
        category: blogPost.blog_categories,
        tags: blogPost.blog_content_tags.map(ct => ct.blog_tags)
      });

    } catch (error) {
      console.error('블로그 글 조회 오류:', error);
      return NextResponse.json(
        { error: '블로그 글을 조회하는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

// PUT - 블로그 글 수정
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
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

      const { id } = await params;
      const blogId = parseInt(id);
      if (isNaN(blogId)) {
        return NextResponse.json({ error: '유효하지 않은 블로그 ID입니다.' }, { status: 400 });
      }

      const body = await request.json();
      const {
        title,
        slug,
        content_body,
        excerpt,
        meta_title,
        meta_description,
        category_id,
        status,
        is_featured,
        is_hero,
        thumbnail_url
      } = body;

      // 필수 필드 검증
      if (!title?.trim() || !content_body?.trim()) {
        return NextResponse.json(
          { error: '제목과 내용은 필수입니다.' },
          { status: 400 }
        );
      }

      // 기존 글 존재 확인
      const existingPost = await prisma.blog_contents.findUnique({
        where: { id: blogId }
      });

      if (!existingPost) {
        return NextResponse.json({ error: '블로그 글을 찾을 수 없습니다.' }, { status: 404 });
      }

      // 슬러그 중복 확인 (다른 글과 중복되는지)
      if (slug) {
        const slugExists = await prisma.blog_contents.findFirst({
          where: {
            slug: slug,
            id: { not: blogId }
          }
        });

        if (slugExists) {
          return NextResponse.json(
            { error: '이미 사용 중인 슬러그입니다.' },
            { status: 400 }
          );
        }
      }

      // 블로그 글 수정
      const updatedPost = await prisma.blog_contents.update({
        where: { id: blogId },
        data: {
          title: title.trim(),
          slug: slug || existingPost.slug,
          content_body: content_body.trim(),
          // excerpt: excerpt?.trim() || null, // excerpt 필드가 스키마에 없음
          meta_title: meta_title?.trim() || null,
          meta_description: meta_description?.trim() || null,
          category_id: category_id ? parseInt(category_id) : existingPost.category_id,
          status: status || 'DRAFT',
          is_featured: Boolean(is_featured),
          is_hero: Boolean(is_hero),
          thumbnail_url: thumbnail_url?.trim() || null,
          published_at: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' 
            ? new Date() 
            : existingPost.published_at,
          updated_at: new Date()
        }
      });

      return NextResponse.json({
        message: '블로그 글이 성공적으로 수정되었습니다.',
        id: updatedPost.id,
        slug: updatedPost.slug,
        title: updatedPost.title,
        status: updatedPost.status
      });

    } catch (error) {
      console.error('블로그 글 수정 오류:', error);
      return NextResponse.json(
        { error: '블로그 글을 수정하는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

// DELETE - 블로그 글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
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

      const { id } = await params;
      const blogId = parseInt(id);
      if (isNaN(blogId)) {
        return NextResponse.json({ error: '유효하지 않은 블로그 ID입니다.' }, { status: 400 });
      }

      // 기존 글 존재 확인
      const existingPost = await prisma.blog_contents.findUnique({
        where: { id: blogId }
      });

      if (!existingPost) {
        return NextResponse.json({ error: '블로그 글을 찾을 수 없습니다.' }, { status: 404 });
      }

      // 관련 데이터 삭제 (cascade로 자동 삭제되지만 명시적으로)
      await prisma.$transaction(async (tx) => {
        // 댓글 삭제
        await tx.blog_comments.deleteMany({
          where: { content_id: blogId }
        });

        // 좋아요 삭제
        await tx.blog_likes.deleteMany({
          where: { content_id: blogId }
        });

        // 태그 연결 삭제
        await tx.blog_content_tags.deleteMany({
          where: { content_id: blogId }
        });

        // 블로그 글 삭제
        await tx.blog_contents.delete({
          where: { id: blogId }
        });
      });

      return NextResponse.json({
        message: '블로그 글이 성공적으로 삭제되었습니다.',
        deletedId: blogId,
        title: existingPost.title
      });

    } catch (error) {
      console.error('블로그 글 삭제 오류:', error);
      return NextResponse.json(
        { error: '블로그 글을 삭제하는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}