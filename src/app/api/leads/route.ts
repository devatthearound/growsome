import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, company, product, source = 'funnel' } = body;

    // 필수 필드 검증
    if (!name || !phone || !email || !product) {
      return NextResponse.json(
        { error: '이름, 전화번호, 이메일, 제품/서비스는 필수입니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (한국 전화번호)
    const numbersOnly = phone.replace(/[^0-9]/g, '');
    if (numbersOnly.length < 10 || numbersOnly.length > 11) {
      return NextResponse.json(
        { error: '올바른 전화번호를 입력해주세요.' },
        { status: 400 }
      );
    }
    if (!numbersOnly.startsWith('01')) {
      return NextResponse.json(
        { error: '올바른 휴대폰 번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // IP 주소와 User-Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 리드 생성
    const lead = await prisma.surveyResponse.create({
      data: {
        name,
        phone,
        email,
        company: company || null,
        businessStage: 'funnel_lead',
        mainConcern: 'funnel_interest',
        currentWebsite: 'funnel_source',
        desiredTimeline: 'asap',
        budgetRange: 'not_specified',
        dataCollection: 'funnel_lead',
        desiredData: 'funnel_interest',
        brandingSituation: 'funnel_lead',
        brandDirection: 'funnel_interest',
        ipAddress,
        userAgent,
        referrer: request.headers.get('referer') || null,
        status: 'pending',
        isProcessed: false,
        notes: `Source: ${source}, Product: ${product}`
      }
    });

    return NextResponse.json({
      success: true,
      message: '리드가 성공적으로 등록되었습니다.',
      leadId: lead.id
    });

  } catch (error) {
    console.error('리드 등록 오류:', error);
    return NextResponse.json(
      { error: '리드 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 