"use client";
import { Suspense } from 'react';
import SpecialGift from './SpecialGiftInner';

export default function SpecialGiftClient() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SpecialGift />
    </Suspense>
  );
} 