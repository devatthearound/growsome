import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
import { APIResponse, CreateDomainRequest } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// VAPID 키 생성 함수
function generateVAPIDKeys() {
  return webpush.generateVAPIDKeys();
}

// GET /api/traffic-lens/domains - 도메인 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log('도메인 목록 조회 API 호출됨');
    
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    // 실제 데이터베이스에서 도메인 목록 조회
    const domains = await prisma.tLDomain.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log('조회된 도메인 수:', domains.length);

    const response: APIResponse = {
      success: true,
      data: domains,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('도메인 목록 조회 에러:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_DOMAINS_ERROR',
        message: '도메인 목록을 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/traffic-lens/domains - 도메인 생성
export async function POST(request: NextRequest) {
  try {
    console.log('도메인 생성 API 호출됨');
    
    // 임시 사용자 생성 또는 기존 사용자 확인
    let userId = 1;
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      console.log('테스트 사용자 생성 중...');
      const testUser = await prisma.user.create({
        data: {
          email: 'admin@traffic-lens.com',
          username: 'Traffic-Lens Admin',
          phoneNumber: '010-0000-0000',
          role: 'admin'
        }
      });
      userId = testUser.id;
      console.log('테스트 사용자 생성 완료:', userId);
    }

    const body: CreateDomainRequest = await request.json();
    console.log('요청 데이터:', body);
    
    // 도메인 형식 검증
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}$/;
    if (!domainRegex.test(body.domain)) {
      console.log('도메인 형식 오류:', body.domain);
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_DOMAIN',
          message: '올바른 도메인 형식이 아닙니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    console.log('도메인 중복 확인 중...');
    // 도메인 중복 확인
    const existingDomain = await prisma.tLDomain.findUnique({
      where: {
        domain: body.domain,
      },
    });

    if (existingDomain) {
      console.log('중복 도메인:', body.domain);
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_EXISTS',
          message: '이미 등록된 도메인입니다.',
        },
      };
      return NextResponse.json(response, { status: 409 });
    }

    console.log('VAPID 키 생성 중...');
    // VAPID 키 생성
    const vapidKeys = generateVAPIDKeys();
    console.log('VAPID 키 생성 완료');

    console.log('데이터베이스에 도메인 생성 중...');
    // 도메인 생성
    const domain = await prisma.tLDomain.create({
      data: {
        userId: userId,
        domain: body.domain,
        siteName: body.siteName,
        serviceWorkerPath: body.serviceWorkerPath || '/sw.js',
        vapidPublicKey: vapidKeys.publicKey,
        vapidPrivateKey: vapidKeys.privateKey,
      },
    });
    console.log('도메인 생성 완료:', domain.id);

    // 개인키는 응답에서 제외
    const { vapidPrivateKey, ...domainResponse } = domain;

    const response: APIResponse = {
      success: true,
      data: domainResponse,
      message: '도메인이 성공적으로 등록되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('도메인 생성 상세 에러:', error);
    console.error('에러 스택:', error instanceof Error ? error.stack : 'Unknown error');
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'CREATE_DOMAIN_ERROR',
        message: '도메인 생성에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
