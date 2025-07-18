-- 블로그 시스템용 데이터베이스 생성 스크립트
-- PostgreSQL 관리자 계정으로 실행하세요

-- 1. 데이터베이스 생성
CREATE DATABASE growsome_blog 
    WITH 
    OWNER = admin
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 2. 권한 부여
GRANT ALL PRIVILEGES ON DATABASE growsome_blog TO admin;

-- 연결 확인
\c growsome_blog;
SELECT 'growsome_blog 데이터베이스가 성공적으로 생성되었습니다!' as message;
