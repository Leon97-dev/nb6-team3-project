/*
  Warnings:

  - The values [carInspection,priceNegotiation,contractDraft,contractSuccessful,contractFailed] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `companyId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContractStatus_new" AS ENUM ('CAR_INSPECTION', 'PRICE_NEGOTIATION', 'CONTRACT_DRAFT', 'CONTRACT_SUCCESSFUL', 'CONTRACT_FAILED');
ALTER TABLE "public"."Contract" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contract" ALTER COLUMN "status" TYPE "ContractStatus_new" USING ("status"::text::"ContractStatus_new");
ALTER TYPE "ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "Contract" ALTER COLUMN "status" SET DEFAULT 'CAR_INSPECTION';
COMMIT;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "companyId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CAR_INSPECTION';

-- CreateIndex
CREATE INDEX "Contract_companyId_status_idx" ON "Contract"("companyId", "status");

-- CreateIndex
CREATE INDEX "Contract_companyId_customerId_idx" ON "Contract"("companyId", "customerId");

-- CreateIndex
CREATE INDEX "Contract_companyId_carId_idx" ON "Contract"("companyId", "carId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
