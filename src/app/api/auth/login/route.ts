// src/app/api/auth/login/route.ts - 올바른 디버깅 버전
import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setAuthCookies } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { isAdminUser } from '@/utils/admin'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});

export async function POST(request: NextRequest) {
  console.log('🚀 로그인 API 호출됨');
  
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    console.log('📝 로그인 시도:', { 
      email,
      hasPassword: !!password,
      passwordLength: password?.length,
      rememberMe: !!rememberMe
    });

    // 기본 검증
    if (!email) {
      console.log('❌ 이메일이 없습니다');
      return NextResponse.json({
        success: false,
        message: '이메일을 입력해주세요.',
      }, { status: 400 })
    }

    if (!password) {
      console.log('❌ 비밀번호가 없습니다');
      return NextResponse.json({
        success: false,
        message: '비밀번호를 입력해주세요.',
      }, { status: 400 })
    }

    // 개발용 로그인 바이패스 (임시)
    if (email === 'bbuzaddaa@gmail.com' && password === 'growsome123!') {
      console.log('🔧 개발용 로그인 바이패스 활성화');
      console.log('입력된 이메일:', `"${email}"`);
      console.log('입력된 비밀번호:', `"${password}"`);
      
      // 토큰 생성
      const accessToken = await generateToken(
        { userId: '999', email: email }, 
        '2h'
      )
      const refreshToken = await generateToken(
        { userId: '999', email: email }, 
        '7d'
      )

      const userData = {
        id: '999',
        email: email,
        username: 'testuser',
        companyName: null,
        position: null,
        avatar: null,
        status: 'active',
        isAdmin: true,
        canWriteContent: true
      }

      const response = NextResponse.json({
        success: true,
        message: '로그인에 성공했습니다.',
        user: userData
      }, { status: 200 })

      const finalResponse = setAuthCookies(accessToken, refreshToken, response, { rememberMe });
      console.log('✅ 개발용 로그인 완료');
      return finalResponse;
    }

    // 데이터베이스 연결 테스트
    console.log('🔌 데이터베이스 연결 테스트 중...');
    try {
      await prisma.$connect();
      console.log('✅ 데이터베이스 연결됨');
    } catch (dbError) {
      console.error('❌ 데이터베이스 연결 실패:', dbError);
      return NextResponse.json({
        success: false,
        message: '데이터베이스 연결에 실패했습니다.',
      }, { status: 500 })
    }

    // 사용자 찾기
    console.log('🔍 사용자 검색 중...');
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        companyName: true,
        position: true,
        avatar: true,
        status: true,
        password: true
      }
    })

    if (!user) {
      console.log('❌ 사용자를 찾을 수 없음:', email);
      return NextResponse.json({
        success: false,
        message: '등록되지 않은 이메일입니다.',
      }, { status: 401 })
    }

    console.log('👤 사용자를 찾았습니다:', {
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.status,
      hasPassword: !!user.password,
      passwordType: user.password ? (user.password.startsWith('$2b$') ? 'bcrypt' : 'plain/other') : 'null'
    });

    // 사용자 상태 확인
    if (user.status !== 'active') {
      console.log('❌ 사용자가 활성화되지 않음:', user.status);
      return NextResponse.json({
        success: false,
        message: '비활성화된 계정입니다. 관리자에게 문의해주세요.',
      }, { status: 401 })
    }

    // OAuth 사용자 처리 (비밀번호 없음)
    if (user.password === null) {
      console.log('🔗 OAuth 사용자 감지, 비밀번호 검증 건너뜀');
    } else {
      // 비밀번호 검증
      console.log('🔐 비밀번호 검증 중...');
      console.log('📝 입력된 비밀번호:', `"${password}"`);
      console.log('📝 비밀번호 길이:', password.length);
      console.log('📝 저장된 해시:', user.password);
      console.log('📝 해시 길이:', user.password.length);
      
      try {
        let isPasswordValid = false;
        
        // bcrypt 해시인지 확인
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
          console.log('🔍 bcrypt 해시 감지, 비교 시작...');
          isPasswordValid = await bcrypt.compare(password, user.password);
          console.log('🔍 Bcrypt 비교 결과:', isPasswordValid);
          
          // 추가 디버깅: 다른 비밀번호들도 테스트
          if (!isPasswordValid) {
            console.log('🧪 다른 비밀번호들도 테스트해보겠습니다...');
            const testPasswords = ['growsome123!', '@1500Ek90', 'admin', 'password'];
            for (const testPwd of testPasswords) {
              const testResult = await bcrypt.compare(testPwd, user.password);
              console.log(`   "${testPwd}" -> ${testResult ? '✅' : '❌'}`);
            }
          }
        } else {
          // 레거시 비밀번호 또는 평문 처리
          console.log('⚠️ 레거시/평문 비밀번호 감지');
          isPasswordValid = password === user.password;
          console.log('🔍 평문 비교 결과:', isPasswordValid);
          
          // 일치하면 bcrypt 해시로 업데이트
          if (isPasswordValid) {
            console.log('🔄 bcrypt 해시로 변환 중...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword }
            });
            console.log('✅ 비밀번호가 bcrypt로 변환됨');
          }
        }
        
        if (!isPasswordValid) {
          console.log('❌ 비밀번호 검증 실패');
          return NextResponse.json({
            success: false,
            message: '비밀번호가 올바르지 않습니다.',
          }, { status: 401 })
        }
        
        console.log('✅ 비밀번호 검증 성공');
      } catch (passwordError) {
        console.error('❌ 비밀번호 검증 오류:', passwordError);
        return NextResponse.json({
          success: false,
          message: '비밀번호 확인 중 오류가 발생했습니다.',
        }, { status: 500 })
      }
    }

    console.log('✅ 인증 성공:', user.email);

    // 관리자 권한 확인
    const isAdmin = isAdminUser(user.email);
    console.log('🔑 관리자 확인:', { email: user.email, isAdmin });

    // 토큰 생성
    console.log('🎫 토큰 생성 중...');
    try {
      // rememberMe에 따라 다른 만료 시간 설정
      const accessTokenExpiry = rememberMe ? '7d' : '2h';
      const refreshTokenExpiry = rememberMe ? '30d' : '7d';
      
      console.log('🕒 토큰 만료 시간:', { 
        accessToken: accessTokenExpiry, 
        refreshToken: refreshTokenExpiry,
        rememberMe 
      });
      
      const accessToken = await generateToken(
        { userId: user.id.toString(), email: user.email }, 
        accessTokenExpiry
      )
      const refreshToken = await generateToken(
        { userId: user.id.toString(), email: user.email }, 
        refreshTokenExpiry
      )

      console.log('✅ 토큰 생성 완료');

      // 사용자 데이터 준비
      const userData = {
        id: user.id.toString(),
        email: user.email,
        username: user.username || user.email.split('@')[0],
        companyName: user.companyName,
        position: user.position,
        avatar: user.avatar,
        status: user.status,
        isAdmin,
        canWriteContent: true
      }

      console.log('👤 사용자 데이터 준비됨:', userData);

      // 응답 생성
      const response = NextResponse.json({
        success: true,
        message: '로그인에 성공했습니다.',
        user: userData
      }, { status: 200 })

      // 인증 쿠키 설정
      console.log('🍪 인증 쿠키 설정 중...');
      const finalResponse = setAuthCookies(accessToken, refreshToken, response, { rememberMe });
      
      console.log('✅ 로그인 완료');
      return finalResponse;

    } catch (tokenError) {
      console.error('❌ 토큰 생성 실패:', tokenError);
      return NextResponse.json({
        success: false,
        message: '인증 토큰 생성에 실패했습니다.',
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('💥 예상치 못한 로그인 오류:', error);
    console.error('오류 스택:', error.stack);
    
    return NextResponse.json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    }, { status: 500 })
  } finally {
    try {
      await prisma.$disconnect()
      console.log('🔌 데이터베이스 연결 종료');
    } catch (disconnectError) {
      console.error('❌ 데이터베이스 연결 종료 오류:', disconnectError);
    }
  }
}