import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('받은 설문 데이터:', JSON.stringify(body, null, 2)); // 디버깅용
    
    // 요청 데이터 검증
    const {
      businessStage,
      mainConcern,
      currentWebsite,
      desiredTimeline,
      budgetRange,
      dataCollection,
      desiredData,
      brandingSituation,
      brandDirection,
      name,
      phone,
      email,
      company
    } = body;

    // 필수 필드 검증 (company는 선택사항)
    const requiredFields = {
      businessStage,
      mainConcern,
      currentWebsite,
      desiredTimeline,
      budgetRange,
      dataCollection,
      desiredData,
      brandingSituation,
      brandDirection,
      name,
      phone,
      email
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.toString().trim() === '')
      .map(([key, value]) => key);

    if (missingFields.length > 0) {
      console.log('누락된 필드:', missingFields);
      return NextResponse.json(
        { 
          error: '필수 필드가 누락되었습니다.',
          missingFields: missingFields
        },
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

    // 휴대폰 번호 형식 검증 (기본적인 형식만)
    const phoneRegex = /^[0-9-+\s()]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 체크 (선택적 - 중복 허용할 경우 주석 처리)
    /*
    const existingSurvey = await prisma.surveyResponse.findFirst({
      where: {
        email: email
      }
    });

    if (existingSurvey) {
      return NextResponse.json(
        { error: '이미 진단을 완료하신 이메일입니다.' },
        { status: 409 }
      );
    }
    */

    // 요청 메타 정보 수집
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIP || request.ip || null;
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    // 설문 응답 저장
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        businessStage,
        mainConcern,
        currentWebsite,
        desiredTimeline,
        budgetRange,
        dataCollection,
        desiredData,
        brandingSituation,
        brandDirection,
        name,
        phone,
        email,
        company: company || null,
        ipAddress,
        userAgent,
        referrer,
        status: 'pending',
        isProcessed: false
      }
    });

    console.log('설문 응답 저장 성공:', surveyResponse.id);

    // 맞춤형 추천 로직 (간단한 버전)
    const recommendations = generateRecommendations({
      businessStage,
      budgetRange,
      mainConcern,
      currentWebsite
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '설문이 성공적으로 제출되었습니다.',
      surveyId: surveyResponse.id,
      recommendations
    }, { status: 201 });

  } catch (error) {
    console.error('Survey submission error:', error);
    
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 맞춤형 추천 로직
function generateRecommendations(data: {
  businessStage: string;
  budgetRange: string;
  mainConcern: string;
  currentWebsite: string;
}) {
  const { businessStage, budgetRange, mainConcern, currentWebsite } = data;
  
  // AI 개발 중심 추천
  if (currentWebsite === 'none' || currentWebsite === 'old_tech') {
    if (budgetRange === 'under_1000') {
      return {
        primary: 'AI MVP 개발',
        price: '1,000만원',
        description: '빠른 시장 진입을 위한 MVP 개발',
        timeline: '6주',
        features: ['Next.js + Supabase', 'AI API 통합', 'CMS 시스템']
      };
    } else if (budgetRange === '1000-2000') {
      return {
        primary: 'AI 풀서비스 + Fast Track',
        price: '1,300만원',
        description: '빠른 개발과 풍부한 기능',
        timeline: '4주',
        features: ['Fast Track 개발', '통합 로그인', 'n8n 자동화']
      };
    } else {
      return {
        primary: 'AI 엔터프라이즈',
        price: '2,000만원',
        description: '맞춤형 AI 모델과 완전한 시스템',
        timeline: '8주',
        features: ['맞춤형 AI 모델', '마케팅 자동화', '실시간 대시보드']
      };
    }
  }
  
  // 데이터 운영 중심 추천
  if (mainConcern === 'data_utilization') {
    return {
      primary: '데이터 프로',
      price: '350만원',
      description: '고도화된 데이터 분석 시스템',
      timeline: '최대 구독',
      features: ['A/B 테스트', '실시간 알림', '맞춤 개체 제안']
    };
  }
  
  // 브랜딩 중심 추천
  if (mainConcern === 'brand_differentiation') {
    return {
      primary: '브랜딩 프로',
      price: '350만원',
      description: '브랜드 차별화 솔루션',
      timeline: '4주',
      features: ['브랜드 전략 컨설팅', '로고/가이드라인', '마케팅 콘텐츠']
    };
  }
  
  // 기본 추천 (예비창업자)
  return {
    primary: 'AI MVP 개발',
    price: '1,000만원',
    description: '시작하기 좋은 기본 패키지',
    timeline: '6주',
    features: ['기본 AI 기능', '웹사이트 구축', '초기 마케팅 지원']
  };
}