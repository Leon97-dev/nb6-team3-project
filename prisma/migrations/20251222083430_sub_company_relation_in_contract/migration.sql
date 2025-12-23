-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_companyId_fkey";

-- DropIndex
DROP INDEX "Contract_companyId_carId_idx";

-- DropIndex
DROP INDEX "Contract_companyId_customerId_idx";

-- DropIndex
DROP INDEX "Contract_companyId_status_idx";

-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
