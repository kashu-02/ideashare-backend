/*
  Warnings:

  - Added the required column `shortTitle` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "shortTitle" TEXT NOT NULL;
