/*
  Warnings:

  - You are about to drop the column `manufactureYear` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `maunfacturer` on the `Car` table. All the data in the column will be lost.
  - Added the required column `manufacturer` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturingYear` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "manufactureYear",
DROP COLUMN "maunfacturer",
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "manufacturingYear" INTEGER NOT NULL;
