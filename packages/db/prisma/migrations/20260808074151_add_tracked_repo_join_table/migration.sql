-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "github_created_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tracked_repos" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "repo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracked_repos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tracked_repos_user_id_idx" ON "tracked_repos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracked_repos_user_id_repo_id_key" ON "tracked_repos"("user_id", "repo_id");

-- AddForeignKey
ALTER TABLE "tracked_repos" ADD CONSTRAINT "tracked_repos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracked_repos" ADD CONSTRAINT "tracked_repos_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "repos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
