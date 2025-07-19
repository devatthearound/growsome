-- 댓글 데이터 모두 삭제
DELETE FROM post_comments;

-- 좋아요 데이터도 함께 삭제 (선택사항)
DELETE FROM post_likes;

-- 시퀀스 초기화 (새 댓글 ID를 1부터 시작)
ALTER SEQUENCE post_comments_id_seq RESTART WITH 1;
ALTER SEQUENCE post_likes_id_seq RESTART WITH 1;

-- 확인
SELECT COUNT(*) as comment_count FROM post_comments;
SELECT COUNT(*) as like_count FROM post_likes;
