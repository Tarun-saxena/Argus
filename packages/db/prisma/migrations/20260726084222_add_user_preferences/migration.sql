/*
  Warnings:

  - You are about to drop the column `skill` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "skill",
ADD COLUMN     "preferred_difficulty" TEXT,
ADD COLUMN     "preferred_issue_types" TEXT[],
ADD COLUMN     "skills" TEXT[];
