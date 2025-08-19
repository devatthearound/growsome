# SEO용 이미지 파일 생성 안내

## 필요한 이미지 파일들

### 1. 파비콘 (필수)
다음 파일들을 생성해서 `/public` 폴더에 넣어주세요:

- `favicon.ico` (16x16, 32x32, 48x48 멀티 사이즈)
- `favicon-16x16.png` (16x16)
- `favicon-32x32.png` (32x32)
- `apple-touch-icon.png` (180x180)

### 2. Open Graph 기본 이미지
- `/public/images/og/growsome-main.jpg` (1200x630)
- 그로우썸 로고와 브랜딩이 포함된 이미지

### 3. 임시 파비콘 생성
간단한 텍스트 기반 파비콘을 온라인 도구로 생성할 수 있습니다:
- https://favicon.io/favicon-generator/
- https://realfavicongenerator.net/

### 4. 자동 생성되는 이미지
블로그 포스트용 OG 이미지는 `/api/og/blog` 엔드포인트에서 자동 생성됩니다.

## 현재 상태
- ✅ OG 이미지 API 구현 완료
- ✅ 이미지 디렉토리 생성 완료
- ❌ 기본 파비콘 필요
- ❌ 기본 OG 이미지 필요
