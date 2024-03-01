/*
  Warnings:

  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "total",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
