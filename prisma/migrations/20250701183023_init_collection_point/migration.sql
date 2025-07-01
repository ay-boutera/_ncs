/*
  Warnings:

  - Added the required column `address` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
