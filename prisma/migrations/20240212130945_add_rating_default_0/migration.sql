/*
  Warnings:

  - You are about to drop the column `tax` on the `CatalogProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CatalogProduct" DROP COLUMN "tax",
ALTER COLUMN "rating" SET DEFAULT 0;
