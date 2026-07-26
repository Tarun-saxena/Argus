/*
  Warnings:

  - You are about to drop the column `preferred_difficulty` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_issue_types` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "preferred_difficulty",
DROP COLUMN "preferred_issue_types";
