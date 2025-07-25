'use client';

import { Suspense } from 'react';
import { EnhancedGoogleAnalytics } from './EnhancedGoogleAnalytics';

export default function SafeEnhancedGoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <EnhancedGoogleAnalytics />
    </Suspense>
  );
} 