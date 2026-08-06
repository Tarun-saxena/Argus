-- CreateEnum
CREATE TYPE "TriageState" AS ENUM ('INBOX', 'BOOKMARKED', 'CLAIMED', 'IGNORED');

-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "state" "TriageState" NOT NULL DEFAULT 'INBOX';

-- CreateIndex
CREATE INDEX "recommendations_user_id_state_idx" ON "recommendations"("user_id", "state");
