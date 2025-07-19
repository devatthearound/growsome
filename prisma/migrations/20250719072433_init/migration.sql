/*
  Warnings:

  - You are about to alter the column `slug` on the `blog_categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `blog_categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `blog_contents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `blog_contents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `status` column on the `blog_contents` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `blog_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `blog_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_content_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_content_tags" DROP CONSTRAINT "blog_content_tags_content_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_content_tags" DROP CONSTRAINT "blog_content_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_contents" DROP CONSTRAINT "blog_contents_author_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_contents" DROP CONSTRAINT "blog_contents_category_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_likes" DROP CONSTRAINT "blog_likes_content_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_likes" DROP CONSTRAINT "blog_likes_user_id_fkey";

-- AlterTable
ALTER TABLE "blog_categories" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "is_visible" DROP NOT NULL,
ALTER COLUMN "sort_order" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "blog_comments" ALTER COLUMN "is_approved" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "blog_contents" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
DROP COLUMN "status",
ADD COLUMN     "status" VARCHAR(20) DEFAULT 'DRAFT',
ALTER COLUMN "is_featured" DROP NOT NULL,
ALTER COLUMN "is_hero" DROP NOT NULL,
ALTER COLUMN "view_count" DROP NOT NULL,
ALTER COLUMN "like_count" DROP NOT NULL,
ALTER COLUMN "comment_count" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "published_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "blog_likes" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "blog_tags" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" VARCHAR(255);

-- DropEnum
DROP TYPE "ContentStatus";

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" SERIAL NOT NULL,
    "business_stage" VARCHAR(50) NOT NULL,
    "main_concern" VARCHAR(50) NOT NULL,
    "current_website" VARCHAR(50) NOT NULL,
    "desired_timeline" VARCHAR(50) NOT NULL,
    "budget_range" VARCHAR(50) NOT NULL,
    "data_collection" VARCHAR(50) NOT NULL,
    "desired_data" VARCHAR(50) NOT NULL,
    "branding_situation" VARCHAR(50) NOT NULL,
    "brand_direction" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "company" VARCHAR(200),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "referrer" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "contacted_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "short_description" VARCHAR(500),
    "vimeo_id" VARCHAR(50) NOT NULL,
    "vimeo_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "duration" INTEGER,
    "category_id" INTEGER NOT NULL,
    "level" VARCHAR(20) NOT NULL DEFAULT 'beginner',
    "tags" VARCHAR(50)[],
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT true,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "watch_time" INTEGER NOT NULL DEFAULT 0,
    "last_position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_survey_responses_email" ON "survey_responses"("email");

-- CreateIndex
CREATE INDEX "idx_survey_responses_phone" ON "survey_responses"("phone");

-- CreateIndex
CREATE INDEX "idx_survey_responses_status" ON "survey_responses"("status");

-- CreateIndex
CREATE INDEX "idx_survey_responses_created" ON "survey_responses"("created_at");

-- CreateIndex
CREATE INDEX "idx_survey_responses_processed" ON "survey_responses"("is_processed");

-- CreateIndex
CREATE UNIQUE INDEX "course_categories_slug_key" ON "course_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_course_categories_slug" ON "course_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_course_categories_visible" ON "course_categories"("is_visible");

-- CreateIndex
CREATE INDEX "idx_course_categories_sort" ON "course_categories"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "idx_courses_slug" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "idx_courses_category" ON "courses"("category_id");

-- CreateIndex
CREATE INDEX "idx_courses_visible" ON "courses"("is_visible");

-- CreateIndex
CREATE INDEX "idx_courses_premium" ON "courses"("is_premium");

-- CreateIndex
CREATE INDEX "idx_courses_public" ON "courses"("is_public");

-- CreateIndex
CREATE INDEX "idx_courses_sort" ON "courses"("sort_order");

-- CreateIndex
CREATE INDEX "idx_courses_published" ON "courses"("published_at");

-- CreateIndex
CREATE INDEX "idx_user_course_progress_user" ON "user_course_progress"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_course_progress_course" ON "user_course_progress"("course_id");

-- CreateIndex
CREATE INDEX "idx_user_course_progress_completed" ON "user_course_progress"("is_completed");

-- CreateIndex
CREATE UNIQUE INDEX "user_course_progress_user_id_course_id_key" ON "user_course_progress"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "idx_blog_categories_slug" ON "blog_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_blog_categories_visible" ON "blog_categories"("is_visible");

-- CreateIndex
CREATE INDEX "idx_blog_contents_author" ON "blog_contents"("author_id");

-- CreateIndex
CREATE INDEX "idx_blog_contents_category" ON "blog_contents"("category_id");

-- CreateIndex
CREATE INDEX "idx_blog_contents_category_id" ON "blog_contents"("category_id");

-- CreateIndex
CREATE INDEX "idx_blog_contents_published" ON "blog_contents"("published_at");

-- CreateIndex
CREATE INDEX "idx_blog_contents_published_at" ON "blog_contents"("published_at");

-- CreateIndex
CREATE INDEX "idx_blog_contents_slug" ON "blog_contents"("slug");

-- CreateIndex
CREATE INDEX "idx_blog_contents_status" ON "blog_contents"("status");

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "blog_contents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "blog_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_content_tags" ADD CONSTRAINT "blog_content_tags_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "blog_contents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_content_tags" ADD CONSTRAINT "blog_content_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_contents" ADD CONSTRAINT "blog_contents_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_contents" ADD CONSTRAINT "blog_contents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "blog_contents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
