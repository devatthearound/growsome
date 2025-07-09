-- Supabase에 샘플 블로그 데이터 추가하기
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
  'Next.js 15 새로운 기능 살펴보기',
  'nextjs-15-new-features',
  '# Next.js 15의 새로운 기능들

Next.js 15가 출시되면서 많은 개발자들이 주목하고 있습니다. 이번 버전에서 추가된 주요 기능들을 살펴보겠습니다.

## 주요 변경사항

### 1. 개선된 App Router
- 더 빠른 페이지 로딩
- 향상된 성능 최적화
- 새로운 캐싱 전략

### 2. React 19 지원
- 최신 React 기능 활용
- Server Components 개선
- Suspense 경계 최적화

### 3. 번들 크기 최적화
- Tree shaking 개선
- 불필요한 코드 제거
- 더 작은 번들 크기

## 마무리

Next.js 15는 개발자 경험과 성능 모두를 크게 개선했습니다. 새로운 프로젝트에서 시도해보시기 바랍니다!',
  'Next.js 15에서 새롭게 추가된 기능들과 개선사항을 자세히 살펴보고, 실제 프로젝트에 어떻게 적용할 수 있는지 알아보세요.',
  (SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1),
  'published',
  NOW() - INTERVAL '1 day',
  ARRAY['Next.js', 'React', '웹개발'],
  true,
  7
),
(
  '효과적인 팀 커뮤니케이션 전략',
  'effective-team-communication-strategies',
  '# 효과적인 팀 커뮤니케이션 전략

성공적인 팀워크의 핵심은 원활한 커뮤니케이션입니다. 다음은 팀 커뮤니케이션을 개선하는 실용적인 전략들입니다.

## 1. 명확한 커뮤니케이션 채널 설정

### 용도별 채널 구분
- 긴급 사항: 전화 또는 즉석 메시징
- 일반 업무: 이메일 또는 협업 도구
- 브레인스토밍: 화상회의 또는 대면 미팅

## 2. 정기적인 체크인 미팅

### 효과적인 미팅 운영
- 명확한 안건 설정
- 시간 제한 준수
- 액션 아이템 정리

## 3. 피드백 문화 조성

### 건설적인 피드백
- 구체적이고 행동 지향적
- 해결책 중심
- 적절한 타이밍

## 마무리

좋은 커뮤니케이션은 하루아침에 만들어지지 않습니다. 지속적인 노력과 개선을 통해 팀의 협업 능력을 향상시켜보세요.',
  '팀의 생산성을 높이고 협업을 개선하는 효과적인 커뮤니케이션 전략들을 소개합니다.',
  (SELECT id FROM blog_categories WHERE slug = 'business' LIMIT 1),
  'published',
  NOW() - INTERVAL '2 days',
  ARRAY['팀워크', '커뮤니케이션', '비즈니스'],
  false,
  5
),
(
  '개발자를 위한 생산성 향상 팁',
  'productivity-tips-for-developers',
  '# 개발자를 위한 생산성 향상 팁

개발 업무의 효율성을 높이고 더 나은 코드를 작성하기 위한 실용적인 팁들을 공유합니다.

## 1. 코딩 환경 최적화

### IDE 및 에디터 설정
- 유용한 확장 프로그램 설치
- 코드 스니펫 활용
- 단축키 마스터하기

### 개발 도구 활용
- Git 워크플로우 최적화
- 자동화 스크립트 작성
- 테스트 환경 구축

## 2. 시간 관리 기법

### 포모도로 기법
- 25분 집중 + 5분 휴식
- 장시간 집중력 유지
- 번아웃 방지

### 태스크 우선순위 설정
- 중요도와 긴급도 분류
- 데일리 플래닝
- 회고와 개선

## 3. 학습과 성장

### 지속적인 학습
- 새로운 기술 탐구
- 오픈소스 기여
- 커뮤니티 참여

## 마무리

생산성 향상은 단순히 더 빨리 코딩하는 것이 아닙니다. 더 나은 방식으로 일하는 것입니다.',
  '개발자의 업무 효율성을 높이고 더 나은 코드를 작성하기 위한 검증된 생산성 향상 방법들을 소개합니다.',
  (SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1),
  'published',
  NOW() - INTERVAL '3 days',
  ARRAY['생산성', '개발자', 'Tips'],
  false,
  6
)
ON CONFLICT (slug) DO NOTHING;

-- 4. 뷰 카운트 업데이트 (랜덤한 값으로)
UPDATE blog_posts SET view_count = FLOOR(RANDOM() * 1000 + 100) WHERE status = 'published';

-- 5. 카테고리별 포스트 수 확인 (옵션)
-- SELECT 
--   c.name as category_name,
--   COUNT(p.id) as post_count
-- FROM blog_categories c
-- LEFT JOIN blog_posts p ON c.id = p.category_id AND p.status = 'published'
-- GROUP BY c.id, c.name
-- ORDER BY c.sort_order;
