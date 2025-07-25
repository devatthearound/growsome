'use client';

import { Suspense } from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';

export default function SafeGoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics />
    </Suspense>
  );
} 