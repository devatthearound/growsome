"use client";
import { Suspense } from 'react';
import SpecialGiftClient from './SpecialGiftClient';

export default function SpecialGiftPage() {
  return (
    <Suspense fallback={<div>스페셜 기프트 페이지 로딩중...</div>}>
      <SpecialGiftClient />
    </Suspense>
  );
} 