/*
  Warnings:

  - You are about to drop the column `tax` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Order` table. All the data in the column will be lost.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "tax";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "tax";
