/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `contractName` on the `Contract` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[manufacturer,model]` on the table `CarModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carModelId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `contractPrice` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resolutionDate` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileSize` on table `ContractDocument` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentType` on table `ContractDocument` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contractId` on table `ContractDocument` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- DropIndex
DROP INDEX "Car_companyId_idx";

-- DropIndex
DROP INDEX "Company_companyName_key";

-- DropIndex
DROP INDEX "Customer_companyId_email_idx";

-- DropIndex
DROP INDEX "Customer_companyId_idx";

-- DropIndex
DROP INDEX "User_companyId_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "manufacturer",
DROP COLUMN "model",
DROP COLUMN "type",
ADD COLUMN     "carModelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "contractName",
ALTER COLUMN "contractPrice" SET NOT NULL,
ALTER COLUMN "resolutionDate" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ContractDocument" ALTER COLUMN "fileSize" SET NOT NULL,
ALTER COLUMN "contentType" SET NOT NULL,
ALTER COLUMN "contractId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Car_carModelId_idx" ON "Car"("carModelId");

-- CreateIndex
CREATE INDEX "CarModel_type_idx" ON "CarModel"("type");

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_manufacturer_model_key" ON "CarModel"("manufacturer", "model");

-- CreateIndex
CREATE INDEX "Contract_companyId_userId_idx" ON "Contract"("companyId", "userId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
