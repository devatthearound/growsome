"use client";
import { Suspense } from 'react';
import EventClient from './EventClient';

export default function EventPage() {
  return (
    <Suspense fallback={<div>이벤트 페이지 로딩중...</div>}>
      <EventClient />
    </Suspense>
  );
} 