import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/traffic-lens/subscribers/export - 구독자 목록 CSV 내보내기
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const isActive = searchParams.get('isActive');
    const country = searchParams.get('country');
    
    // 필터 조건 구성
    const where: any = {};
    
    if (domainId) {
      where.domainId = parseInt(domainId);
    }
    
    if (isActive !== null && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }
    
    if (country) {
      where.country = country;
    }

    // 모든 구독자 조회
    const subscribers = await prisma.tLSubscriber.findMany({
      where,
      include: {
        domain: {
          select: {
            id: true,
            domain: true,
            siteName: true,
          },
        },
        _count: {
          select: {
            notifications: true,
          },
        },
      },
      orderBy: {
        subscribedAt: 'desc',
      },
    });

    // CSV 헤더
    const csvHeaders = [
      'ID',
      '사이트명',
      '도메인',
      '국가',
      '도시',
      '구독일',
      '마지막 접속',
      '알림 수',
      '상태',
      '사용자 에이전트'
    ];

    // CSV 데이터 생성
    const csvRows = subscribers.map(subscriber => [
      subscriber.id,
      subscriber.domain.siteName,
      subscriber.domain.domain,
      subscriber.country || '',
      subscriber.city || '',
      new Date(subscriber.subscribedAt).toLocaleDateString('ko-KR'),
      new Date(subscriber.lastSeen).toLocaleDateString('ko-KR'),
      subscriber._count.notifications,
      subscriber.isActive ? '활성' : '비활성',
      subscriber.userAgent || ''
    ]);

    // CSV 문자열 생성
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(field => 
          typeof field === 'string' && field.includes(',') 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n');

    // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // 파일명 생성 (현재 날짜 포함)
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `traffic-lens-subscribers-${currentDate}.csv`;

    // Response 헤더 설정
    const response = new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to export subscribers:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'EXPORT_SUBSCRIBERS_ERROR',
        message: '구독자 목록 내보내기에 실패했습니다.',
      },
    }, { status: 500 });
  }
}