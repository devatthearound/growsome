-- 샘플 블로그 데이터 추가 (UUID 버전)
-- Supabase SQL Editor에서 실행하세요

-- 1. 샘플 카테고리 추가
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('기술', 'technology', '프로그래밍과 기술에 관한 포스트', '#3B82F6', 1),
('비즈니스', 'business', '비즈니스 인사이트와 전략', '#10B981', 2),
('라이프스타일', 'lifestyle', '라이프스타일과 개인 발전', '#F59E0B', 3),
('뉴스', 'news', '최신 뉴스와 업데이트', '#EF4444', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. 샘플 태그 추가
INSERT INTO blog_tags (name, slug, description, color) VALUES
('JavaScript', 'javascript', 'JavaScript 관련 포스트', '#F7DF1E'),
('React', 'react', 'React 관련 포스트', '#61DAFB'),
('Next.js', 'nextjs', 'Next.js 관련 포스트', '#000000'),
('TypeScript', 'typescript', 'TypeScript 관련 포스트', '#3178C6'),
('웹개발', 'web-development', '웹 개발 관련 포스트', '#FF6B6B'),
('스타트업', 'startup', '스타트업 관련 포스트', '#4ECDC4'),
('마케팅', 'marketing', '마케팅 관련 포스트', '#45B7D1'),
('디자인', 'design', '디자인 관련 포스트', '#96CEB4')
ON CONFLICT (slug) DO NOTHING;

-- 3. 샘플 블로그 포스트 추가
INSERT INTO blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  category_id, 
  status, 
  published_at,
  tags,
  featured,
  reading_time
) VALUES 
(
  '블로그에 오신 것을 환영합니다!',
  'welcome-to-our-blog',
  '# 블로그에 오신 것을 환영합니다!

저희 블로그에 방문해주셔서 감사합니다. 이곳에서는 다양한 주제의 흥미로운 컨텐츠를 만나보실 수 있습니다.

## 무엇을 기대하실 수 있나요?

- 최신 기술 트렌드와 개발 팁
- 비즈니스 인사이트와 전략
- 실용적인 라이프스타일 가이드
- 업계 뉴스와 분석

## 시작하기

저희와 함께 새로운 지식을 탐험해보세요! 궁금한 점이 있으시면 언제든 댓글로 남겨주세요.

앞으로 더 많은 유용한 컨텐츠로 찾아뵙겠습니다.',
  '저희 새로운 블로그에 오신 것을 환영합니다! 앞으로 게시될 포스트들에서 무엇을 기대하실 수 있는지 알아보세요.',
  (SELECT id FROM blog_categories WHERE slug = 'news' LIMIT 1),
  'published',
  NOW(),
  ARRAY['환영', '공지사항', '시작'],
  true,
  3
),
(
  'Next.js와 React로 현대적인 웹 애플리케이션 구축하기',
  'building-modern-web-apps-with-nextjs-react',
  '# Next.js와 React로 현대적인 웹 애플리케이션 구축하기

현대 웹 개발에서 Next.js는 React 기반의 풀스택 프레임워크로 많은 개발자들에게 사랑받고 있습니다.

## Next.js의 주요 장점

### 1. Server-Side Rendering (SSR)
- 초기 페이지 로딩 속도 향상
- SEO 최적화
- 더 나은 사용자 경험

### 2. Static Site Generation (SSG)
- 빌드 타임에 페이지 생성
- CDN을 통한 빠른 배포
- 높은 성능과 보안

### 3. API Routes
- 백엔드 로직을 같은 프로젝트에서 관리
- Serverless 함수 지원
- 간편한 데이터베이스 연결

## 실습 예제

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from Next.js API!" });
}
```

## 마무리

Next.js는 개발자 경험과 성능을 모두 만족시키는 훌륭한 프레임워크입니다. 새로운 프로젝트를 시작한다면 적극 추천드립니다!',
  'Next.js와 React를 사용해서 현대적이고 성능이 뛰어난 웹 애플리케이션을 구축하는 방법을 알아보세요.',
  (SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1),
  'published',
  NOW() - INTERVAL '1 day',
  ARRAY['Next.js', 'React', '웹개발', 'JavaScript'],
  true,
  8
),
(
  '스타트업 성공을 위한 5가지 핵심 전략',
  'five-key-strategies-for-startup-success',
  '# 스타트업 성공을 위한 5가지 핵심 전략

스타트업의 성공은 우연이 아닙니다. 체계적인 전략과 실행이 뒷받침되어야 합니다.

## 1. 명확한 가치 제안 (Value Proposition)

### 고객의 문제 파악
- 실제 존재하는 문제인가?
- 고객이 돈을 지불할 만큼 중요한 문제인가?
- 기존 해결책의 한계는 무엇인가?

### 차별화된 솔루션
- 경쟁사 대비 10배 이상 나은 해결책
- 독특하고 기억에 남는 브랜딩
- 명확하고 간단한 메시지

## 2. 고객 중심 사고

### 고객 개발 (Customer Development)
- 가설 설정 → 검증 → 피벗
- 정성적/정량적 피드백 수집
- 빠른 실험과 학습

## 3. 린 스타트업 방법론

### MVP (Minimum Viable Product)
- 핵심 기능만 담은 최소 제품
- 빠른 시장 진입
- 사용자 피드백 기반 개선

## 4. 팀 빌딩과 문화

### 올바른 팀 구성
- 상호 보완적인 스킬셋
- 공동의 비전과 가치관
- 투명한 커뮤니케이션

## 5. 자금 조달과 재무 관리

### 현금 흐름 관리
- 런웨이 계산과 관리
- 수익 모델 검증
- 투자 유치 전략

## 마무리

성공하는 스타트업은 고객의 진짜 문제를 해결하고, 빠르게 학습하며, 올바른 팀과 함께 실행하는 곳입니다.',
  '스타트업이 성공하기 위해 반드시 알아야 할 5가지 핵심 전략을 실무 경험을 바탕으로 소개합니다.',
  (SELECT id FROM blog_categories WHERE slug = 'business' LIMIT 1),
  'published',
  NOW() - INTERVAL '2 days',
  ARRAY['스타트업', '비즈니스', '전략', '창업'],
  false,
  6
),
(
  '개발자를 위한 생산성 향상 워크플로우',
  'productivity-workflow-for-developers',
  '# 개발자를 위한 생산성 향상 워크플로우

효율적인 개발 워크플로우는 개발자의 생산성을 크게 좌우합니다. 검증된 방법들을 소개합니다.

## 개발 환경 최적화

### IDE/에디터 설정
- **VS Code Extensions**
  - Prettier (코드 포맷팅)
  - ESLint (코드 품질)
  - GitLens (Git 통합)
  - Auto Rename Tag (HTML/JSX)

### 터미널 최적화
- **Oh My Zsh** 설치
- 유용한 별칭(alias) 설정
- **tmux**로 세션 관리

## Git 워크플로우

### 브랜치 전략
```bash
# Feature branch 생성
git checkout -b feature/user-authentication

# 작업 완료 후 커밋
git add .
git commit -m "feat: add user authentication"

# 메인 브랜치로 머지
git checkout main
git merge feature/user-authentication
```

### 커밋 메시지 컨벤션
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 스타일 변경
- `refactor:` 코드 리팩토링

## 시간 관리

### 포모도로 기법
1. 25분 집중 작업
2. 5분 휴식
3. 4번 반복 후 긴 휴식

### 태스크 우선순위
- **중요도 + 긴급도** 매트릭스 활용
- 하루 3개의 핵심 태스크 선정
- 회고를 통한 지속적 개선

## 학습과 성장

### 꾸준한 학습
- **매일 30분** 새로운 기술 학습
- **오픈소스 기여**로 실력 향상
- **기술 블로그** 작성으로 지식 정리

## 마무리

생산성은 단순히 더 빨리 코딩하는 것이 아닙니다. 더 스마트하게 일하는 방법을 찾는 것입니다.',
  '개발 업무의 효율성을 극대화하는 검증된 워크플로우와 도구들을 소개합니다.',
  (SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1),
  'published',
  NOW() - INTERVAL '3 days',
  ARRAY['생산성', '개발자', '워크플로우', 'Git'],
  false,
  7
)
ON CONFLICT (slug) DO NOTHING;

-- 4. 뷰 카운트 업데이트 (랜덤한 값으로)
UPDATE blog_posts 
SET view_count = FLOOR(RANDOM() * 1000 + 100)::integer 
WHERE status = 'published';

-- 5. 데이터 확인
SELECT 
  'Categories' as table_name,
  COUNT(*) as count
FROM blog_categories
WHERE is_active = true

UNION ALL

SELECT 
  'Posts' as table_name,
  COUNT(*) as count
FROM blog_posts
WHERE status = 'published'

UNION ALL

SELECT 
  'Tags' as table_name,
  COUNT(*) as count
FROM blog_tags;

-- 완료 메시지
SELECT '샘플 데이터가 성공적으로 추가되었습니다!' as message;
