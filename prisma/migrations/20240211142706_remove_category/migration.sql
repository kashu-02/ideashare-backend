/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the `ProblemCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_categoryId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "ProblemCategory";
