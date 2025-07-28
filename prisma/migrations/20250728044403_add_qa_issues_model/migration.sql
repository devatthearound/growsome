-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" VARCHAR(20) NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "qa_issues" (
    "id" SERIAL NOT NULL,
    "issue_number" VARCHAR(20) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "page" VARCHAR(255),
    "location" VARCHAR(255) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "priority" VARCHAR(5) NOT NULL DEFAULT 'P2',
    "assignee" VARCHAR(100),
    "created_by" VARCHAR(100) NOT NULL,
    "screenshot_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qa_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qa_issues_issue_number_key" ON "qa_issues"("issue_number");

-- CreateIndex
CREATE INDEX "idx_qa_issues_status" ON "qa_issues"("status");

-- CreateIndex
CREATE INDEX "idx_qa_issues_category" ON "qa_issues"("category");

-- CreateIndex
CREATE INDEX "idx_qa_issues_priority" ON "qa_issues"("priority");

-- CreateIndex
CREATE INDEX "idx_qa_issues_assignee" ON "qa_issues"("assignee");

-- CreateIndex
CREATE INDEX "idx_qa_issues_created" ON "qa_issues"("created_at");
