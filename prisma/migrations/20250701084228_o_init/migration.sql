/*
  Warnings:

  - You are about to drop the column `type` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the `entrepreneur_partners` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "partners" DROP COLUMN "type",
ADD COLUMN     "service" TEXT[],
ADD COLUMN     "status" "PartnerStatus" NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "entrepreneur_partners";

-- CreateTable
CREATE TABLE "agreements" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agreements_partnerId_key" ON "agreements"("partnerId");

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
