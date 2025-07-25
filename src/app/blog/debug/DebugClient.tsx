"use client";
import { Suspense } from 'react';
import BlogDebugPage from './DebugPageInner';

export default function DebugClient() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <BlogDebugPage />
    </Suspense>
  );
} 