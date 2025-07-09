-- Supabase RLS 정책 수정
-- 이미 테이블이 있으므로 정책만 추가/수정합니다

-- 1. 기존 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename LIKE 'blog_%';

-- 2. RLS 비활성화 (개발 중에만 사용, 나중에 다시 활성화 필요)
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags DISABLE ROW LEVEL SECURITY;

-- 또는 모든 사용자가 읽을 수 있는 정책 추가
-- ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.blog_posts;
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.blog_categories;

-- CREATE POLICY "Enable read access for all users" ON public.blog_posts
--   FOR SELECT USING (true);

-- CREATE POLICY "Enable read access for all users" ON public.blog_categories
--   FOR SELECT USING (true);

-- 3. 테이블 존재 확인
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'blog_%'
ORDER BY table_name;

-- 완료 메시지
SELECT 'RLS 정책이 수정되었습니다!' as message;
