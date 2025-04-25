// lib/edge-auth.ts
// Edge Runtime에서 사용할 수 있는 최소한의 인증 유틸리티

import { jwtVerify, SignJWT } from 'jose'; // Edge Runtime 호환 JWT 라이브러리

// 토큰 이름 상수 (일관성을 위해 모든 파일에서 공유)
export const ACCESS_TOKEN_NAME = 'coupas_access_token';
export const REFRESH_TOKEN_NAME = 'coupas_refresh_token';

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 토큰 검증 함수 (Edge Runtime 호환)
export async function verifyJWTEdge(token: string) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    throw error;
  }
}

// 토큰 생성 함수 (Edge Runtime 호환)
export async function generateJWTEdge(payload: any, expiresIn: string) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    // expiration 계산 (예: '2h' -> 현재시간 + 2시간)
    let expiration;
    if (expiresIn.endsWith('h')) {
      const hours = parseInt(expiresIn.slice(0, -1));
      expiration = Math.floor(Date.now() / 1000) + hours * 60 * 60;
    } else if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.slice(0, -1));
      expiration = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      const minutes = parseInt(expiresIn.slice(0, -1));
      expiration = Math.floor(Date.now() / 1000) + minutes * 60;
    } else {
      // 기본값 1시간
      expiration = Math.floor(Date.now() / 1000) + 3600;
    }
    
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(secretKey);
    
    return jwt;
  } catch (error) {
    throw error;
  }
}

// 토큰 해싱 함수 (Edge Runtime용)
export function hashTokenEdge(token: string): string {
  // Edge Runtime에서는 crypto.subtle API 사용
  return btoa(token).slice(0, 64); // 간단한 base64 인코딩 (실제 환경에서는 더 강력한 해싱 사용)
}