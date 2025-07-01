/*
  Warnings:

  - You are about to drop the `agreements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "agreements" DROP CONSTRAINT "agreements_partnerId_fkey";

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "agreements";
