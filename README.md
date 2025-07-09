This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Microsoft Clarity Analytics

이 프로젝트는 Microsoft Clarity를 사용하여 사용자 행동 분석을 수행합니다.

### 설정

1. **패키지 설치**: `@microsoft/clarity` 패키지가 설치되어 있습니다.
2. **초기화**: `src/components/common/ClarityAnalytics.tsx`에서 Clarity가 초기화됩니다.
3. **프로젝트 ID**: `sc5g8v1frb`가 사용됩니다.

### 주요 기능

- **자동 사용자 식별**: 로그인 상태에 따라 사용자를 자동으로 식별합니다.
- **페이지 뷰 추적**: 모든 페이지 방문을 자동으로 추적합니다.
- **커스텀 이벤트**: 버튼 클릭, 폼 제출 등 사용자 액션을 추적합니다.
- **태그 설정**: 사용자 타입, 페이지 정보 등을 태그로 설정합니다.

### 사용법

```typescript
import { clarityUtils } from '../utils/clarity';

// 버튼 클릭 추적
clarityUtils.trackButtonClick("button_name", "location");

// 폼 제출 추적
clarityUtils.trackFormSubmit("form_name", true);

// 사용자 액션 추적
clarityUtils.trackUserAction("action_name", { detail: "value" });
```

### 대시보드

Clarity 데이터는 [Microsoft Clarity](https://clarity.microsoft.com/)에서 확인할 수 있습니다.

### 개인정보 보호

- 사용자 ID는 해시화되어 전송됩니다.
- GDPR 준수를 위해 쿠키 동의 기능이 포함되어 있습니다.
- 필요시 `ClarityAnalytics.tsx`에서 `Clarity.consent(false)`로 추적을 비활성화할 수 있습니다.
