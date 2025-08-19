import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// GET /api/traffic-lens/domains/[id] - 특정 도메인 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domainId = parseInt(id);
    
    if (isNaN(domainId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_DOMAIN_ID',
          message: '올바른 도메인 ID가 아닙니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const domain = await prisma.tLDomain.findUnique({
      where: {
        id: domainId,
      },
      include: {
        _count: {
          select: {
            subscribers: true,
            campaigns: true,
          },
        },
      },
    });

    if (!domain) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_NOT_FOUND',
          message: '도메인을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 개인키는 응답에서 제외
    const { vapidPrivateKey, ...domainResponse } = domain;

    const response: APIResponse = {
      success: true,
      data: domainResponse,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch domain:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_DOMAIN_ERROR',
        message: '도메인을 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/traffic-lens/domains/[id] - 도메인 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domainId = parseInt(id);
    
    if (isNaN(domainId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_DOMAIN_ID',
          message: '올바른 도메인 ID가 아닙니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const body = await request.json();
    const { siteName, serviceWorkerPath, isActive } = body;

    // 도메인 존재 확인
    const existingDomain = await prisma.tLDomain.findUnique({
      where: { id: domainId },
    });

    if (!existingDomain) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_NOT_FOUND',
          message: '도메인을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 도메인 업데이트
    const updatedDomain = await prisma.tLDomain.update({
      where: { id: domainId },
      data: {
        ...(siteName && { siteName }),
        ...(serviceWorkerPath && { serviceWorkerPath }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });

    // 개인키는 응답에서 제외
    const { vapidPrivateKey, ...domainResponse } = updatedDomain;

    const response: APIResponse = {
      success: true,
      data: domainResponse,
      message: '도메인이 성공적으로 수정되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update domain:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'UPDATE_DOMAIN_ERROR',
        message: '도메인 수정에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/traffic-lens/domains/[id] - 도메인 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domainId = parseInt(id);
    
    if (isNaN(domainId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_DOMAIN_ID',
          message: '올바른 도메인 ID가 아닙니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 도메인 존재 확인
    const existingDomain = await prisma.tLDomain.findUnique({
      where: { id: domainId },
    });

    if (!existingDomain) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_NOT_FOUND',
          message: '도메인을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 관련 데이터 확인 (구독자, 캠페인 등)
    const relatedData = await prisma.tLDomain.findUnique({
      where: { id: domainId },
      include: {
        _count: {
          select: {
            subscribers: true,
            campaigns: true,
          },
        },
      },
    });

    // 관련 데이터가 있는 경우 확인 메시지
    if (relatedData && (relatedData._count.subscribers > 0 || relatedData._count.campaigns > 0)) {
      // 실제로는 CASCADE 삭제가 설정되어 있으므로 모든 관련 데이터가 함께 삭제됩니다.
      console.warn(`Deleting domain ${domainId} with ${relatedData._count.subscribers} subscribers and ${relatedData._count.campaigns} campaigns`);
    }

    // 도메인 삭제 (CASCADE로 인해 관련 데이터도 함께 삭제됨)
    await prisma.tLDomain.delete({
      where: { id: domainId },
    });

    const response: APIResponse = {
      success: true,
      message: '도메인이 성공적으로 삭제되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to delete domain:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'DELETE_DOMAIN_ERROR',
        message: '도메인 삭제에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
