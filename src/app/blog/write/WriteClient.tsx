"use client";
import { Suspense } from 'react';
import BlogWriter from '@/components/blog/blog-writer';

export default function WriteClient() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <BlogWriter mode="create" />
    </Suspense>
  );
} 