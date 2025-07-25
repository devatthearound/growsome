"use client";
import { Suspense } from 'react';
import GraphQLTestPage from './GraphQLTestPageInner';

export default function TestGraphqlClient() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <GraphQLTestPage />
    </Suspense>
  );
} 